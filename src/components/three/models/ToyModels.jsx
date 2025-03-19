import React, { useRef, useState, forwardRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, MeshWobbleMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { getRandomToyColor } from '../../../utils/three';

// Teddy Bear Model
export const TeddyBear = forwardRef(({ position = [0, 0, 0], scale = 1, color = null }, ref) => {
  const groupRef = useRef();
  const bearColor = color || '#A06235';
  const patchColor = '#D9C0A3';
  
  // Expose the ref
  React.useImperativeHandle(ref, () => groupRef.current);
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Subtle breathing motion
      const t = clock.getElapsedTime();
      groupRef.current.scale.y = scale * (1 + Math.sin(t * 1.5) * 0.02);
      groupRef.current.scale.x = scale * (1 - Math.sin(t * 1.5) * 0.01);
    }
  });
  
  return (
    <group ref={groupRef} position={position} scale={[scale, scale, scale]}>
      {/* Body */}
      <mesh castShadow position={[0, 0, 0]}>
        <capsuleGeometry args={[0.3, 0.6, 4, 8]} />
        <meshStandardMaterial 
          color={bearColor} 
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
      
      {/* Head */}
      <mesh castShadow position={[0, 0.6, 0]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial 
          color={bearColor} 
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[-0.1, 0.65, 0.2]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <mesh position={[0.1, 0.65, 0.2]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="black" />
      </mesh>
      
      {/* Nose */}
      <mesh position={[0, 0.58, 0.22]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#482815" />
      </mesh>
      
      {/* Ears */}
      <mesh position={[-0.2, 0.8, 0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color={bearColor} />
      </mesh>
      <mesh position={[0.2, 0.8, 0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color={bearColor} />
      </mesh>
      
      {/* Arms */}
      <mesh position={[-0.35, 0.1, 0]} rotation={[0, 0, Math.PI / 6]}>
        <capsuleGeometry args={[0.1, 0.3, 4, 8]} />
        <meshStandardMaterial color={bearColor} />
      </mesh>
      
      {/* Patched arm */}
      <group position={[0.35, 0.1, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.1, 0.3, 4, 8]} />
          <meshStandardMaterial color={bearColor} />
        </mesh>
        
        {/* Patch */}
        <mesh position={[0, 0, 0.1]}>
          <cylinderGeometry args={[0.12, 0.12, 0.05, 8]} />
          <meshStandardMaterial 
            color={patchColor}
            roughness={0.8}
          />
        </mesh>
      </group>
      
      {/* Legs */}
      <mesh position={[-0.15, -0.4, 0]} rotation={[0, 0, Math.PI / 12]}>
        <capsuleGeometry args={[0.1, 0.3, 4, 8]} />
        <meshStandardMaterial color={bearColor} />
      </mesh>
      <mesh position={[0.15, -0.4, 0]} rotation={[0, 0, -Math.PI / 12]}>
        <capsuleGeometry args={[0.1, 0.3, 4, 8]} />
        <meshStandardMaterial color={bearColor} />
      </mesh>
    </group>
  );
});

// Building Blocks
export const BuildingBlocks = forwardRef(({ position = [0, 0, 0], scale = 1 }, ref) => {
  const groupRef = useRef();
  
  // Expose the ref
  React.useImperativeHandle(ref, () => groupRef.current);
  
  const blockColors = [
    getRandomToyColor(),
    getRandomToyColor(),
    getRandomToyColor(),
    getRandomToyColor()
  ];
  
  const letterColors = ['white', 'white', 'white', 'white'];
  const letters = ['A', 'B', 'C', 'D'];
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Gentle rocking
      const t = clock.getElapsedTime();
      groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.1;
    }
  });
  
  return (
    <group ref={groupRef} position={position} scale={[scale, scale, scale]}>
      {blockColors.map((color, index) => (
        <group key={index} position={[
          (index % 2 === 0 ? -0.15 : 0.15), 
          index < 2 ? 0 : 0.25, 
          index === 0 || index === 3 ? 0.15 : -0.15
        ]}>
          <mesh castShadow>
            <boxGeometry args={[0.25, 0.25, 0.25]} />
            <meshStandardMaterial 
              color={color}
              roughness={0.7}
              metalness={0.1}
            />
          </mesh>
          
          {/* Letters on blocks */}
          {[...Array(6)].map((_, faceIndex) => {
            // Position the letter on each face of the cube
            const rotations = [
              [0, 0, 0],           // front
              [0, Math.PI, 0],     // back
              [0, -Math.PI/2, 0],  // right
              [0, Math.PI/2, 0],   // left
              [-Math.PI/2, 0, 0],  // top
              [Math.PI/2, 0, 0]    // bottom
            ];
            
            const offset = 0.126; // Slightly more than half the cube width
            const positions = [
              [0, 0, offset],      // front
              [0, 0, -offset],     // back
              [offset, 0, 0],      // right
              [-offset, 0, 0],     // left
              [0, offset, 0],      // top
              [0, -offset, 0]      // bottom
            ];
            
            return (
              <mesh 
                key={faceIndex} 
                position={positions[faceIndex]}
                rotation={rotations[faceIndex]}
              >
                <planeGeometry args={[0.18, 0.18]} />
                <meshBasicMaterial 
                  color={letterColors[index]}
                  transparent
                  opacity={0.9}
                />
                
                {/* We'd use drei Text here in a real implementation */}
                {/* Using simple geometry for visualization */}
                <mesh scale={0.5} position={[0, 0, 0.01]}>
                  <sphereGeometry args={[0.1, 8, 8]} />
                  <meshBasicMaterial color={letterColors[index]} />
                </mesh>
              </mesh>
            );
          })}
        </group>
      ))}
    </group>
  );
});

// Toy Car
export const ToyCar = forwardRef(({ position = [0, 0, 0], scale = 1 }, ref) => {
  const groupRef = useRef();
  const wheelRefs = useRef([]);
  const carColor = getRandomToyColor();
  
  // Expose the ref
  React.useImperativeHandle(ref, () => groupRef.current);
  
  // Initialize wheel references
  wheelRefs.current = Array(4).fill().map((_, i) => wheelRefs.current[i] || React.createRef());
  
  useFrame(({ clock }) => {
    if (groupRef.current && wheelRefs.current) {
      // Car bobbing motion
      const t = clock.getElapsedTime();
      groupRef.current.position.y = position[1] + Math.sin(t * 3) * 0.02;
      
      // Wheels spin
      wheelRefs.current.forEach(wheel => {
        if (wheel.current) {
          wheel.current.rotation.z -= 0.05;
        }
      });
    }
  });
  
  return (
    <group ref={groupRef} position={position} scale={[scale, scale, scale]}>
      {/* Car body */}
      <mesh castShadow position={[0, 0.15, 0]}>
        <boxGeometry args={[0.5, 0.15, 0.25]} />
        <meshStandardMaterial 
          color={carColor}
          roughness={0.5}
          metalness={0.5}
        />
      </mesh>
      
      {/* Cab */}
      <mesh castShadow position={[0.05, 0.27, 0]}>
        <boxGeometry args={[0.3, 0.1, 0.22]} />
        <meshStandardMaterial 
          color={carColor}
          roughness={0.5}
          metalness={0.5}
        />
      </mesh>
      
      {/* Windows */}
      <mesh position={[0.05, 0.27, 0.11]} rotation={[0, 0, 0]}>
        <planeGeometry args={[0.28, 0.08]} />
        <meshStandardMaterial 
          color={'#A5D8FF'}
          transparent
          opacity={0.6}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
      
      {/* Wheels */}
      {[
        [-0.15, 0.07, 0.15], // front-right
        [-0.15, 0.07, -0.15], // front-left
        [0.15, 0.07, 0.15], // back-right
        [0.15, 0.07, -0.15], // back-left
      ].map((wheelPos, i) => (
        <group key={i} position={wheelPos}>
          <mesh ref={wheelRefs.current[i]} castShadow>
            <cylinderGeometry args={[0.07, 0.07, 0.05, 16]} rotation={[0, 0, Math.PI / 2]} />
            <meshStandardMaterial 
              color={"#333333"}
              roughness={0.8}
              metalness={0.2}
            />
          </mesh>
          <mesh castShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.06, 8]} rotation={[0, 0, Math.PI / 2]} />
            <meshStandardMaterial 
              color={"#999999"}
              roughness={0.8}
              metalness={0.5}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
});

// Wooden Train Piece
export const WoodenTrain = forwardRef(({ position = [0, 0, 0], scale = 1 }, ref) => {
  const groupRef = useRef();
  const wheelRefs = useRef([]);
  
  // Expose the ref
  React.useImperativeHandle(ref, () => groupRef.current);
  
  // Initialize wheel references
  wheelRefs.current = Array(4).fill().map((_, i) => wheelRefs.current[i] || React.createRef());
  
  useFrame(({ clock }) => {
    if (groupRef.current && wheelRefs.current) {
      // Train rocking motion
      const t = clock.getElapsedTime();
      groupRef.current.rotation.z = Math.sin(t * 2) * 0.03;
      
      // Wheels spin (slowly, as if the train is on a surface)
      wheelRefs.current.forEach(wheel => {
        if (wheel.current) {
          wheel.current.rotation.x += 0.01;
        }
      });
    }
  });
  
  return (
    <group ref={groupRef} position={position} scale={[scale, scale, scale]}>
      {/* Train body - wooden texture */}
      <mesh castShadow position={[0, 0.2, 0]}>
        <boxGeometry args={[0.6, 0.25, 0.2]} />
        <meshStandardMaterial 
          color={'#C19A6B'}
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
      
      {/* Train cab */}
      <mesh castShadow position={[0.2, 0.4, 0]}>
        <boxGeometry args={[0.2, 0.15, 0.18]} />
        <meshStandardMaterial 
          color={'#A67B5B'}
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
      
      {/* Chimney */}
      <mesh castShadow position={[0.25, 0.5, 0]}>
        <cylinderGeometry args={[0.03, 0.04, 0.1, 8]} />
        <meshStandardMaterial 
          color={'#8B7355'}
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
      
      {/* Wheels */}
      {[
        [-0.2, 0.1, 0.11], // front-right
        [-0.2, 0.1, -0.11], // front-left
        [0.2, 0.1, 0.11], // back-right
        [0.2, 0.1, -0.11], // back-left
      ].map((wheelPos, i) => (
        <mesh key={i} position={wheelPos} ref={wheelRefs.current[i]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.03, 12]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial 
            color={"#5C4033"}
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>
      ))}
      
      {/* Details - colorful accents */}
      <mesh position={[0, 0.33, 0.1]}>
        <boxGeometry args={[0.4, 0.04, 0.01]} />
        <meshStandardMaterial color={getRandomToyColor()} />
      </mesh>
      
      <mesh position={[0.3, 0.4, 0.09]}>
        <planeGeometry args={[0.1, 0.1]} />
        <meshStandardMaterial 
          color={'#4D3B24'}
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
    </group>
  );
});

// Fabric Doll
export const FabricDoll = forwardRef(({ position = [0, 0, 0], scale = 1 }, ref) => {
  const groupRef = useRef();
  const dollColor = getRandomToyColor();
  const hairColor = '#8B6914';
  
  // Expose the ref
  React.useImperativeHandle(ref, () => groupRef.current);
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Gentle swaying
      const t = clock.getElapsedTime();
      groupRef.current.rotation.z = Math.sin(t * 1.5) * 0.05;
      groupRef.current.position.y = position[1] + Math.sin(t * 2) * 0.02;
    }
  });
  
  return (
    <group ref={groupRef} position={position} scale={[scale, scale, scale]}>
      {/* Body */}
      <mesh castShadow position={[0, 0, 0]}>
        <capsuleGeometry args={[0.2, 0.5, 4, 8]} />
        <MeshWobbleMaterial 
          color={dollColor} 
          factor={0.05} // wobble factor
          speed={0.5}   // wobble speed
          roughness={1}
          metalness={0}
        />
      </mesh>
      
      {/* Head */}
      <mesh castShadow position={[0, 0.45, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <MeshWobbleMaterial 
          color={'#F5DEB3'} 
          factor={0.03}
          speed={0.5}
          roughness={1}
          metalness={0}
        />
      </mesh>
      
      {/* Hair */}
      <mesh castShadow position={[0, 0.5, 0]} scale={[1, 0.6, 1]}>
        <sphereGeometry args={[0.21, 16, 16]} />
        <MeshWobbleMaterial 
          color={hairColor} 
          factor={0.1}
          speed={1}
          roughness={1}
          metalness={0}
        />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[-0.08, 0.45, 0.15]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <mesh position={[0.08, 0.45, 0.15]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial color="black" />
      </mesh>
      
      {/* Mouth - simple smile */}
      <mesh position={[0, 0.35, 0.15]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.05, 0.01, 8, 8, Math.PI]} />
        <meshStandardMaterial color="black" />
      </mesh>
      
      {/* Arms */}
      <mesh position={[-0.25, 0.15, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <capsuleGeometry args={[0.05, 0.2, 4, 8]} />
        <MeshWobbleMaterial 
          color={dollColor}
          factor={0.1}
          speed={1}
          roughness={1}
          metalness={0}
        />
      </mesh>
      <mesh position={[0.25, 0.15, 0]} rotation={[0, 0, Math.PI / 4]}>
        <capsuleGeometry args={[0.05, 0.2, 4, 8]} />
        <MeshWobbleMaterial 
          color={dollColor}
          factor={0.1}
          speed={1}
          roughness={1}
          metalness={0}
        />
      </mesh>
      
      {/* Legs */}
      <mesh position={[-0.1, -0.3, 0]} rotation={[0, 0, Math.PI / 12]}>
        <capsuleGeometry args={[0.06, 0.2, 4, 8]} />
        <MeshWobbleMaterial 
          color={'#F5DEB3'}
          factor={0.1}
          speed={1}
          roughness={1}
          metalness={0}
        />
      </mesh>
      <mesh position={[0.1, -0.3, 0]} rotation={[0, 0, -Math.PI / 12]}>
        <capsuleGeometry args={[0.06, 0.2, 4, 8]} />
        <MeshWobbleMaterial 
          color={'#F5DEB3'}
          factor={0.1}
          speed={1}
          roughness={1}
          metalness={0}
        />
      </mesh>
      
      {/* Details - clothes seams/stitches represented as thin cylinders */}
      <mesh position={[0, 0.22, 0.21]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.001, 0.001, 0.3, 4]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[0, 0.22, -0.21]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.001, 0.001, 0.3, 4]} />
        <meshStandardMaterial color="#333" />
      </mesh>
    </group>
  );
});

// Export all toys in one collection
const ToyModels = {
  TeddyBear,
  BuildingBlocks,
  ToyCar,
  WoodenTrain,
  FabricDoll
};

export default ToyModels; 