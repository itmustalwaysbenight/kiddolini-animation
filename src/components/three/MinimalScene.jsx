import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, SoftShadows, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useSpring, animated } from '@react-spring/three';

// A toy box that floats and rotates gently
const ToyBox = ({ isOpen, setIsOpen }) => {
  const boxRef = useRef();
  const lidRef = useRef();
  
  // Box animations
  useFrame(({ clock }) => {
    if (boxRef.current) {
      // Gentle floating animation
      const t = clock.getElapsedTime();
      boxRef.current.position.y = Math.sin(t * 0.8) * 0.2 + 0.5;
      boxRef.current.rotation.y = Math.sin(t * 0.4) * 0.2;
      boxRef.current.rotation.z = Math.sin(t * 0.3) * 0.1;
    }
  });

  // Lid animation
  const lidSpring = useSpring({
    rotation: isOpen ? [-Math.PI * 0.8, 0, 0] : [0, 0, 0],
    position: isOpen ? [0, 1.3, -0.6] : [0, 1.1, 0],
    config: { mass: 1, tension: 170, friction: 26 }
  });
  
  return (
    <group onClick={() => setIsOpen(!isOpen)}>
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
      <animated.mesh 
        ref={lidRef} 
        castShadow 
        receiveShadow
        position={lidSpring.position}
        rotation={lidSpring.rotation}
      >
        <boxGeometry args={[1.5, 0.2, 1.5]} />
        <meshStandardMaterial 
          color="#D74E26"
          roughness={0.3}
          metalness={0.1}
        />
      </animated.mesh>
      
      {/* Text on top */}
      <animated.mesh 
        position={lidSpring.position}
        rotation={lidSpring.rotation}
      >
        <planeGeometry args={[1, 0.5]} />
        <meshBasicMaterial color="#FFFFFF" transparent opacity={0.9} />
        <mesh position={[0, 0.01, 0]}>
          <boxGeometry args={[0.7, 0.1, 0.01]} />
          <meshStandardMaterial color="#D74E26" />
        </mesh>
      </animated.mesh>
    </group>
  );
};

// Pixar-style Rubber Ball Toy
const RubberBall = ({ isVisible, position }) => {
  const ballRef = useRef();
  
  // Ball animation spring
  const springs = useSpring({
    position: isVisible ? [position[0], 0.5, position[2]] : [0, 0, 0],
    scale: isVisible ? 1 : 0,
    rotation: isVisible ? [0, Math.PI * 4, 0] : [0, 0, 0],
    config: { mass: 2, tension: 300, friction: 30, duration: 1000 }
  });
  
  // Add bounce animation
  useFrame(({ clock }) => {
    if (ballRef.current && isVisible) {
      const t = clock.getElapsedTime();
      ballRef.current.position.y = 0.5 + Math.abs(Math.sin(t * 3)) * 0.3;
    }
  });
  
  return (
    <animated.mesh 
      ref={ballRef}
      position={springs.position}
      rotation={springs.rotation}
      scale={springs.scale}
      castShadow
    >
      <sphereGeometry args={[0.3, 32, 32]} />
      <meshStandardMaterial 
        color="#4D85FF" 
        roughness={0.5} 
      />
      <mesh position={[0, 0.15, 0.22]} rotation={[0, 0, 0]}>
        <planeGeometry args={[0.15, 0.15]} />
        <meshStandardMaterial color="#FF4D4D" />
      </mesh>
    </animated.mesh>
  );
};

// Pixar-style Wooden Toy Train
const ToyTrain = ({ isVisible, position }) => {
  const trainRef = useRef();
  
  // Train animation spring
  const springs = useSpring({
    position: isVisible ? [position[0], 0.2, position[2]] : [0, 0, 0],
    scale: isVisible ? 0.6 : 0,
    rotation: isVisible ? [0, Math.PI * 2, 0] : [0, 0, 0],
    config: { mass: 5, tension: 200, friction: 40, duration: 1500 }
  });
  
  // Add movement animation
  useFrame(({ clock }) => {
    if (trainRef.current && isVisible) {
      const t = clock.getElapsedTime();
      trainRef.current.rotation.y = t * 0.5;
      trainRef.current.position.x = position[0] + Math.sin(t * 0.8) * 0.5;
      trainRef.current.position.z = position[2] + Math.cos(t * 0.8) * 0.5;
    }
  });
  
  return (
    <animated.group 
      ref={trainRef}
      position={springs.position}
      rotation={springs.rotation}
      scale={springs.scale}
    >
      {/* Train body */}
      <mesh castShadow>
        <boxGeometry args={[0.6, 0.3, 0.3]} />
        <meshStandardMaterial color="#A52A2A" roughness={0.7} />
      </mesh>
      
      {/* Cabin */}
      <mesh position={[-0.2, 0.25, 0]} castShadow>
        <boxGeometry args={[0.2, 0.2, 0.28]} />
        <meshStandardMaterial color="#8B4513" roughness={0.7} />
      </mesh>
      
      {/* Chimney */}
      <mesh position={[-0.25, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.2, 16]} />
        <meshStandardMaterial color="#454545" roughness={0.5} />
      </mesh>
      
      {/* Wheels */}
      {[-0.15, 0.15].map((x, i) => (
        <group key={i} position={[x, -0.15, 0]}>
          <mesh position={[0, 0, 0.15]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.05, 16]} rotation={[Math.PI / 2, 0, 0]} />
            <meshStandardMaterial color="#4C4C4C" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0, -0.15]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.05, 16]} rotation={[Math.PI / 2, 0, 0]} />
            <meshStandardMaterial color="#4C4C4C" roughness={0.5} />
          </mesh>
        </group>
      ))}
    </animated.group>
  );
};

