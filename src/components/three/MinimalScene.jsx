import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, useHelper, SoftShadows } from '@react-three/drei';
import * as THREE from 'three';

// A toy box that floats and rotates gently
const ToyBox = () => {
  const boxRef = useRef();
  const lightRef = useRef();
  
  // Optional: show light helper during development
  // useHelper(lightRef, THREE.DirectionalLightHelper, 1, 'red');
  
  useFrame(({ clock }) => {
    if (boxRef.current) {
      // Gentle floating animation
      const t = clock.getElapsedTime();
      boxRef.current.position.y = Math.sin(t * 0.8) * 0.2 + 0.5;
      boxRef.current.rotation.y = Math.sin(t * 0.4) * 0.2;
      boxRef.current.rotation.z = Math.sin(t * 0.3) * 0.1;
    }
  });
  
  return (
    <group>
      {/* Box with rounded corners using bevel */}
      <mesh ref={boxRef} castShadow receiveShadow>
        <boxGeometry args={[1.4, 1.1, 1.4, 4, 4, 4]} />
        <meshStandardMaterial 
          color="#EB5E28" 
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
      
      {/* Lid on top */}
      <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.2, 1.5]} />
        <meshStandardMaterial 
          color="#D74E26"
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
      
      {/* Text on top */}
      <mesh position={[0, 1.25, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1, 0.5]} />
        <meshBasicMaterial color="#FFFFFF" transparent opacity={0.9} />
      </mesh>
    </group>
  );
};

// Ground plane with shadows
const Ground = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial color="#5DB56D" roughness={0.7} />
    </mesh>
  );
};

// A minimal scene with Pixar-style elements
const MinimalScene = () => {
  console.log("Rendering Pixar-style MinimalScene");
  
  return (
    <Canvas 
      shadows
      style={{ 
        width: '100%', 
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0
      }}
      camera={{ position: [4, 4, 4], fov: 35 }}
    >
      {/* Enable soft shadows for Pixar style */}
      <SoftShadows size={10} samples={16} focus={0.5} />
      
      {/* Scene background */}
      <color attach="background" args={['#87CEEB']} />
      <fog attach="fog" args={['#87CEEB', 15, 30]} />
      
      {/* Lighting for Pixar-style rendering */}
      <ambientLight intensity={0.4} />
      
      {/* Main key light - warm directional */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={1.5}
        color="#FFF5E1"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={20}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Fill light - cooler temperature */}
      <directionalLight
        position={[-5, 5, -5]}
        intensity={0.5}
        color="#D6E9FF"
      />
      
      {/* Pixar stylized elements */}
      <ToyBox />
      <Ground />
      
      {/* Hills in the background */}
      <mesh position={[-8, -0.5, -8]} castShadow>
        <sphereGeometry args={[4, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial color="#4AAD52" roughness={0.8} />
      </mesh>
      
      <mesh position={[10, -0.5, -10]} castShadow>
        <sphereGeometry args={[6, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial color="#4AAD52" roughness={0.8} />
      </mesh>
      
      {/* Environment map for reflections */}
      <Environment preset="sunset" />
      
      {/* Camera controls */}
      <OrbitControls 
        enableZoom={true}
        enablePan={false}
        minDistance={3}
        maxDistance={15}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.5}
        target={[0, 0.5, 0]}
      />
    </Canvas>
  );
};

export default MinimalScene; 