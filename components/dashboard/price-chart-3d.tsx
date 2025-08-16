'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Text } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

interface DataPoint {
  x: number;
  y: number;
  z: number;
  value: number;
  label: string;
}

export function PriceChart3D({ data }: { data: DataPoint[] }) {
  return (
    <div className="w-full h-[400px] bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg overflow-hidden">
      <Canvas camera={{ position: [5, 5, 5], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        
        {data.map((point, index) => (
          <DataBar
            key={index}
            position={[point.x * 2, point.y / 2, point.z * 2]}
            height={point.y}
            color={getColorByValue(point.value)}
            label={point.label}
          />
        ))}
        
        <gridHelper args={[10, 10]} />
      </Canvas>
    </div>
  );
}

function DataBar({ position, height, color, label }: any) {
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <group position={position}>
      <Box ref={meshRef} args={[0.5, height, 0.5]}>
        <meshStandardMaterial color={color} />
      </Box>
      <Text
        position={[0, height / 2 + 0.5, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  );
}

function getColorByValue(value: number): string {
  if (value > 80) return '#10b981';
  if (value > 60) return '#3b82f6';
  if (value > 40) return '#f59e0b';
  if (value > 20) return '#f97316';
  return '#ef4444';
}