// Pixar-style Teddy Bear
const TeddyBear = ({ isVisible, position }) => {
  const bearRef = useRef();
  
  // Bear animation spring
  const springs = useSpring({
    position: isVisible ? [position[0], 0.3, position[2]] : [0, 0, 0],
    scale: isVisible ? 0.7 : 0,
    rotation: isVisible ? [0, Math.PI, 0] : [0, 0, 0],
    config: { mass: 3, tension: 250, friction: 35, duration: 1200 }
  });
  
  // Add wave animation
  useFrame(({ clock }) => {
    if (bearRef.current && isVisible) {
      const t = clock.getElapsedTime();
      bearRef.current.rotation.y = Math.PI + Math.sin(t * 1) * 0.3;
      
      // Make the bear rotate towards the camera slowly
      const targetRotation = Math.PI * 1.5;
      bearRef.current.rotation.y += (targetRotation - bearRef.current.rotation.y) * 0.01;
    }
  });
  
  return (
    <animated.group 
      ref={bearRef}
      position={springs.position}
      rotation={springs.rotation}
      scale={springs.scale}
    >
      {/* Body */}
      <mesh castShadow>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial color="#BF8040" roughness={0.9} />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial color="#BF8040" roughness={0.9} />
      </mesh>
      
      {/* Ears */}
      <mesh position={[-0.15, 0.42, 0]} castShadow>
        <sphereGeometry args={[0.08, 32, 32]} />
        <meshStandardMaterial color="#A36B30" roughness={0.9} />
      </mesh>
      <mesh position={[0.15, 0.42, 0]} castShadow>
        <sphereGeometry args={[0.08, 32, 32]} />
        <meshStandardMaterial color="#A36B30" roughness={0.9} />
      </mesh>
      
      {/* Snout */}
      <mesh position={[0, 0.25, 0.15]} castShadow>
        <sphereGeometry args={[0.08, 32, 32]} />
        <meshStandardMaterial color="#BF8040" roughness={0.9} />
      </mesh>
      
      {/* Nose */}
      <mesh position={[0, 0.27, 0.22]} castShadow>
        <sphereGeometry args={[0.03, 32, 32]} />
        <meshStandardMaterial color="#333333" roughness={0.5} />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[-0.07, 0.33, 0.17]} castShadow>
        <sphereGeometry args={[0.02, 32, 32]} />
        <meshStandardMaterial color="#111111" roughness={0.5} />
      </mesh>
      <mesh position={[0.07, 0.33, 0.17]} castShadow>
        <sphereGeometry args={[0.02, 32, 32]} />
        <meshStandardMaterial color="#111111" roughness={0.5} />
      </mesh>
      
      {/* Arms */}
      <mesh position={[-0.22, 0.1, 0]} rotation={[0, 0, -Math.PI / 3]} castShadow>
        <capsuleGeometry args={[0.06, 0.15]} />
        <meshStandardMaterial color="#BF8040" roughness={0.9} />
      </mesh>
      <mesh position={[0.22, 0.1, 0]} rotation={[0, 0, Math.PI / 3]} castShadow>
        <capsuleGeometry args={[0.06, 0.15]} />
        <meshStandardMaterial color="#BF8040" roughness={0.9} />
      </mesh>
      
      {/* Legs */}
      <mesh position={[-0.1, -0.15, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <capsuleGeometry args={[0.06, 0.12]} />
        <meshStandardMaterial color="#BF8040" roughness={0.9} />
      </mesh>
      <mesh position={[0.1, -0.15, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <capsuleGeometry args={[0.06, 0.12]} />
        <meshStandardMaterial color="#BF8040" roughness={0.9} />
      </mesh>
    </animated.group>
  );
};

// Pixar-style Toy Rocket
const ToyRocket = ({ isVisible, position }) => {
  const rocketRef = useRef();
  
  // Rocket animation spring
  const springs = useSpring({
    position: isVisible ? [position[0], 0.2, position[2]] : [0, 0, 0],
    scale: isVisible ? 0.5 : 0,
    rotation: isVisible ? [0, 0, 0] : [0, 0, 0],
    config: { mass: 2, tension: 280, friction: 25, duration: 1300 }
  });
  
  // Add rocket flying animation
  useFrame(({ clock }) => {
    if (rocketRef.current && isVisible) {
      const t = clock.getElapsedTime();
      
      // Rocket flies in a spiral pattern upwards
      rocketRef.current.position.y = position[1] + 0.4 + t * 0.1;
      rocketRef.current.position.x = position[0] + Math.sin(t * 2) * 0.3;
      rocketRef.current.position.z = position[2] + Math.cos(t * 2) * 0.3;
      
      // Rotate to follow direction
      rocketRef.current.rotation.y = Math.atan2(
        Math.cos(t * 2 + Math.PI/2) * 0.3,
        Math.sin(t * 2 + Math.PI/2) * 0.3
      );
      
      // Slight tilt in the direction of travel
      rocketRef.current.rotation.z = Math.sin(t * 2) * 0.2;
      rocketRef.current.rotation.x = Math.cos(t * 2) * 0.2;
    }
  });
  
  return (
    <animated.group
      ref={rocketRef}
      position={springs.position}
      scale={springs.scale}
      rotation={springs.rotation}
    >
      {/* Rocket body */}
      <mesh castShadow>
        <cylinderGeometry args={[0.1, 0.2, 0.6, 16]} />
        <meshStandardMaterial color="#FF4D4D" roughness={0.3} metalness={0.2} />
      </mesh>
      
      {/* Rocket nose */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <coneGeometry args={[0.1, 0.2, 16]} />
        <meshStandardMaterial color="#FF4D4D" roughness={0.3} metalness={0.2} />
      </mesh>
      
      {/* Windows */}
      <mesh position={[0, 0.1, 0.18]} castShadow>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#AADDFF" roughness={0.1} metalness={0.5} />
      </mesh>
      
      {/* Fins */}
      {[0, Math.PI/2, Math.PI, Math.PI*1.5].map((rotation, i) => (
        <mesh key={i} position={[0, -0.2, 0]} rotation={[0, rotation, 0]} castShadow>
          <boxGeometry args={[0.05, 0.2, 0.2]} />
          <meshStandardMaterial color="#3366CC" roughness={0.5} />
        </mesh>
      ))}
      
      {/* Exhaust flames */}
      <mesh position={[0, -0.35, 0]} castShadow>
        <coneGeometry args={[0.1, 0.3, 16]} />
        <meshStandardMaterial color="#FFAA22" emissive="#FF8800" emissiveIntensity={2} roughness={0.9} />
      </mesh>
    </animated.group>
  );
};

// Pixar-style Rubber Duck
const RubberDuck = ({ isVisible, position }) => {
  const duckRef = useRef();
  
  // Duck animation spring
  const springs = useSpring({
    position: isVisible ? [position[0], 0.2, position[2]] : [0, 0, 0],
    scale: isVisible ? 0.5 : 0,
    rotation: isVisible ? [0, Math.PI/4, 0] : [0, 0, 0],
    config: { mass: 1, tension: 200, friction: 20, duration: 800 }
  });
  
  // Add duck waddling animation
  useFrame(({ clock }) => {
    if (duckRef.current && isVisible) {
      const t = clock.getElapsedTime();
      
      // Duck bobs up and down gently
      duckRef.current.position.y = position[1] + 0.2 + Math.sin(t * 3) * 0.05;
      
      // Duck rotates side to side like it's swimming
      duckRef.current.rotation.y = Math.PI/4 + Math.sin(t * 2) * 0.3;
      
      // Duck tilts forward and back slightly
      duckRef.current.rotation.x = Math.sin(t * 2) * 0.1;
      
      // Duck moves in a small circular pattern
      duckRef.current.position.x = position[0] + Math.sin(t * 1.5) * 0.2;
      duckRef.current.position.z = position[2] + Math.cos(t * 1.5) * 0.2;
    }
  });
  
  return (
    <animated.group
      ref={duckRef}
      position={springs.position}
      scale={springs.scale}
      rotation={springs.rotation}
    >
      {/* Duck body */}
      <mesh castShadow>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial color="#FFDD00" roughness={0.9} />
      </mesh>
      
      {/* Duck head */}
      <mesh position={[0, 0.2, 0.15]} castShadow>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial color="#FFDD00" roughness={0.9} />
      </mesh>
      
      {/* Duck bill */}
      <mesh position={[0, 0.17, 0.32]} rotation={[0.3, 0, 0]} castShadow>
        <boxGeometry args={[0.12, 0.05, 0.12]} />
        <meshStandardMaterial color="#FF8800" roughness={0.8} />
      </mesh>
      
      {/* Duck eyes */}
      <mesh position={[-0.06, 0.25, 0.25]} castShadow>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial color="#111111" roughness={0.5} />
      </mesh>
      <mesh position={[0.06, 0.25, 0.25]} castShadow>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial color="#111111" roughness={0.5} />
      </mesh>
      
      {/* Duck tail */}
      <mesh position={[0, 0.1, -0.2]} rotation={[0.2, 0, 0]} castShadow>
        <boxGeometry args={[0.1, 0.1, 0.1]} />
        <meshStandardMaterial color="#FFDD00" roughness={0.8} />
      </mesh>
    </animated.group>
  );
};

// Pixar-style Toy Robot
const ToyRobot = ({ isVisible, position }) => {
  const robotRef = useRef();
  const [dancing, setDancing] = useState(false);
  
  // Robot animation spring
  const springs = useSpring({
    position: isVisible ? [position[0], 0.3, position[2]] : [0, 0, 0],
    scale: isVisible ? 0.6 : 0,
    rotation: [0, dancing ? Math.PI * 4 : 0, 0],
    config: { 
      mass: 3, 
      tension: 200, 
      friction: 20, 
      duration: dancing ? 1000 : 1500 
    }
  });
  
  // Add robot dancing animation
  useFrame(({ clock }) => {
    if (robotRef.current && isVisible) {
      const t = clock.getElapsedTime();
      
      // Start dancing after 3 seconds
      if (t > 3 && !dancing) {
        setDancing(true);
      }
      
      // Robot bobs up and down
      robotRef.current.position.y = position[1] + 0.3 + Math.abs(Math.sin(t * 5)) * 0.2;
      
      // Robot arms move up and down
      if (robotRef.current.children[3]) {
        robotRef.current.children[3].rotation.z = Math.sin(t * 10) * 0.5 - 0.5;
      }
      if (robotRef.current.children[4]) {
        robotRef.current.children[4].rotation.z = -Math.sin(t * 10) * 0.5 + 0.5;
      }
      
      // Robot does a little dance
      if (dancing) {
        robotRef.current.rotation.y = Math.sin(t * 8) * 1;
      }
    }
  });
  
  return (
    <animated.group
      ref={robotRef}
      position={springs.position}
      scale={springs.scale}
      rotation={springs.rotation}
    >
      {/* Robot body */}
      <mesh castShadow>
        <boxGeometry args={[0.4, 0.5, 0.3]} />
        <meshStandardMaterial color="#CCCCCC" roughness={0.3} metalness={0.7} />
      </mesh>
      
      {/* Robot head */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial color="#DDDDDD" roughness={0.3} metalness={0.7} />
      </mesh>
      
      {/* Robot antenna */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.01, 0.01, 0.2, 8]} />
        <meshStandardMaterial color="#444444" roughness={0.3} metalness={0.8} />
        <mesh position={[0, 0.12, 0]} castShadow>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshStandardMaterial color="#FF0000" emissive="#FF0000" emissiveIntensity={0.5} />
        </mesh>
      </mesh>
      
      {/* Robot left arm */}
      <mesh position={[-0.25, 0.1, 0]} rotation={[0, 0, -0.5]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.4, 8]} />
        <meshStandardMaterial color="#AAAAAA" roughness={0.4} metalness={0.6} />
        <mesh position={[0, -0.25, 0]} castShadow>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshStandardMaterial color="#999999" roughness={0.4} metalness={0.6} />
        </mesh>
      </mesh>
      
      {/* Robot right arm */}
      <mesh position={[0.25, 0.1, 0]} rotation={[0, 0, 0.5]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.4, 8]} />
        <meshStandardMaterial color="#AAAAAA" roughness={0.4} metalness={0.6} />
        <mesh position={[0, -0.25, 0]} castShadow>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshStandardMaterial color="#999999" roughness={0.4} metalness={0.6} />
        </mesh>
      </mesh>
      
      {/* Robot legs */}
      <mesh position={[-0.1, -0.35, 0]} castShadow>
        <boxGeometry args={[0.1, 0.2, 0.1]} />
        <meshStandardMaterial color="#888888" roughness={0.4} metalness={0.7} />
      </mesh>
      <mesh position={[0.1, -0.35, 0]} castShadow>
        <boxGeometry args={[0.1, 0.2, 0.1]} />
        <meshStandardMaterial color="#888888" roughness={0.4} metalness={0.7} />
      </mesh>
      
      {/* Robot eyes */}
      <mesh position={[-0.08, 0.4, 0.16]} castShadow>
        <boxGeometry args={[0.08, 0.05, 0.01]} />
        <meshStandardMaterial color="#44EEFF" emissive="#44EEFF" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0.08, 0.4, 0.16]} castShadow>
        <boxGeometry args={[0.08, 0.05, 0.01]} />
        <meshStandardMaterial color="#44EEFF" emissive="#44EEFF" emissiveIntensity={0.5} />
      </mesh>
      
      {/* Robot mouth */}
      <mesh position={[0, 0.3, 0.16]} castShadow>
        <boxGeometry args={[0.15, 0.03, 0.01]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
    </animated.group>
  );
};

// Pixar-style Wind-up Mouse Toy
const WindupMouse = ({ isVisible, position }) => {
  const mouseRef = useRef();
  const tailRef = useRef();
  const [direction, setDirection] = useState(0);
  const [changeDirectionTime, setChangeDirectionTime] = useState(0);
  
  // Mouse animation spring
  const springs = useSpring({
    position: isVisible ? [position[0], 0.15, position[2]] : [0, 0, 0],
    scale: isVisible ? 0.4 : 0,
    rotation: isVisible ? [0, 0, 0] : [0, 0, 0],
    config: { mass: 1, tension: 280, friction: 20, duration: 700 }
  });
  
  // Add scurrying animation with random direction changes
  useFrame(({ clock }) => {
    if (mouseRef.current && isVisible) {
      const t = clock.getElapsedTime();
      
      // Change direction randomly every few seconds
      if (t > changeDirectionTime) {
        setDirection(Math.random() * Math.PI * 2);
        setChangeDirectionTime(t + 1.5 + Math.random() * 2);
      }
      
      // Scurry animation - fast movement in current direction
      const speed = 0.5;
      mouseRef.current.position.x += Math.cos(direction) * 0.01 * speed;
      mouseRef.current.position.z += Math.sin(direction) * 0.01 * speed;
      
      // Keep mouse within bounds
      const bounds = 2;
      if (Math.abs(mouseRef.current.position.x - position[0]) > bounds) {
        mouseRef.current.position.x = position[0] + (bounds * Math.sign(mouseRef.current.position.x - position[0]));
        setDirection(Math.PI - direction);
      }
      if (Math.abs(mouseRef.current.position.z - position[2]) > bounds) {
        mouseRef.current.position.z = position[2] + (bounds * Math.sign(mouseRef.current.position.z - position[2]));
        setDirection(-direction);
      }
      
      // Face direction of travel
      mouseRef.current.rotation.y = direction + Math.PI;
      
      // Wind-up key rotation
      if (mouseRef.current.children[4]) {
        mouseRef.current.children[4].rotation.z += 0.1;
      }
      
      // Tail wag animation
      if (tailRef.current) {
        tailRef.current.rotation.y = Math.sin(t * 10) * 0.5;
      }
    }
  });
  
  return (
    <animated.group
      ref={mouseRef}
      position={springs.position}
      scale={springs.scale}
      rotation={springs.rotation}
    >
      {/* Mouse body */}
      <mesh castShadow>
        <capsuleGeometry args={[0.15, 0.3, 16, 16]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#CCCCCC" roughness={0.9} />
      </mesh>
      
      {/* Mouse head */}
      <mesh position={[0.2, 0.08, 0]} castShadow>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#CCCCCC" roughness={0.9} />
        
        {/* Ears */}
        <mesh position={[0.05, 0.1, 0.08]} castShadow>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="#BBBBBB" roughness={0.9} />
        </mesh>
        <mesh position={[0.05, 0.1, -0.08]} castShadow>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="#BBBBBB" roughness={0.9} />
        </mesh>
        
        {/* Nose */}
        <mesh position={[0.1, 0, 0]} castShadow>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshStandardMaterial color="#FF9999" roughness={0.7} />
        </mesh>
        
        {/* Eyes */}
        <mesh position={[0.08, 0.08, 0.06]} castShadow>
          <sphereGeometry args={[0.02, 16, 16]} />
          <meshStandardMaterial color="#000000" roughness={0.5} />
        </mesh>
        <mesh position={[0.08, 0.08, -0.06]} castShadow>
          <sphereGeometry args={[0.02, 16, 16]} />
          <meshStandardMaterial color="#000000" roughness={0.5} />
        </mesh>
      </mesh>
      
      {/* Mouse feet */}
      <mesh position={[-0.1, -0.15, 0.1]} castShadow>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#AAAAAA" roughness={0.9} />
      </mesh>
      <mesh position={[-0.1, -0.15, -0.1]} castShadow>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#AAAAAA" roughness={0.9} />
      </mesh>
      
      {/* Wind-up key */}
      <mesh position={[-0.25, 0.1, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.1, 8]} />
        <meshStandardMaterial color="#FFCC00" metalness={0.7} roughness={0.3} />
        <mesh position={[0, 0, 0.1]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <boxGeometry args={[0.15, 0.05, 0.02]} />
          <meshStandardMaterial color="#FFCC00" metalness={0.7} roughness={0.3} />
        </mesh>
      </mesh>
      
      {/* Tail */}
      <mesh ref={tailRef} position={[-0.2, 0.05, 0]} rotation={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.015, 0.005, 0.4, 8]} />
        <meshStandardMaterial color="#AAAAAA" roughness={0.8} />
      </mesh>
    </animated.group>
  );
};

// Pixar-style Yo-Yo Toy
const YoYoToy = ({ isVisible, position }) => {
  const yoyoRef = useRef();
  const stringPointsRef = useRef([]);
  
  // Generate initial points for the string
  React.useEffect(() => {
    if (isVisible) {
      // Create 10 points for the string
      const points = [];
      for (let i = 0; i < 10; i++) {
        points.push(new THREE.Vector3(0, -i * 0.05, 0));
      }
      stringPointsRef.current = points;
    }
  }, [isVisible]);
  
  // YoYo animation spring
  const springs = useSpring({
    position: isVisible ? [position[0], 0.8, position[2]] : [0, 0, 0],
    scale: isVisible ? 0.7 : 0,
    rotation: isVisible ? [0, 0, 0] : [0, 0, 0],
    config: { mass: 1, tension: 180, friction: 20, duration: 1000 }
  });
  
  // Add yo-yo physics animation
  useFrame(({ clock }) => {
    if (yoyoRef.current && isVisible && stringPointsRef.current.length > 0) {
      const t = clock.getElapsedTime();
      
      // Yo-yo movement - dropping down and coming back up
      const yoYoPhase = (t % 3) / 3; // 0 to 1 over 3 seconds
      let yPos;
      
      if (yoYoPhase < 0.4) {
        // Drop down
        yPos = 0.8 - yoYoPhase * 1.5;
      } else if (yoYoPhase < 0.5) {
        // Stay at bottom briefly
        yPos = 0.2;
      } else {
        // Come back up
        yPos = 0.2 + (yoYoPhase - 0.5) * 1.2;
      }
      
      // Apply position to yo-yo body
      yoyoRef.current.position.y = yPos;
      
      // Rotation based on movement
      yoyoRef.current.rotation.x = t * 10 % (Math.PI * 2);
      
      // Update string points physics
      if (yoyoRef.current.children[2] && stringPointsRef.current.length > 0) {
        const numPoints = stringPointsRef.current.length;
        
        // Update the positions of the string points
        const startPoint = new THREE.Vector3(0, 0.8, 0);
        const endPoint = new THREE.Vector3(0, yPos, 0);
        
        // Use Verlet integration for simple physics
        for (let i = 0; i < numPoints; i++) {
          const t = i / (numPoints - 1);
          
          // Simple catenary curve
          const x = 0;
          const y = startPoint.y * (1 - t) + endPoint.y * t;
          const sag = Math.sin(Math.PI * t) * 0.1 * (1 - (yPos / 0.8));
          const z = sag * Math.sin(t * 5 + clock.getElapsedTime() * 2);
          
          stringPointsRef.current[i].set(x, y, z);
        }
        
        // Update line geometry
        if (yoyoRef.current.children[2].geometry) {
          yoyoRef.current.children[2].geometry.setFromPoints(stringPointsRef.current);
          yoyoRef.current.children[2].geometry.computeBoundingSphere();
        }
      }
    }
  });
  
  return (
    <animated.group
      position={springs.position}
      scale={springs.scale}
      rotation={springs.rotation}
    >
      {/* Yo-yo handle/knob */}
      <mesh castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.1, 16]} />
        <meshStandardMaterial color="#FF5555" roughness={0.7} />
      </mesh>
      
      {/* Yo-yo main body */}
      <mesh ref={yoyoRef} position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.08, 32]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#FF5555" roughness={0.5} />
        
        {/* Decorative line around yo-yo */}
        <mesh position={[0, 0, 0]} castShadow>
          <torusGeometry args={[0.15, 0.01, 16, 32]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.5} />
        </mesh>
      </mesh>
      
      {/* Yo-yo string */}
      <line>
        <bufferGeometry attach="geometry" />
        <lineBasicMaterial attach="material" color="#FFFFFF" linewidth={1} />
      </line>
    </animated.group>
  );
};

