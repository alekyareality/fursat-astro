import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Circular Dish Plate with Real Image Texture
function DishPlate({ 
  imgUrl, 
  position, 
  rotation = [0, 0, 0], 
  radius = 0.52 
}: { 
  imgUrl: string; 
  position: [number, number, number]; 
  rotation?: [number, number, number];
  radius?: number;
}) {
  const texture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const tex = loader.load(imgUrl);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }, [imgUrl]);

  return (
    <group position={position} rotation={rotation}>
      {/* Outer Ceramic Charger Rim (Dark Emerald / Gold Trim) */}
      <mesh position={[0, -0.02, 0]}>
        <cylinderGeometry args={[radius * 1.15, radius * 1.12, 0.04, 36]} />
        <meshStandardMaterial color="#E0A63C" metalness={0.8} roughness={0.25} />
      </mesh>

      {/* Porcelain Plate Rim */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[radius * 1.05, radius * 0.95, 0.04, 36]} />
        <meshStandardMaterial color="#F6EBD3" roughness={0.3} metalness={0.05} />
      </mesh>

      {/* Plate Center with Real Food Texture */}
      <mesh position={[0, 0.025, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[radius * 0.92, 36]} />
        <meshBasicMaterial map={texture} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// 3D Dining Table with Interactive Cloche Lid
function TableElements({ isExpanded }: { isExpanded: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const clocheRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [clocheLifted, setClocheLifted] = useState(false);

  // Table marble/timber top texture
  const tableTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#2A1F13';
    ctx.fillRect(0, 0, 512, 512);
    // Draw wood grain
    ctx.strokeStyle = '#4A3722';
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.3;
    for (let i = 0; i < 40; i++) {
      ctx.beginPath();
      ctx.arc(256, 256, i * 14, 0, Math.PI * 2);
      ctx.stroke();
    }
    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }, []);

  // Cloche dome contour
  const domePts = useMemo(() => {
    const pts: THREE.Vector2[] = [];
    for (let i = 0; i <= 24; i++) {
      const a = (i / 24) * (Math.PI / 2);
      pts.push(new THREE.Vector2(Math.cos(a) * 0.75, Math.sin(a) * 0.65));
    }
    return pts;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = Math.cos(t * 0.35) * 0.14 + (hovered ? -0.2 : 0);
    groupRef.current.position.y = Math.sin(t * 0.75) * 0.03;

    // Smooth cloche animation
    if (clocheRef.current) {
      const targetY = clocheLifted ? 0.9 : 0.05;
      clocheRef.current.position.y = THREE.MathUtils.lerp(clocheRef.current.position.y, targetY, 0.08);
      clocheRef.current.rotation.z = THREE.MathUtils.lerp(clocheRef.current.rotation.z, clocheLifted ? -0.2 : 0, 0.08);
    }
  });

  return (
    <group 
      ref={groupRef} 
      position={[0, -0.3, 0]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* 3D Round Dining Table */}
      <mesh position={[0, -0.4, 0]}>
        <cylinderGeometry args={[2.5, 2.45, 0.12, 48]} />
        <meshStandardMaterial map={tableTexture} roughness={0.35} metalness={0.15} />
      </mesh>

      {/* Gold Inlaid Table Rim */}
      <mesh position={[0, -0.34, 0]}>
        <cylinderGeometry args={[2.53, 2.53, 0.05, 48]} />
        <meshStandardMaterial color="#E0A63C" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Plate 1: Angaraa Chicken Tikka */}
      <DishPlate 
        imgUrl="/assets/dishes/angaraa_chicken_tikka_.webp" 
        position={[-0.95, -0.28, 0.65]} 
        rotation={[-0.2, 0.3, 0]}
        radius={0.48}
      />

      {/* Plate 2: Tandoori Prawns */}
      <DishPlate 
        imgUrl="/assets/dishes/tandoori_prawns_.webp" 
        position={[0.95, -0.28, 0.65]} 
        rotation={[-0.2, -0.3, 0]}
        radius={0.48}
      />

      {/* Plate 3: Pandu Mirchi Kodi Kebab (Back) */}
      <DishPlate 
        imgUrl="/assets/dishes/pandu_mirchi_kodi_kebab.webp" 
        position={[-0.75, -0.28, -0.75]} 
        rotation={[0.1, 0.2, 0]}
        radius={0.42}
      />

      {/* Plate 4: Lotus Biscoff Dessert (Back) */}
      <DishPlate 
        imgUrl="/assets/dishes/lotus_biscoff_.webp" 
        position={[0.75, -0.28, -0.75]} 
        rotation={[0.1, -0.2, 0]}
        radius={0.42}
      />

      {/* Centerpiece: Signature Dish with Interactive Gold Cloche */}
      <group 
        position={[0, -0.28, 0]}
        onClick={(e) => {
          e.stopPropagation();
          setClocheLifted(!clocheLifted);
        }}
      >
        {/* Base Serving Platter */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.95, 0.95, 0.04, 36]} />
          <meshStandardMaterial color="#E0A63C" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Revealed Secret Dish (Fursat Nalli Gosht Biryani) */}
        <mesh position={[0, 0.025, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.82, 36]} />
          <meshBasicMaterial 
            map={useMemo(() => new THREE.TextureLoader().load('/assets/ask/dishes/nalli-ghost-biryani.webp'), [])} 
            side={THREE.DoubleSide} 
          />
        </mesh>

        {/* Gold Cloche Dome (Lifts on click) */}
        <group ref={clocheRef} position={[0, 0.05, 0]}>
          <mesh>
            <latheGeometry args={[domePts, 36]} />
            <meshStandardMaterial 
              color="#E0A63C" 
              metalness={0.92} 
              roughness={0.22} 
              side={THREE.DoubleSide} 
            />
          </mesh>
          {/* Top Handle Knob */}
          <mesh position={[0, 0.72, 0]}>
            <sphereGeometry args={[0.09, 16, 16]} />
            <meshStandardMaterial color="#FFD56B" metalness={0.95} roughness={0.15} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

export default function FoodTableCanvas({ isExpanded }: { isExpanded: boolean }) {
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) setHasWebGL(false);
      }
    } catch {
      setHasWebGL(false);
    }
  }, []);

  return (
    <div className="w-full h-full relative cursor-pointer select-none overflow-hidden">
      {hasWebGL ? (
        <Canvas
          camera={{ position: [0, 2.2, isExpanded ? 3.6 : 4.6], fov: 38 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        >
          <ambientLight intensity={0.9} color="#FFF8E7" />
          <pointLight position={[0, 3.5, 1]} intensity={3.5} color="#FFD54F" distance={8} />
          <directionalLight position={[3, 5, 2]} intensity={2.4} color="#FFF3E0" />
          <directionalLight position={[-3, 2, -1]} intensity={0.8} color="#FF8F00" />
          
          <TableElements isExpanded={isExpanded} />
        </Canvas>
      ) : (
        <div className="w-full h-full relative">
          <img 
            src="/assets/interior/fursat_space_02.webp" 
            alt="Fursat 3D Royal Dining Table" 
            className="w-full h-full object-cover brightness-90 contrast-105" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#12190B] via-transparent to-transparent" />
        </div>
      )}
    </div>
  );
}
