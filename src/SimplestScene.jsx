import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

function RotatingBox(props) {
  const meshRef = useRef();
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh {...props} ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={'orange'} />
    </mesh>
  );
}

export default function SimplestScene() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: 'black' }}>
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <RotatingBox position={[0, 0, 0]} />
      </Canvas>
    </div>
  );
} 