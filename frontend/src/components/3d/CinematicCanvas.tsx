import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { TaskCore } from './TaskCore';
import { use3DStore } from '../../store/use3DStore';
import { WebGLFallback, isWebGLAvailable } from './WebGLFallback';

const CameraRig: React.FC = () => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const { scrollProgress, isReducedMotion } = use3DStore();

  useFrame((state) => {
    if (!cameraRef.current) return;

    if (isReducedMotion) {
      cameraRef.current.position.set(0, 0, 7.5);
      cameraRef.current.lookAt(0, 0, 0);
      return;
    }

    const { pointer } = state;

    // Cinematic scroll camera choreography:
    // At scrollProgress 0 (Hero): position [0, 0, 7.5]
    // At scrollProgress 0.35 (Plan): camera rises slightly [0.8, 1.2, 7.2]
    // At scrollProgress 0.7 (Track): camera pulls back and angles [-1.0, 0.4, 8.0]
    // At scrollProgress 1.0 (Collaborate): camera sweeps back [0, -0.2, 7.6]
    const targetX = (pointer.x * 0.4) + Math.sin(scrollProgress * Math.PI) * 1.2;
    const targetY = (pointer.y * 0.3) + Math.cos(scrollProgress * Math.PI * 0.5) * 0.8 - 0.4;
    const targetZ = 7.5 + scrollProgress * 1.5;

    cameraRef.current.position.x = THREE.MathUtils.lerp(
      cameraRef.current.position.x,
      targetX,
      0.05
    );
    cameraRef.current.position.y = THREE.MathUtils.lerp(
      cameraRef.current.position.y,
      targetY,
      0.05
    );
    cameraRef.current.position.z = THREE.MathUtils.lerp(
      cameraRef.current.position.z,
      targetZ,
      0.05
    );

    cameraRef.current.lookAt(0, 0, 0);
  });

  return <PerspectiveCamera ref={cameraRef} makeDefault fov={45} position={[0, 0, 7.5]} />;
};

export const CinematicCanvas: React.FC = () => {
  const { accent, isLowPower } = use3DStore();

  if (!isWebGLAvailable() || isLowPower) {
    return <WebGLFallback accentHex={accent.hex} />;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-slate-950">
      <Canvas
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: true,
        }}
        className="w-full h-full pointer-events-auto"
      >
        <CameraRig />

        {/* Ambient base lighting */}
        <ambientLight intensity={0.6} />

        {/* Dynamic Key Light highlighting accent color */}
        <pointLight position={[6, 8, 6]} intensity={1.5} color={accent.hex} />

        {/* Cool Rim / Fill light */}
        <pointLight position={[-6, -6, -4]} intensity={0.9} color="#38bdf8" />

        {/* Subtle top spotlight */}
        <directionalLight position={[0, 10, 2]} intensity={1.0} color="#ffffff" />

        {/* Centerpiece Procedural Task Core */}
        <TaskCore />
      </Canvas>
    </div>
  );
};

export default CinematicCanvas;
