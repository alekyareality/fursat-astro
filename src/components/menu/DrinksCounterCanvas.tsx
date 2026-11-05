import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 3D Cocktail Glass, Shaker, Bottles and Glowing Counter
function BarElements({ isExpanded }: { isExpanded: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const liquidRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Subtle floating and rotating animation
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = Math.sin(t * 0.4) * 0.12 + (hovered ? 0.2 : 0);
    groupRef.current.position.y = Math.sin(t * 0.8) * 0.04;

    if (liquidRef.current) {
      liquidRef.current.rotation.y = t * 0.2;
    }
  });

  // Texture for the bar marble counter
  const barTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#17200F';
    ctx.fillRect(0, 0, 512, 512);
    // Draw marble veins
    ctx.strokeStyle = '#E0A63C';
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.25;
    for (let i = 0; i < 15; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * 512, 0);
      ctx.bezierCurveTo(Math.random() * 512, 180, Math.random() * 512, 340, Math.random() * 512, 512);
      ctx.stroke();
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }, []);

  return (
    <group 
      ref={groupRef} 
      position={[0, -0.4, 0]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* 3D Bar Counter Base */}
      <mesh position={[0, -0.7, 0]}>
        <boxGeometry args={[4.2, 1.2, 2.0]} />
        <meshStandardMaterial 
          map={barTexture}
          color="#12190B"
          roughness={0.3} 
          metalness={0.2} 
        />
      </mesh>

      {/* Illuminated Gold Counter Edge */}
      <mesh position={[0, -0.08, 0.98]}>
        <boxGeometry args={[4.22, 0.08, 0.06]} />
        <meshStandardMaterial color="#E0A63C" emissive="#C88D25" emissiveIntensity={0.8} metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Rear Mirror / Bar Back Wall */}
      <mesh position={[0, 1.0, -0.9]}>
        <planeGeometry args={[4.0, 2.2]} />
        <meshStandardMaterial color="#0A0F06" roughness={0.1} metalness={0.8} />
      </mesh>

      {/* Back Glass Shelves */}
      <mesh position={[0, 0.7, -0.6]}>
        <boxGeometry args={[3.8, 0.05, 0.5]} />
        <meshPhysicalMaterial color="#ffffff" transmission={0.9} opacity={1} transparent roughness={0.1} ior={1.5} />
      </mesh>
      <mesh position={[0, 1.4, -0.6]}>
        <boxGeometry args={[3.8, 0.05, 0.5]} />
        <meshPhysicalMaterial color="#ffffff" transmission={0.9} opacity={1} transparent roughness={0.1} ior={1.5} />
      </mesh>

      {/* 3D Liquor & Cocktail Bottles on Shelf */}
      {/* Amber Whiskey Bottle */}
      <group position={[-1.2, 0.95, -0.6]}>
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.11, 0.11, 0.45, 16]} />
          <meshPhysicalMaterial color="#C97B14" transmission={0.7} roughness={0.15} metalness={0.1} transparent />
        </mesh>
        <mesh position={[0, 0.48, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.14, 16]} />
          <meshStandardMaterial color="#E0A63C" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* Emerald Gin Bottle */}
      <group position={[-0.7, 0.95, -0.6]}>
        <mesh position={[0, 0.22, 0]}>
          <boxGeometry args={[0.22, 0.46, 0.16]} />
          <meshPhysicalMaterial color="#1B5E20" transmission={0.75} roughness={0.1} metalness={0.05} transparent />
        </mesh>
        <mesh position={[0, 0.52, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.14, 16]} />
          <meshStandardMaterial color="#C0C0C0" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* Ruby Bitter / Campari Bottle */}
      <group position={[0.8, 0.95, -0.6]}>
        <mesh position={[0, 0.22, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.48, 16]} />
          <meshPhysicalMaterial color="#B71C1C" transmission={0.8} roughness={0.1} metalness={0.05} transparent />
        </mesh>
        <mesh position={[0, 0.52, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.12, 16]} />
          <meshStandardMaterial color="#E0A63C" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* Forefront: Stainless Steel / Gold Cocktail Shaker */}
      <group position={[0.75, 0.25, 0.35]}>
        {/* Shaker Base */}
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.18, 0.13, 0.46, 24]} />
          <meshStandardMaterial color="#E0A63C" metalness={0.92} roughness={0.18} />
        </mesh>
        {/* Shaker Cap */}
        <mesh position={[0, 0.48, 0]}>
          <cylinderGeometry args={[0.12, 0.18, 0.16, 24]} />
          <meshStandardMaterial color="#C88D25" metalness={0.95} roughness={0.15} />
        </mesh>
        <mesh position={[0, 0.6, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.1, 16]} />
          <meshStandardMaterial color="#E0A63C" metalness={0.92} roughness={0.18} />
        </mesh>
      </group>

      {/* Forefront Centerpiece: The Fursat Coupe Cocktail Glass */}
      <group position={[-0.3, 0.22, 0.4]}>
        {/* Glass Base */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.02, 32]} />
          <meshPhysicalMaterial color="#ffffff" transmission={0.95} roughness={0.05} transparent ior={1.5} />
        </mesh>
        {/* Stem */}
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.5, 16]} />
          <meshPhysicalMaterial color="#ffffff" transmission={0.95} roughness={0.05} transparent ior={1.5} />
        </mesh>
        {/* Coupe Bowl */}
        <mesh position={[0, 0.55, 0]}>
          <sphereGeometry args={[0.32, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshPhysicalMaterial color="#ffffff" transmission={0.92} roughness={0.05} transparent ior={1.5} side={THREE.DoubleSide} />
        </mesh>
        {/* Liquid (Fursat Sunset Gradient) */}
        <mesh ref={liquidRef} position={[0, 0.52, 0]}>
          <cylinderGeometry args={[0.3, 0.1, 0.18, 32]} />
          <meshPhysicalMaterial color="#E65100" emissive="#FF6D00" emissiveIntensity={0.25} transmission={0.65} roughness={0.1} transparent />
        </mesh>
        {/* Citrus Garnish Wheel */}
        <mesh position={[0.22, 0.65, 0]} rotation={[0.4, 0.3, 0.8]}>
          <cylinderGeometry args={[0.13, 0.13, 0.015, 24]} />
          <meshStandardMaterial color="#FFB300" roughness={0.4} />
        </mesh>
      </group>
    </group>
  );
}

