import React, { useRef, useState, useEffect, forwardRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Text } from '@react-three/drei';
import * as THREE from 'three';
import { getRandomToyColor, createGlowEffect } from '../../../utils/three';
import { animateBoxFloat } from '../../../utils/animations';

// Create a custom box geometry
const createBoxGeometry = (width = 1, height = 1, depth = 1, worn = 0.05) => {
  const geometry = new THREE.BoxGeometry(width, height, depth, 4, 4, 4);
  const pos = geometry.attributes.position;
  
  // Add some random vertices displacement for a worn look
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    
    // More worn on edges and corners
    const edgeDistance = Math.min(
      Math.abs(Math.abs(x) - width/2),
      Math.abs(Math.abs(y) - height/2),
      Math.abs(Math.abs(z) - depth/2)
    );
    
    // Apply more displacement near edges
    const displacement = (1 - Math.min(edgeDistance, 0.2) / 0.2) * worn;
    pos.setXYZ(
      i,
      x + (Math.random() - 0.5) * displacement,
      y + (Math.random() - 0.5) * displacement,
      z + (Math.random() - 0.5) * displacement
    );
  }
  
  geometry.computeVertexNormals();
  return geometry;
};

// Kiddolini box component
const KiddoliniBox = forwardRef(({ position = [0, 0, 0], lidRef, onInteraction }, ref) => {
  const groupRef = useRef();
  const boxRef = useRef();
  const internalLidRef = useRef();
  const glowRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [opened, setOpened] = useState(false);
  
  // Expose the ref
  React.useImperativeHandle(ref, () => groupRef.current);
  
  // Box dimensions
  const boxWidth = 1.5;
  const boxHeight = 1.2;
  const boxDepth = 1.5;
  const lidHeight = 0.2;
  
  // Assign the lid ref if provided
  useEffect(() => {
    if (lidRef) {
      lidRef.current = internalLidRef.current;
    }
  }, [lidRef]);
  
  useEffect(() => {
    if (groupRef.current) {
      // Start floating animation
      animateBoxFloat(groupRef.current);
    }
  }, []);
  
  // Glow effect
  const glowColor = new THREE.Color(getRandomToyColor());
  const pulsate = (object) => {
    if (!object) return;
    
    // Pulsating glow
    useFrame(({ clock }) => {
      const t = clock.getElapsedTime();
      const intensity = 1 + Math.sin(t * 2) * 0.3;
      
      if (object.intensity) {
        object.intensity = intensity;
      }
      
      if (hovered) {
        object.intensity = intensity * 1.5;
      }
    });
  };
  
  pulsate(glowRef.current);
  
  // Handle interactions
  const handleBoxClick = (e) => {
    e.stopPropagation();
    setOpened(!opened);
    if (onInteraction) {
      onInteraction(opened ? 'close' : 'open');
    }
  };
  
  useFrame(() => {
    if (internalLidRef.current) {
      // Lid animation is handled in the parent component via GSAP
      // But we still update some properties here
      
      if (opened) {
        // Lid is open
      } else {
        // Lid is closed
      }
    }
  });
  
  return (
    <group 
      ref={groupRef} 
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={handleBoxClick}
    >
      {/* Box Body */}
      <mesh
        ref={boxRef}
        position={[0, 0, 0]}
        castShadow
        receiveShadow
      >
        <primitive object={createBoxGeometry(boxWidth, boxHeight, boxDepth, 0.03)} />
        <meshStandardMaterial
          color="#EB5E28"
          roughness={0.7}
          metalness={0.1}
          bumpScale={0.02}
        >
          <texture wrapS={THREE.RepeatWrapping} wrapT={THREE.RepeatWrapping} />
        </meshStandardMaterial>
      </mesh>
      
      {/* Box Lid */}
      <group ref={internalLidRef} position={[0, boxHeight / 2 + lidHeight / 2, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[boxWidth, lidHeight, boxDepth]} />
          <meshStandardMaterial 
            color="#EB5E28"
            roughness={0.7}
            metalness={0.1}
          />
        </mesh>
        
        {/* Kiddolini Logo on Lid */}
        <Text
          position={[0, lidHeight / 2 + 0.01, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.2}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
        >
          Kiddolini
        </Text>
      </group>
      
      {/* Doodles/stickers on box sides */}
      <mesh position={[0, 0, boxDepth / 2 + 0.01]}>
        <planeGeometry args={[boxWidth * 0.8, boxHeight * 0.8]} />
        <meshBasicMaterial 
          color="#F3E9DC" 
          opacity={0.9}
          transparent
        />
      </mesh>
      
      {/* Glow effect */}
      <pointLight
        ref={glowRef}
        position={[0, 0, 0]}
        color={glowColor}
        intensity={1}
        distance={4}
        castShadow={false}
      />
    </group>
  );
});

export default KiddoliniBox; 