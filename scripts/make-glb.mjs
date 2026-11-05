/**
 * make-glb.mjs
 * Writes two minimal GLB files (plate.glb, bowl.glb) into public/models/.
 * Geometry only — no embedded textures. Each well under 200 KB.
 * Uses a hand-rolled GLB writer (binary glTF 2.0) so no three.js import needed.
 *
 * Run: node scripts/make-glb.mjs
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dir, '..', 'public', 'models');
mkdirSync(OUT, { recursive: true });

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Build a glTF 2.0 JSON + BIN buffer and write a .glb */
function writeGlb(outPath, json, binBuffer) {
  const jsonStr = JSON.stringify(json);
  // Pad JSON to 4-byte boundary
  const jsonPadLen = (4 - (jsonStr.length % 4)) % 4;
  const jsonChunkData = Buffer.from(jsonStr + ' '.repeat(jsonPadLen), 'utf8');

  // Pad BIN to 4-byte boundary
  const binPad = (4 - (binBuffer.length % 4)) % 4;
  const binChunkData = Buffer.concat([binBuffer, Buffer.alloc(binPad, 0)]);

  const headerLen = 12;
  const jsonChunkLen = 8 + jsonChunkData.length;
  const binChunkLen = binBuffer.length > 0 ? 8 + binChunkData.length : 0;
  const totalLen = headerLen + jsonChunkLen + binChunkLen;

  const out = Buffer.alloc(totalLen);
  let off = 0;

  // Header
  out.writeUInt32LE(0x46546C67, off); off += 4; // magic "glTF"
  out.writeUInt32LE(2, off); off += 4;           // version 2
  out.writeUInt32LE(totalLen, off); off += 4;    // total length

  // JSON chunk
  out.writeUInt32LE(jsonChunkData.length, off); off += 4;
  out.writeUInt32LE(0x4E4F534A, off); off += 4; // "JSON"
  jsonChunkData.copy(out, off); off += jsonChunkData.length;

  // BIN chunk
  if (binBuffer.length > 0) {
    out.writeUInt32LE(binChunkData.length, off); off += 4;
    out.writeUInt32LE(0x004E4942, off); off += 4; // "BIN\0"
    binChunkData.copy(out, off); off += binChunkData.length;
  }

  writeFileSync(outPath, out);
  console.log(`Wrote ${outPath} (${(out.length / 1024).toFixed(1)} KB)`);
}

// ── Geometry builders ────────────────────────────────────────────────────────

/**
 * Build a flat circular disc (plate top surface) with raised rim and base.
 * Returns { positions: Float32Array, indices: Uint16Array, normals: Float32Array }
 *
 * We build it as multiple cylinder-like rings merged into one mesh.
 */
