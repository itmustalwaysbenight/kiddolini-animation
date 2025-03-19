import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Cloud, Stars } from '@react-three/drei';
import { getRandomToyColor } from '../../../utils/three';

// Stylized House Component
const StylizedHouse = ({ position = [0, 0, 0], scale = 1, color = null, rotation = [0, 0, 0] }) => {
  const houseColor = color || getRandomToyColor();
  const roofColor = useMemo(() => {
    // Create a contrasting roof color
    const houseColorObj = new THREE.Color(houseColor);
    const h = { h: 0, s: 0, l: 0 };
    houseColorObj.getHSL(h);
    // Rotate hue by 180 degrees for contrast
    h.h = (h.h + 0.5) % 1;
    h.s = Math.min(h.s + 0.2, 1);
    return new THREE.Color().setHSL(h.h, h.s, h.l);
  }, [houseColor]);
  
  return (
    <group position={position} scale={[scale, scale, scale]} rotation={rotation}>
      {/* House base */}
      <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial 
          color={houseColor}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      
      {/* Roof */}
      <mesh castShadow position={[0, 1.25, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[0.95, 0.8, 4]} />
        <meshStandardMaterial 
          color={roofColor}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
      
      {/* Door */}
      <mesh position={[0, 0.3, 0.51]}>
        <boxGeometry args={[0.3, 0.6, 0.05]} />
        <meshStandardMaterial 
          color={'#8B4513'}
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
      
      {/* Windows */}
      <mesh position={[-0.3, 0.6, 0.51]}>
        <boxGeometry args={[0.2, 0.2, 0.05]} />
        <meshStandardMaterial 
          color={'#A5D8FF'}
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.7}
        />
        <mesh position={[0, 0, 0.03]}>
          <boxGeometry args={[0.22, 0.22, 0.01]} />
          <meshStandardMaterial color={'#FFFFFF'} />
        </mesh>
      </mesh>
      
      <mesh position={[0.3, 0.6, 0.51]}>
        <boxGeometry args={[0.2, 0.2, 0.05]} />
        <meshStandardMaterial 
          color={'#A5D8FF'}
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.7}
        />
        <mesh position={[0, 0, 0.03]}>
          <boxGeometry args={[0.22, 0.22, 0.01]} />
          <meshStandardMaterial color={'#FFFFFF'} />
        </mesh>
      </mesh>
      
      {/* Chimney */}
      <mesh position={[0.3, 1.5, 0.3]}>
        <boxGeometry args={[0.15, 0.4, 0.15]} />
        <meshStandardMaterial 
          color={'#8B4513'}
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
    </group>
  );
};

// Stylized Tree Component
const StylizedTree = ({ position = [0, 0, 0], scale = 1 }) => {
  const trunkColor = '#8B4513';
  const leavesColor = '#228B22';
  
  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Trunk */}
      <mesh castShadow position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.1, 0.15, 1, 8]} />
        <meshStandardMaterial 
          color={trunkColor}
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
      
      {/* Leaves - stylized as simple geometric shapes */}
      <mesh castShadow position={[0, 1.2, 0]}>
        <sphereGeometry args={[0.4, 8, 8]} />
        <meshStandardMaterial 
          color={leavesColor}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      
      <mesh castShadow position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshStandardMaterial 
          color={leavesColor}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
    </group>
  );
};

// Path Component
const Path = ({ points, width = 1, color = '#E2C799' }) => {
  // Create a path using THREE.CatmullRomCurve3
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)));
  }, [points]);
  
  // Create a tube geometry along the path
  const pathGeometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 64, width / 2, 8, false);
  }, [curve, width]);
  
  return (
    <mesh receiveShadow position={[0, 0.01, 0]}>
      <primitive object={pathGeometry} />
      <meshStandardMaterial 
        color={color}
        roughness={0.9}
        metalness={0.1}
      />
    </mesh>
  );
};

// Hills Component
const Hills = ({ position = [0, 0, 0], count = 5, size = 10 }) => {
  const hills = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const x = (Math.random() - 0.5) * size * 2;
      const z = (Math.random() - 0.5) * size * 2;
      const radius = 2 + Math.random() * 3;
      const height = 0.5 + Math.random() * 1;
      
      return { position: [x, -height / 2, z], radius, height };
    });
  }, [count, size]);
  
  return (
    <group position={position}>
      {hills.map((hill, index) => (
        <mesh key={index} position={hill.position} receiveShadow>
          <sphereGeometry args={[hill.radius, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial 
            color={'#7CFC00'}
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>
      ))}
    </group>
  );
};

// Main Environment Component
const Environment = ({ pathPoints, housePositions }) => {
  return (
    <group>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial 
          color={'#90EE90'}
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
      
      {/* Path connecting houses */}
      <Path 
        points={pathPoints || [
          [-8, 0, -5],
          [-4, 0, 0],
          [0, 0, 0],
          [4, 0, 4],
          [8, 0, 2]
        ]} 
        width={1.2}
      />
      
      {/* Hills in the background */}
      <Hills position={[0, 0, -10]} count={7} size={15} />
      
      {/* Houses */}
      {housePositions ? (
        housePositions.map((pos, index) => (
          <StylizedHouse 
            key={index} 
            position={pos} 
            rotation={[0, Math.random() * Math.PI * 2, 0]}
          />
        ))
      ) : (
        <>
          <StylizedHouse position={[-8, 0, -5]} scale={1.2} rotation={[0, Math.PI / 6, 0]} />
          <StylizedHouse position={[0, 0, 0]} scale={1} rotation={[0, -Math.PI / 4, 0]} />
          <StylizedHouse position={[8, 0, 2]} scale={1.5} rotation={[0, Math.PI / 3, 0]} />
        </>
      )}
      
      {/* Trees scattered around */}
      <StylizedTree position={[-6, 0, -8]} scale={1} />
      <StylizedTree position={[-10, 0, -2]} scale={1.2} />
      <StylizedTree position={[3, 0, -7]} scale={0.8} />
      <StylizedTree position={[7, 0, -4]} scale={1.4} />
      <StylizedTree position={[-4, 0, 6]} scale={1.1} />
      <StylizedTree position={[10, 0, 6]} scale={0.9} />
      
      {/* Sky elements */}
      <Cloud position={[-10, 10, -5]} args={[3, 2]} />
      <Cloud position={[10, 12, -10]} args={[4, 2]} />
      <Stars radius={50} depth={50} count={1000} factor={4} />
      
      {/* Ambient light */}
      <ambientLight intensity={0.5} />
      
      {/* Directional light for sun */}
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1.5} 
        castShadow 
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
    </group>
  );
};

export default Environment; 