// Pixar-style Jack-in-the-Box
const JackInTheBox = ({ isVisible, position }) => {
  const boxRef = useRef();
  const jackRef = useRef();
  const lidRef = useRef();
  const [isJackOut, setIsJackOut] = useState(false);
  
  // Jack-in-the-Box animation springs
  const boxSprings = useSpring({
    position: isVisible ? [position[0], 0.2, position[2]] : [0, 0, 0],
    scale: isVisible ? 0.6 : 0,
    rotation: isVisible ? [0, 0, 0] : [0, 0, 0],
    config: { mass: 2, tension: 200, friction: 20, duration: 800 }
  });
  
  // Jack pop-out and lid spring
  const jackSprings = useSpring({
    jackY: isJackOut ? 0.8 : 0.0,
    lidRotation: isJackOut ? -2.5 : 0,
    config: { mass: 1, tension: 180, friction: 12 }
  });
  
  // Add animation for the jack to pop out
  useFrame(({ clock }) => {
    if (boxRef.current && isVisible) {
      const t = clock.getElapsedTime();
      
      // Box wobbles faster and faster before Jack pops out
      if (!isJackOut && t > 2) {
        const wobbleIntensity = Math.min(0.4, (t - 2) * 0.1);
        const wobbleSpeed = 5 + (t - 2) * 3;
        
        boxRef.current.rotation.x = Math.sin(t * wobbleSpeed) * wobbleIntensity;
        boxRef.current.rotation.z = Math.cos(t * wobbleSpeed) * wobbleIntensity;
        
        // Jack pops out at a specific time
        if (t > 5 && !isJackOut) {
          setIsJackOut(true);
        }
      }
      
      // After Jack pops out, the box settles down
      if (isJackOut) {
        boxRef.current.rotation.x = Math.sin(t * 1.5) * 0.05;
        boxRef.current.rotation.z = Math.cos(t * 1.5) * 0.05;
        
        // Jack bounces slightly on its spring
        if (jackRef.current) {
          jackRef.current.position.y = jackSprings.jackY.get() + Math.sin(t * 8) * 0.05;
        }
      }
    }
  });
  
  return (
    <animated.group
      ref={boxRef}
      position={boxSprings.position}
      scale={boxSprings.scale}
      rotation={boxSprings.rotation}
    >
      {/* Jack-in-the-Box base */}
      <mesh castShadow>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#5D4037" roughness={0.8} />
        
        {/* Decorative panels */}
        {[
          [0, 0, 0.251], // front
          [0, 0, -0.251], // back
          [0.251, 0, 0], // right
          [-0.251, 0, 0], // left
        ].map((pos, i) => (
          <mesh key={i} position={pos} rotation={[0, i < 2 ? 0 : Math.PI/2, 0]} castShadow>
            <planeGeometry args={[0.45, 0.45]} />
            <meshStandardMaterial color="#D32F2F" roughness={0.7} />
            
            {/* Stars decoration */}
            <mesh position={[0, 0, 0.001]} castShadow>
              <circleGeometry args={[0.1, 5]} />
              <meshStandardMaterial color="#FFD54F" roughness={0.6} />
            </mesh>
            
            {/* Corner decorations */}
            {[
              [0.15, 0.15, 0.001],
              [-0.15, 0.15, 0.001],
              [0.15, -0.15, 0.001],
              [-0.15, -0.15, 0.001],
            ].map((cornerPos, j) => (
              <mesh key={j} position={cornerPos} castShadow>
                <circleGeometry args={[0.05, 32]} />
                <meshStandardMaterial color="#FFD54F" roughness={0.6} />
              </mesh>
            ))}
          </mesh>
        ))}
      </mesh>
      
      {/* Jack-in-the-Box lid */}
      <animated.mesh
        ref={lidRef}
        position={[0, 0.25, 0]}
        rotation={[jackSprings.lidRotation, 0, 0]}
        castShadow
      >
        <boxGeometry args={[0.52, 0.05, 0.52]} />
        <meshStandardMaterial color="#4E342E" roughness={0.8} />
      </animated.mesh>
      
      {/* Jack (clown) that pops out */}
      <animated.group
        ref={jackRef}
        position={[0, jackSprings.jackY, 0]}
      >
        {/* Spiral spring */}
        <mesh position={[0, 0.3, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.6, 16]} />
          <meshStandardMaterial color="#AAAAAA" roughness={0.5} metalness={0.8} />
        </mesh>
        
        {/* Jack's head */}
        <mesh position={[0, 0.75, 0]} castShadow>
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshStandardMaterial color="#FFECB3" roughness={0.8} />
          
          {/* Jack's hat */}
          <mesh position={[0, 0.15, 0]} castShadow>
            <coneGeometry args={[0.15, 0.3, 32]} />
            <meshStandardMaterial color="#4CAF50" roughness={0.8} />
            <mesh position={[0, 0.15, 0]} castShadow>
              <sphereGeometry args={[0.05, 16, 16]} />
              <meshStandardMaterial color="#FFEB3B" roughness={0.8} />
            </mesh>
          </mesh>
          
          {/* Jack's features */}
          {/* Eyes */}
          <mesh position={[0.08, 0.05, 0.15]} castShadow>
            <sphereGeometry args={[0.03, 16, 16]} />
            <meshStandardMaterial color="#000000" roughness={0.5} />
          </mesh>
          <mesh position={[-0.08, 0.05, 0.15]} castShadow>
            <sphereGeometry args={[0.03, 16, 16]} />
            <meshStandardMaterial color="#000000" roughness={0.5} />
          </mesh>
          
          {/* Nose */}
          <mesh position={[0, 0, 0.18]} castShadow>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshStandardMaterial color="#FF5252" roughness={0.8} />
          </mesh>
          
          {/* Smile */}
          <mesh position={[0, -0.08, 0.16]} rotation={[0.3, 0, 0]} castShadow>
            <torusGeometry args={[0.07, 0.015, 16, 16, Math.PI]} />
            <meshStandardMaterial color="#D32F2F" roughness={0.7} />
          </mesh>
        </mesh>
        
        {/* Jack's collar */}
        <mesh position={[0, 0.6, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.15, 0.05, 16]} />
          <meshStandardMaterial color="#FF5252" roughness={0.8} />
        </mesh>
      </animated.group>
    </animated.group>
  );
};

