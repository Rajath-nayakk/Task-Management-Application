import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { use3DStore } from '../../store/use3DStore';

interface ChipProps {
  label: string;
  position: [number, number, number];
  opacity: number;
  color: string;
}

const FloatingChip: React.FC<ChipProps> = ({ label, position, opacity, color }) => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.position.y = position[1] + Math.sin(t * 1.5 + position[0]) * 0.08;
  });

  if (opacity <= 0.02) return null;

  return (
    <group ref={meshRef} position={position}>
      <mesh>
        <planeGeometry args={[1.6, 0.45]} />
        <meshBasicMaterial
          color="#0f172a"
          transparent
          opacity={opacity * 0.85}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Border glow */}
      <lineSegments>
        <edgesGeometry args={[new THREE.PlaneGeometry(1.6, 0.45)]} />
        <lineBasicMaterial color={color} transparent opacity={opacity * 0.7} />
      </lineSegments>
      <Text
        position={[0, 0, 0.02]}
        fontSize={0.13}
        color="#f8fafc"
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
      >
        {label}
      </Text>
    </group>
  );
};

export const TaskCore: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const topSlabRef = useRef<THREE.Group>(null);
  const midSlabRef = useRef<THREE.Group>(null);
  const btmSlabRef = useRef<THREE.Group>(null);

  const { scrollProgress, accent, isReducedMotion, setHoveredSlab } = use3DStore();

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    const { pointer } = state;

    // Subtle gentle float & mouse parallax
    if (!isReducedMotion) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        pointer.x * 0.35 + Math.sin(t * 0.4) * 0.1,
        0.05
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -pointer.y * 0.25 + Math.cos(t * 0.3) * 0.05,
        0.05
      );
      groupRef.current.position.y = Math.sin(t * 0.6) * 0.1;
    }

    // Exploded view separation based on scrollProgress (0 = assembled, 1 = exploded)
    const separation = isReducedMotion ? 0.3 : scrollProgress * 2.2;

    if (topSlabRef.current) {
      topSlabRef.current.position.y = THREE.MathUtils.lerp(
        topSlabRef.current.position.y,
        0.95 + separation * 1.1,
        0.08
      );
      topSlabRef.current.rotation.z = THREE.MathUtils.lerp(
        topSlabRef.current.rotation.z,
        scrollProgress * 0.12,
        0.08
      );
    }

    if (midSlabRef.current) {
      midSlabRef.current.position.y = 0;
      midSlabRef.current.rotation.y = THREE.MathUtils.lerp(
        midSlabRef.current.rotation.y,
        scrollProgress * 0.2,
        0.08
      );
    }

    if (btmSlabRef.current) {
      btmSlabRef.current.position.y = THREE.MathUtils.lerp(
        btmSlabRef.current.position.y,
        -0.95 - separation * 1.1,
        0.08
      );
      btmSlabRef.current.rotation.z = THREE.MathUtils.lerp(
        btmSlabRef.current.rotation.z,
        -scrollProgress * 0.12,
        0.08
      );
    }
  });

  const chipOpacity = Math.min(1, Math.max(0, (scrollProgress - 0.15) * 2.5));

  return (
    <group ref={groupRef}>
      {/* TOP SLAB: DONE */}
      <group
        ref={topSlabRef}
        position={[0, 0.95, 0]}
        onPointerOver={() => setHoveredSlab('done')}
        onPointerOut={() => setHoveredSlab(null)}
      >
        <RoundedBox args={[4.4, 0.75, 2.4]} radius={0.12} smoothness={4}>
          <meshPhysicalMaterial
            color="#090d16"
            emissive="#10b981"
            emissiveIntensity={0.2}
            roughness={0.2}
            metalness={0.3}
            clearcoat={0.8}
            clearcoatRoughness={0.15}
            transparent
            opacity={0.92}
          />
        </RoundedBox>

        {/* Emissive border lines */}
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(4.42, 0.77, 2.42)]} />
          <lineBasicMaterial color="#34d399" transparent opacity={0.6} />
        </lineSegments>

        {/* Front Title Label */}
        <Text
          position={[0, 0, 1.23]}
          fontSize={0.28}
          color="#a7f3d0"
          anchorX="center"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/plusjakartasans/v8/LDIbaomQNQcsA88c7O9yZ4KMCoOg4Ko20yygg_Pb.woff"
        >
          ✓ DONE
        </Text>

        {/* Floating Task Chips around Top Slab */}
        <FloatingChip
          label="✓ Project Scaffold & Review"
          position={[2.8, 0.3, 0.4]}
          opacity={chipOpacity}
          color="#10b981"
        />
        <FloatingChip
          label="✓ Dark Theme Persistence"
          position={[-2.7, -0.2, 0.2]}
          opacity={chipOpacity}
          color="#10b981"
        />
      </group>

      {/* MIDDLE SLAB: IN PROGRESS (Centerpiece, colored by user accent) */}
      <group
        ref={midSlabRef}
        position={[0, 0, 0]}
        onPointerOver={() => setHoveredSlab('in-progress')}
        onPointerOut={() => setHoveredSlab(null)}
      >
        <RoundedBox args={[4.8, 0.85, 2.6]} radius={0.14} smoothness={4}>
          <meshPhysicalMaterial
            color="#0b0f19"
            emissive={accent.hex}
            emissiveIntensity={0.4}
            roughness={0.15}
            metalness={0.4}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
            transparent
            opacity={0.94}
          />
        </RoundedBox>

        {/* Emissive border lines matching accent */}
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(4.82, 0.87, 2.62)]} />
          <lineBasicMaterial color={accent.hex} transparent opacity={0.85} />
        </lineSegments>

        <Text
          position={[0, 0, 1.33]}
          fontSize={0.32}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/plusjakartasans/v8/LDIbaomQNQcsA88c7O9yZ4KMCoOg4Ko20yygg_Pb.woff"
        >
          ⚡ IN PROGRESS
        </Text>

        {/* Floating Task Chips around Middle Slab */}
        <FloatingChip
          label="⚡ 3D Exploded View Engine"
          position={[3.0, 0.4, 0.6]}
          opacity={chipOpacity}
          color={accent.hex}
        />
        <FloatingChip
          label="⚡ Real-time Customizer Panel"
          position={[-3.0, 0.1, 0.5]}
          opacity={chipOpacity}
          color={accent.hex}
        />
      </group>

      {/* BOTTOM SLAB: TO DO */}
      <group
        ref={btmSlabRef}
        position={[0, -0.95, 0]}
        onPointerOver={() => setHoveredSlab('todo')}
        onPointerOut={() => setHoveredSlab(null)}
      >
        <RoundedBox args={[4.4, 0.75, 2.4]} radius={0.12} smoothness={4}>
          <meshPhysicalMaterial
            color="#080c14"
            emissive="#3b82f6"
            emissiveIntensity={0.2}
            roughness={0.25}
            metalness={0.25}
            clearcoat={0.7}
            clearcoatRoughness={0.2}
            transparent
            opacity={0.9}
          />
        </RoundedBox>

        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(4.42, 0.77, 2.42)]} />
          <lineBasicMaterial color="#60a5fa" transparent opacity={0.5} />
        </lineSegments>

        <Text
          position={[0, 0, 1.23]}
          fontSize={0.28}
          color="#bfdbfe"
          anchorX="center"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/plusjakartasans/v8/LDIbaomQNQcsA88c7O9yZ4KMCoOg4Ko20yygg_Pb.woff"
        >
          ⏳ TO DO
        </Text>

        {/* Floating Task Chips around Bottom Slab */}
        <FloatingChip
          label="⏳ Supabase PostgreSQL Migrations"
          position={[2.7, -0.3, 0.3]}
          opacity={chipOpacity}
          color="#60a5fa"
        />
        <FloatingChip
          label="⏳ JWT Cookie Auth & Roles"
          position={[-2.8, -0.4, 0.4]}
          opacity={chipOpacity}
          color="#60a5fa"
        />
      </group>

      {/* Procedural ambient dust / particle field */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[
              new Float32Array(
                Array.from({ length: 450 }, () => (Math.random() - 0.5) * 16)
              ),
              3,
            ]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.035}
          color={accent.hex}
          transparent
          opacity={0.4}
          sizeAttenuation
        />
      </points>
    </group>
  );
};
