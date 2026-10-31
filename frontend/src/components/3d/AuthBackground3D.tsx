import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { use3DStore } from '../../store/use3DStore';
import { isWebGLAvailable, WebGLFallback } from './WebGLFallback';

const SlowFloatingCores: React.FC<{ accentColor: string }> = ({ accentColor }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.08;
    groupRef.current.rotation.x = Math.sin(t * 0.05) * 0.12;
    groupRef.current.position.y = Math.sin(t * 0.2) * 0.2;
  });

  return (
    <group ref={groupRef} position={[1.5, 0, -2]}>
      {/* Slab 1 */}
      <group position={[0, 1.2, 0]} rotation={[0.1, 0.2, 0.05]}>
        <RoundedBox args={[3.2, 0.5, 1.8]} radius={0.08} smoothness={4}>
          <meshPhysicalMaterial
            color="#0f172a"
            emissive="#10b981"
            emissiveIntensity={0.25}
            roughness={0.2}
            metalness={0.3}
            transparent
            opacity={0.8}
          />
        </RoundedBox>
      </group>

      {/* Slab 2 */}
      <group position={[0, 0, 0]} rotation={[-0.05, -0.15, -0.05]}>
        <RoundedBox args={[3.6, 0.6, 2.0]} radius={0.08} smoothness={4}>
          <meshPhysicalMaterial
            color="#0b0f19"
            emissive={accentColor}
            emissiveIntensity={0.4}
            roughness={0.15}
            metalness={0.4}
            transparent
            opacity={0.85}
          />
        </RoundedBox>
      </group>

      {/* Slab 3 */}
      <group position={[0, -1.2, 0]} rotation={[0.08, 0.1, -0.05]}>
        <RoundedBox args={[3.2, 0.5, 1.8]} radius={0.08} smoothness={4}>
          <meshPhysicalMaterial
            color="#0f172a"
            emissive="#38bdf8"
            emissiveIntensity={0.25}
            roughness={0.2}
            metalness={0.3}
            transparent
            opacity={0.8}
          />
        </RoundedBox>
      </group>

      {/* Star/dust field */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[
              new Float32Array(
                Array.from({ length: 250 }, () => (Math.random() - 0.5) * 14)
              ),
              3,
            ]}
          />
        </bufferGeometry>
        <pointsMaterial size={0.03} color={accentColor} transparent opacity={0.3} />
      </points>
    </group>
  );
};

export const AuthBackground3D: React.FC = () => {
  const { accent, isLowPower } = use3DStore();

  if (!isWebGLAvailable() || isLowPower) {
    return <WebGLFallback accentHex={accent.hex} className="fixed inset-0 z-0" />;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-slate-950">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        className="w-full h-full"
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 6, 4]} intensity={1.2} color={accent.hex} />
        <pointLight position={[-4, -5, 3]} intensity={0.6} color="#38bdf8" />
        <SlowFloatingCores accentColor={accent.hex} />
      </Canvas>
    </div>
  );
};