function buildPlateGeometry() {
  const seg = 48; // angular segments
  const positions = [];
  const normals = [];
  const indices = [];

  // Helper: add a ring of vertices at y, radius, with normal ny
  function addRing(y, r, nx = 0, ny = 1, nz = 0) {
    const start = positions.length / 3;
    for (let i = 0; i <= seg; i++) {
      const a = (i / seg) * Math.PI * 2;
      positions.push(Math.cos(a) * r, y, Math.sin(a) * r);
      // For side walls, use radial normals; for flat caps use y normals
      if (ny !== 0 && nx === 0) {
        normals.push(0, ny, 0);
      } else {
        normals.push(Math.cos(a), 0, Math.sin(a));
      }
    }
    return start;
  }

  // ── Plate base disc (bottom) ──────────────────────────────────────────────
  // y=0.000 flat bottom
  const rBase = 0.52;
  const rInner = 0.08;
  const yBottom = 0.0;
  const yTop = 0.018;    // plate top surface
  const yRim = 0.028;    // rim lip

  // Centre vertex (bottom)
  const cBot = positions.length / 3;
  positions.push(0, yBottom, 0); normals.push(0, -1, 0);

  // Bottom ring (facing down)
  const r0bot = addRing(yBottom, rBase, 0, -1);
  // Fan triangles for bottom disc
  for (let i = 0; i < seg; i++) {
    indices.push(cBot, r0bot + i + 1, r0bot + i);
  }

  // ── Side wall (outer cylinder) ───────────────────────────────────────────
  const wallBot = addRing(yBottom, rBase, 1, 0);
  const wallTop = addRing(yTop, rBase, 1, 0);
  for (let i = 0; i < seg; i++) {
    indices.push(wallBot + i, wallTop + i, wallTop + i + 1);
    indices.push(wallBot + i, wallTop + i + 1, wallBot + i + 1);
  }

  // ── Plate top flat surface ────────────────────────────────────────────────
  // Annular ring from rInner to rBase at yTop (facing up)
  const cTop = positions.length / 3;
  positions.push(0, yTop, 0); normals.push(0, 1, 0);

  const topOuter = addRing(yTop, rBase, 0, 1);
  const topInner = addRing(yTop, rInner, 0, 1);

  // Fan from center to inner ring (small center disc)
  for (let i = 0; i < seg; i++) {
    indices.push(cTop, topInner + i, topInner + i + 1);
  }
  // Annular quads inner→outer
  for (let i = 0; i < seg; i++) {
    indices.push(topInner + i, topOuter + i, topOuter + i + 1);
    indices.push(topInner + i, topOuter + i + 1, topInner + i + 1);
  }

  // ── Rim lip (small upward flange at edge) ────────────────────────────────
  const rimBot = addRing(yTop, rBase * 1.04, 0, 1);
  const rimTop = addRing(yRim, rBase * 1.04, 0, 1);
  for (let i = 0; i < seg; i++) {
    indices.push(rimBot + i, rimTop + i, rimTop + i + 1);
    indices.push(rimBot + i, rimTop + i + 1, rimBot + i + 1);
  }

  return {
    positions: new Float32Array(positions),
    normals: new Float32Array(normals),
    indices: new Uint16Array(indices),
  };
}

/**
 * Build a simple bowl — hemispherical shell with flat rim.
 */
function buildBowlGeometry() {
  const latSeg = 20;
  const lonSeg = 48;
  const rOuter = 0.44;
  const rInner = 0.40;
  const positions = [];
  const normals = [];
  const indices = [];

  // Helper: add hemisphere shell ring at latitude angle a (0=equator, PI/2=top)
  function addLatRing(lat, r, normalDir) {
    const start = positions.length / 3;
    const y = -Math.sin(lat) * r;
    const rh = Math.cos(lat) * r;
    for (let j = 0; j <= lonSeg; j++) {
      const a = (j / lonSeg) * Math.PI * 2;
      const x = Math.cos(a) * rh;
      const z = Math.sin(a) * rh;
      positions.push(x, y, z);
      const nx = Math.cos(a) * Math.cos(lat) * normalDir;
      const ny = -Math.sin(lat) * normalDir;
      const nz = Math.sin(a) * Math.cos(lat) * normalDir;
      normals.push(nx, ny, nz);
    }
    return start;
  }

  // Outer shell rings (from equator down to bottom)
  const outerRings = [];
  for (let i = 0; i <= latSeg; i++) {
    const lat = (i / latSeg) * (Math.PI / 2);
    outerRings.push(addLatRing(lat, rOuter, 1));
  }

  // Inner shell rings (bottom to equator, inverted normals)
  const innerRings = [];
  for (let i = 0; i <= latSeg; i++) {
    const lat = ((latSeg - i) / latSeg) * (Math.PI / 2);
    innerRings.push(addLatRing(lat, rInner, -1));
  }

  // Outer shell quads
  for (let i = 0; i < latSeg; i++) {
    for (let j = 0; j < lonSeg; j++) {
      const a = outerRings[i] + j;
      const b = outerRings[i + 1] + j;
      indices.push(a, b, b + 1);
      indices.push(a, b + 1, a + 1);
    }
  }

  // Inner shell quads
  for (let i = 0; i < latSeg; i++) {
    for (let j = 0; j < lonSeg; j++) {
      const a = innerRings[i] + j;
      const b = innerRings[i + 1] + j;
      indices.push(a, b, b + 1);
      indices.push(a, b + 1, a + 1);
    }
  }

  // Annular rim cap at equator (flat top ring joining outer to inner)
  const rimOuter = [];
  const rimInner = [];
  for (let j = 0; j <= lonSeg; j++) {
    const a = (j / lonSeg) * Math.PI * 2;
    rimOuter.push(positions.length / 3);
    positions.push(Math.cos(a) * rOuter, 0, Math.sin(a) * rOuter);
    normals.push(0, 1, 0);
  }
  for (let j = 0; j <= lonSeg; j++) {
    const a = (j / lonSeg) * Math.PI * 2;
    rimInner.push(positions.length / 3);
    positions.push(Math.cos(a) * rInner, 0, Math.sin(a) * rInner);
    normals.push(0, 1, 0);
  }
  for (let j = 0; j < lonSeg; j++) {
    indices.push(rimOuter[j], rimInner[j], rimInner[j + 1]);
    indices.push(rimOuter[j], rimInner[j + 1], rimOuter[j + 1]);
  }

  return {
    positions: new Float32Array(positions),
    normals: new Float32Array(normals),
    indices: new Uint16Array(indices),
  };
}