export default function DrinksCounterCanvas({ isExpanded }: { isExpanded: boolean }) {
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setHasWebGL(false);
    } catch {
      setHasWebGL(false);
    }
  }, []);

  return (
    <div className="w-full h-full relative cursor-pointer select-none overflow-hidden">
      {hasWebGL ? (
        <Canvas
          camera={{ position: [0, 1.4, isExpanded ? 3.4 : 4.4], fov: 38 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        >
          <ambientLight intensity={0.9} color="#FFE6B3" />
          <pointLight position={[0, 3, 1.5]} intensity={3.5} color="#FFD54F" distance={8} />
          <pointLight position={[-2, 1, 1]} intensity={2.0} color="#E0A63C" distance={6} />
          <directionalLight position={[3, 4, 3]} intensity={2.2} color="#FFF8E1" />
          <directionalLight position={[-3, 2, -2]} intensity={0.8} color="#FF8F00" />
          
          <BarElements isExpanded={isExpanded} />
        </Canvas>
      ) : (
        <div className="w-full h-full relative">
          <img 
            src="/assets/interior/fursat_space_08.webp" 
            alt="Fursat 3D Drinks Counter" 
            className="w-full h-full object-cover brightness-90 contrast-105" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#12190B] via-transparent to-transparent" />
        </div>
      )}
    </div>
  );
}
