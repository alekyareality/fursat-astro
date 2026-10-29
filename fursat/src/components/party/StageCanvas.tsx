import { useEffect, useMemo } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { animate } from 'motion';

// 300 / 30 / 0.8 spring, written to the three.js objects found by name.
const SPRING = { type: 'spring', stiffness: 300, damping: 30, mass: 0.8 } as const;
const GOLD = '#E0A63C', GREEN = '#34522A', TERRA = '#C2431A', CREAM = '#F6EBD3';

function Cloche() {
  const dome = useMemo(() => {
    const pts: THREE.Vector2[] = [];
    for (let i = 0; i <= 24; i++) { const a = (i / 24) * (Math.PI / 2); pts.push(new THREE.Vector2(Math.cos(a) * 1.25, Math.sin(a) * 1.0)); }
    return pts;
  }, []);
  return (
    <group name="Stage">
      <mesh name="Plate" position={[0, 0, 0]}>
        <cylinderGeometry args={[1.7, 1.7, 0.1, 48]} />
        <meshStandardMaterial color={CREAM} roughness={0.55} metalness={0.05} />
      </mesh>
      <mesh position={[0, 0.07, 0]}>
        <cylinderGeometry args={[1.45, 1.5, 0.06, 48]} />
        <meshStandardMaterial color={GREEN} roughness={0.6} />
      </mesh>
      <group name="Treats" position={[0, 0.4, 0]}>
        <mesh position={[-0.5, 0, 0.1]}><sphereGeometry args={[0.34, 24, 16]} /><meshStandardMaterial color={GOLD} roughness={0.4} metalness={0.5} /></mesh>
        <mesh position={[0.35, 0, 0.35]}><sphereGeometry args={[0.3, 24, 16]} /><meshStandardMaterial color={TERRA} roughness={0.5} /></mesh>
        <mesh position={[0.2, 0, -0.45]}><sphereGeometry args={[0.28, 24, 16]} /><meshStandardMaterial color={CREAM} roughness={0.5} /></mesh>
      </group>
      <group name="Lid" position={[0, 0.1, 0]}>
        <mesh>
          <latheGeometry args={[dome, 48]} />
          <meshStandardMaterial color={GOLD} roughness={0.35} metalness={0.7} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 1.08, 0]}><sphereGeometry args={[0.13, 20, 14]} /><meshStandardMaterial color={GOLD} roughness={0.25} metalness={0.9} /></mesh>
      </group>
    </group>
  );
}

// Targets are looked up by name; events come from the page script (party.js).
function Controller() {
  const scene = useThree((s) => s.scene);
  const invalidate = useThree((s) => s.invalidate);
  const el = useThree((s) => s.gl.domElement);

  useEffect(() => {
    const lid = scene.getObjectByName('Lid')!;
    const stage = scene.getObjectByName('Stage')!;
    let lidAnim: { stop: () => void } | null = null, tiltAnim: { stop: () => void } | null = null, t = 0;
    const restY = lid.position.y;
    const toLid = (to: number) => { lidAnim?.stop(); lidAnim = animate(lid.position.y, to, { ...SPRING, onUpdate: (v) => { lid.position.y = v; invalidate(); } }); };

    const lift = () => { clearTimeout(t); toLid(restY + 0.9); t = window.setTimeout(() => toLid(restY), 1600); };
    const hop = () => { clearTimeout(t); toLid(restY + 0.22); t = window.setTimeout(() => toLid(restY), 140); };
    let tx = 0, tz = 0;
    const tiltTo = (x: number, z: number) => {
      tiltAnim?.stop();
      const fx = tx, fz = tz;
      tiltAnim = animate(0, 1, { ...SPRING, onUpdate: (k) => { tx = fx + (x - fx) * k; tz = fz + (z - fz) * k; stage.rotation.x = tx; stage.rotation.z = tz; invalidate(); } });
    };
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      tiltTo(((e.clientY - r.top) / r.height - 0.5) * 0.14, -((e.clientX - r.left) / r.width - 0.5) * 0.2);
    };
    const leave = () => tiltTo(0, 0);

    window.addEventListener('fursat:plan', lift);
    window.addEventListener('fursat:pkg', hop);
    const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (fine) { el.addEventListener('pointermove', move); el.addEventListener('pointerleave', leave); }
    invalidate();
    return () => {
      clearTimeout(t); lidAnim?.stop(); tiltAnim?.stop();
      window.removeEventListener('fursat:plan', lift); window.removeEventListener('fursat:pkg', hop);
      el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave);
    };
  }, [scene, invalidate, el]);
  return null;
}

export default function StageCanvas({ onReady }: { onReady: () => void }) {
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 2]}
      camera={{ position: [0, 2.4, 7.4], fov: 30 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      onCreated={({ camera, invalidate }) => { camera.lookAt(0, 0.85, 0); invalidate(); requestAnimationFrame(onReady); }}
      style={{ position: 'absolute', inset: 0 }}
      aria-hidden="true"
    >
      <hemisphereLight args={['#FFF3D6', '#5a6b3a', 1.6]} />
      <directionalLight position={[3, 5, 3]} intensity={3} />
      <directionalLight position={[-4, 2, -2]} intensity={0.6} color="#E0A63C" />
      <Cloche />
      <Controller />
    </Canvas>
  );
}