// ── GLB builder ──────────────────────────────────────────────────────────────

function makeGlb(name, geom) {
  const { positions, normals, indices } = geom;

  const posBuf = Buffer.from(positions.buffer);
  const norBuf = Buffer.from(normals.buffer);
  const idxBuf = Buffer.from(indices.buffer);

  // Align all to 4 bytes
  function pad4(b) {
    const r = b.length % 4;
    return r === 0 ? b : Buffer.concat([b, Buffer.alloc(4 - r, 0)]);
  }

  const posAligned = pad4(posBuf);
  const norAligned = pad4(norBuf);
  const idxAligned = pad4(idxBuf);

  const binBuffer = Buffer.concat([idxAligned, posAligned, norAligned]);

  const idxOffset = 0;
  const posOffset = idxAligned.length;
  const norOffset = posOffset + posAligned.length;

  // Bounding box for positions
  let minX = Infinity, minY = Infinity, minZ = Infinity;
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
  for (let i = 0; i < positions.length; i += 3) {
    minX = Math.min(minX, positions[i]);     maxX = Math.max(maxX, positions[i]);
    minY = Math.min(minY, positions[i + 1]); maxY = Math.max(maxY, positions[i + 1]);
    minZ = Math.min(minZ, positions[i + 2]); maxZ = Math.max(maxZ, positions[i + 2]);
  }

  const json = {
    asset: { version: '2.0', generator: 'fursat-make-glb' },
    scene: 0,
    scenes: [{ nodes: [0] }],
    nodes: [{ mesh: 0, name }],
    meshes: [{
      name,
      primitives: [{
        attributes: { POSITION: 1, NORMAL: 2 },
        indices: 0,
        material: 0,
        mode: 4,
      }],
    }],
    materials: [{
      name: 'default',
      pbrMetallicRoughness: {
        baseColorFactor: [0.96, 0.92, 0.84, 1.0],
        metallicFactor: 0.05,
        roughnessFactor: 0.4,
      },
      doubleSided: false,
    }],
    accessors: [
      {
        // 0: indices
        bufferView: 0,
        componentType: 5123, // UNSIGNED_SHORT
        count: indices.length,
        type: 'SCALAR',
        byteOffset: 0,
      },
      {
        // 1: POSITION
        bufferView: 1,
        componentType: 5126, // FLOAT
        count: positions.length / 3,
        type: 'VEC3',
        min: [minX, minY, minZ],
        max: [maxX, maxY, maxZ],
        byteOffset: 0,
      },
      {
        // 2: NORMAL
        bufferView: 2,
        componentType: 5126,
        count: normals.length / 3,
        type: 'VEC3',
        byteOffset: 0,
      },
    ],
    bufferViews: [
      { buffer: 0, byteOffset: idxOffset, byteLength: idxBuf.length, target: 34963 },
      { buffer: 0, byteOffset: posOffset, byteLength: posBuf.length, target: 34962 },
      { buffer: 0, byteOffset: norOffset, byteLength: norBuf.length, target: 34962 },
    ],
    buffers: [{ byteLength: binBuffer.length }],
  };

  writeGlb(join(OUT, `${name}.glb`), json, binBuffer);
}

// ── Main ─────────────────────────────────────────────────────────────────────

makeGlb('plate', buildPlateGeometry());
makeGlb('bowl', buildBowlGeometry());
console.log('Done.');
