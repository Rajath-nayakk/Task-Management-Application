import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { use3DStore } from '../../store/use3DStore';
import { isWebGLAvailable } from './WebGLFallback';

interface ProgressTorusProps {
  percent: number;
  color: string;
}

const ProgressTorus: React.FC<ProgressTorusProps> = ({ percent, color }) => {
  const arcRef = useRef<THREE.Mesh>(null);
  const currentArc = useRef<number>(0);

  useFrame(() => {
    if (!arcRef.current) return;
    const targetArc = Math.max(0.01, (percent / 100) * Math.PI * 2);
    currentArc.current = THREE.MathUtils.lerp(currentArc.current, targetArc, 0.1);

    // Reconstruct geometry arc dynamically with smooth interpolation
    arcRef.current.geometry.dispose();
    arcRef.current.geometry = new THREE.TorusGeometry(
      1.15,
      0.22,
      16,
      64,
      currentArc.current
    );
  });

  return (
    <group rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
      {/* Background Track Torus */}
      <mesh>
        <torusGeometry args={[1.15, 0.18, 16, 64, Math.PI * 2]} />
        <meshBasicMaterial color="#1e293b" transparent opacity={0.6} />
      </mesh>

      {/* Active Glowing Progress Arc */}
      <mesh ref={arcRef}>
        <torusGeometry args={[1.15, 0.22, 16, 64, 0.05]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.65}
          roughness={0.2}
          metalness={0.5}
        />
      </mesh>
    </group>
  );
};

interface ProgressWidget3DProps {
  percentComplete: number;
}

export const ProgressWidget3D: React.FC<ProgressWidget3DProps> = ({ percentComplete }) => {
  const { accent, isLowPower } = use3DStore();

  const webGLReady = isWebGLAvailable() && !isLowPower;

  return (
    <div className="relative flex items-center justify-center shrink-0 w-28 h-28">
      {webGLReady ? (
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 3.4], fov: 45 }}
          className="w-full h-full pointer-events-none"
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.8} />
          <pointLight position={[3, 3, 3]} intensity={1.5} color={accent.hex} />
          <pointLight position={[-3, -3, 2]} intensity={0.8} color="#38bdf8" />
          <ProgressTorus percent={percentComplete} color={accent.hex} />
        </Canvas>
      ) : (
        /* Accessible 2D SVG Fallback */
        <svg className="w-24 h-24 transform -rotate-90" aria-hidden="true">
          <circle
            cx="48"
            cy="48"
            r="36"
            className="text-slate-200 dark:text-slate-800"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
          />
          <circle
            cx="48"
            cy="48"
            r="36"
            style={{
              stroke: accent.hex,
              strokeDasharray: 2 * Math.PI * 36,
              strokeDashoffset:
                2 * Math.PI * 36 - (percentComplete / 100) * 2 * Math.PI * 36,
            }}
            className="transition-all duration-700 ease-out"
            strokeWidth="8"
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>
      )}

      {/* Accessible numeric percentage display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
        <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-none font-display">
          {percentComplete}%
        </span>
        <span className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">
          Done
        </span>
      </div>
    </div>
  );
};