// Giant Balloon Teddy Bear
const GiantBalloonTeddy = ({ isVisible, position }) => {
  const bearRef = useRef();
  
  // Bear animation spring with delayed appearance
  const springs = useSpring({
    position: isVisible ? [position[0], position[1], position[2]] : [position[0], -20, position[2]],
    scale: isVisible ? 15 : 0, // Increased size from 8 to 15
    rotation: [0, 0, 0],
    config: { 
      mass: 2, 
      tension: 120, 
      friction: 14,
      // Add delay so they appear after the small toys
      delay: isVisible ? 800 : 0
    }
  });
  
  // Add gentle floating animation
  useFrame(({ clock }) => {
    if (bearRef.current && isVisible) {
      const t = clock.getElapsedTime();
      
      // Gentle bobbing up and down like a balloon
      bearRef.current.position.y = position[1] + Math.sin(t * 0.4) * 0.8; // Increased movement
      
      // Slight rotation for believable balloon movement
      bearRef.current.rotation.y = Math.sin(t * 0.2) * 0.4; // More rotation
      bearRef.current.rotation.z = Math.sin(t * 0.3) * 0.1;
      
      // Subtle swaying
      bearRef.current.position.x = position[0] + Math.sin(t * 0.2) * 0.4;
      bearRef.current.position.z = position[2] + Math.cos(t * 0.2) * 0.4;
    }
  });
  
  return (
    <animated.group
      ref={bearRef}
      position={springs.position}
      scale={springs.scale}
      rotation={springs.rotation}
    >
      {/* Body - slightly transparent for balloon look */}
      <mesh castShadow>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial color="#FF3D00" roughness={0.4} transparent opacity={0.9} emissive="#FF5722" emissiveIntensity={0.2} />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial color="#FF3D00" roughness={0.4} transparent opacity={0.9} emissive="#FF5722" emissiveIntensity={0.2} />
      </mesh>
      
      {/* Ears */}
      <mesh position={[-0.15, 0.42, 0]} castShadow>
        <sphereGeometry args={[0.08, 32, 32]} />
        <meshStandardMaterial color="#FF5722" roughness={0.4} transparent opacity={0.9} />
      </mesh>
      <mesh position={[0.15, 0.42, 0]} castShadow>
        <sphereGeometry args={[0.08, 32, 32]} />
        <meshStandardMaterial color="#FF5722" roughness={0.4} transparent opacity={0.9} />
      </mesh>
      
      {/* Snout */}
      <mesh position={[0, 0.25, 0.15]} castShadow>
        <sphereGeometry args={[0.08, 32, 32]} />
        <meshStandardMaterial color="#FF3D00" roughness={0.4} transparent opacity={0.9} emissive="#FF5722" emissiveIntensity={0.2} />
      </mesh>
      
      {/* Nose */}
      <mesh position={[0, 0.27, 0.22]} castShadow>
        <sphereGeometry args={[0.03, 32, 32]} />
        <meshStandardMaterial color="#333333" roughness={0.5} />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[-0.07, 0.33, 0.17]} castShadow>
        <sphereGeometry args={[0.02, 32, 32]} />
        <meshStandardMaterial color="#111111" roughness={0.5} />
      </mesh>
      <mesh position={[0.07, 0.33, 0.17]} castShadow>
        <sphereGeometry args={[0.02, 32, 32]} />
        <meshStandardMaterial color="#111111" roughness={0.5} />
      </mesh>
      
      {/* Arms */}
      <mesh position={[-0.2, 0.1, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
        <capsuleGeometry args={[0.06, 0.15]} />
        <meshStandardMaterial color="#FF3D00" roughness={0.4} transparent opacity={0.9} emissive="#FF5722" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[0.2, 0.1, 0]} rotation={[0, 0, -Math.PI / 4]} castShadow>
        <capsuleGeometry args={[0.06, 0.15]} />
        <meshStandardMaterial color="#FF3D00" roughness={0.4} transparent opacity={0.9} emissive="#FF5722" emissiveIntensity={0.2} />
      </mesh>
      
      {/* Legs */}
      <mesh position={[-0.1, -0.15, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <capsuleGeometry args={[0.06, 0.12]} />
        <meshStandardMaterial color="#FF3D00" roughness={0.4} transparent opacity={0.9} emissive="#FF5722" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[0.1, -0.15, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <capsuleGeometry args={[0.06, 0.12]} />
        <meshStandardMaterial color="#FF3D00" roughness={0.4} transparent opacity={0.9} emissive="#FF5722" emissiveIntensity={0.2} />
      </mesh>
      
      {/* Balloon string */}
      <mesh position={[0, -0.3, 0]} castShadow>
        <cylinderGeometry args={[0.005, 0.005, 1.2, 8]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
      </mesh>
    </animated.group>
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
  const [isBoxOpen, setIsBoxOpen] = useState(false);
  const [showToys, setShowToys] = useState(false);
  
  // Show toys when box is opened
  React.useEffect(() => {
    let timeout;
    if (isBoxOpen) {
      timeout = setTimeout(() => {
        setShowToys(true);
      }, 500);
    } else {
      setShowToys(false);
    }
    
    return () => clearTimeout(timeout);
  }, [isBoxOpen]);
  
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
      camera={{ position: [5, 5, 5], fov: 35 }}
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
      <ToyBox isOpen={isBoxOpen} setIsOpen={setIsBoxOpen} />
      <Ground />
      
      {/* Toys that appear when box is opened */}
      <RubberBall isVisible={showToys} position={[-1.5, 0, 1]} />
      <ToyTrain isVisible={showToys} position={[0, 0, 1.5]} />
      <TeddyBear isVisible={showToys} position={[1.5, 0, 0.5]} />
      <ToyRocket isVisible={showToys} position={[-0.8, 0, -0.8]} />
      <RubberDuck isVisible={showToys} position={[0.8, 0, -1.2]} />
      <ToyRobot isVisible={showToys} position={[0, 0, -0.5]} />
      
      {/* New toys */}
      <WindupMouse isVisible={showToys} position={[-1.4, 0, -0.1]} />
      <YoYoToy isVisible={showToys} position={[1.5, 0, -1.8]} />
      <JackInTheBox isVisible={showToys} position={[-0.5, 0, -2]} />
      
      {/* Giant Balloon Teddy Bears in the background - moved closer */}
      <GiantBalloonTeddy isVisible={showToys} position={[-8, 6, -10]} />
      <GiantBalloonTeddy isVisible={showToys} position={[8, 8, -12]} />
      <GiantBalloonTeddy isVisible={showToys} position={[0, 10, -15]} />
      
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
        maxDistance={20}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.5}
        target={[0, 0.5, 0]}
      />
    </Canvas>
  );
};

export default MinimalScene; 