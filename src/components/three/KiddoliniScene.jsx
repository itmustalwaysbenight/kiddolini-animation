import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  PerspectiveCamera, 
  OrbitControls, 
  Environment, 
  useProgress,
  AdaptiveDpr
} from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

// Import components
import KiddoliniBox from './models/KiddoliniBox';
import ToyModels, { 
  TeddyBear, 
  BuildingBlocks, 
  ToyCar, 
  WoodenTrain, 
  FabricDoll 
} from './models/ToyModels';
import EnvironmentScene from './models/Environment';
import EmotionParticles from './effects/EmotionParticles';
import TrailEffect from './effects/TrailEffect';

// Import utilities
import { 
  handleResize, 
  getDevicePerformanceLevel, 
  createPath 
} from '../../utils/three';
import { 
  animateBoxOpen, 
  animateBoxClose, 
  animateToysOut, 
  animateToysIn, 
  animateToyPeek, 
  animateToyEmotion, 
  animateBoxJourney, 
  setupParallaxEffect 
} from '../../utils/animations';

// Scene manager component
const SceneManager = () => {
  const { camera, scene, gl } = useThree();
  const boxRef = useRef();
  const boxLidRef = useRef();
  const toysRefs = useRef([]);
  const emotionParticlesRef = useRef();
  const trailEffectRef = useRef();
  const [toysVisible, setToysVisible] = useState(false);
  const [emotionVisible, setEmotionVisible] = useState(false);
  const [emotionPosition, setEmotionPosition] = useState([0, 1, 0]);
  const [emotionType, setEmotionType] = useState('heart');
  const [boxAnimation, setBoxAnimation] = useState('idle');
  
  console.log("SceneManager initialized");
  
  // Set up the scene
  useEffect(() => {
    console.log("SceneManager useEffect running");
    
    // Set up camera
    camera.position.set(0, 2, 5);
    camera.lookAt(0, 0, 0);
    
    // Handle window resize
    try {
      handleResize(camera, gl);
      console.log("Resize handler setup successfully");
    } catch (error) {
      console.error("Resize handler error:", error);
    }
    
    // Detect device performance to adjust quality
    const performanceLevel = getDevicePerformanceLevel();
    
    // Setup parallax effect
    setupParallaxEffect(scene, 0.1);
    
    // Initialize toys refs
    toysRefs.current = Array(5).fill().map((_, i) => toysRefs.current[i] || React.createRef());
    
    // Start idle animation (floating box)
    setBoxAnimation('idle');
    
    // Start the peek animation after a delay
    setTimeout(() => {
      animateToyPeek(toysRefs.current[0].current, boxRef.current, 2);
    }, 2000);
    
    return () => {
      // Cleanup animations
      gsap.killTweensOf(boxRef.current);
      gsap.killTweensOf(boxLidRef.current);
      toysRefs.current.forEach(ref => {
        if (ref.current) gsap.killTweensOf(ref.current);
      });
    };
  }, []);
  
  // Handle box interactions
  const handleBoxInteraction = (action) => {
    if (action === 'open') {
      // Open the box
      animateBoxOpen(boxRef.current, boxLidRef.current, 1, () => {
        // Show toys after box opens
        setToysVisible(true);
        
        // Animate toys coming out
        animateToysOut(
          toysRefs.current.map(ref => ref.current),
          0.2,
          1.5,
          0.15
        );
      });
    } else if (action === 'close') {
      // First animate toys going back in
      animateToysIn(
        toysRefs.current.map(ref => ref.current),
        boxRef.current,
        0.2,
        1.2,
        0.1
      ).then(() => {
        // Hide toys and close box
        setToysVisible(false);
        animateBoxClose(boxRef.current, boxLidRef.current);
      });
    }
  };
  
  // Handle house reached in journey
  const handleHouseReached = (houseIndex, box) => {
    // We'll show different emotions at each house
    const emotions = ['heart', 'star', 'heart'];
    const emotion = emotions[houseIndex % emotions.length];
    
    // Update emotion particle position
    setEmotionPosition([
      box.position.x,
      box.position.y + 1,
      box.position.z
    ]);
    
    // Set emotion type and show it
    setEmotionType(emotion);
    setEmotionVisible(true);
    
    // Hide after a delay
    setTimeout(() => {
      setEmotionVisible(false);
    }, 2000);
  };
  
  // Journey path
  const journeyPath = createPath([
    new THREE.Vector3(-8, 0, -5),
    new THREE.Vector3(-4, 0, 0),
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(4, 0, 4),
    new THREE.Vector3(8, 0, 2),
    new THREE.Vector3(4, 0, -3),
    new THREE.Vector3(-8, 0, -5)
  ]);
  
  // Start journey animation if in journey mode
  useEffect(() => {
    if (boxAnimation === 'journey' && boxRef.current) {
      animateBoxJourney(
        boxRef.current,
        journeyPath,
        toysRefs.current.map(ref => ref.current),
        30, // duration in seconds
        handleHouseReached
      );
    }
  }, [boxAnimation]);
  
  // Handle user interaction with scene
  const handleSceneClick = (e) => {
    // If clicked on background, toggle journey animation
    if (e.object === scene) {
      if (boxAnimation === 'idle') {
        setBoxAnimation('journey');
      } else {
        setBoxAnimation('idle');
      }
    }
  };
  
  return (
    <>
      {/* Debug sphere to test rendering */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="red" />
      </mesh>

      {/* Add a simple ambient and directional light */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      
      {/* Simple ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#90EE90" />
      </mesh>

      {/* Environment */}
      <EnvironmentScene 
        pathPoints={[
          [-8, 0, -5],
          [-4, 0, 0],
          [0, 0, 0],
          [4, 0, 4],
          [8, 0, 2],
          [4, 0, -3],
          [-8, 0, -5]
        ]}
        housePositions={[
          [-8, 0, -5],
          [0, 0, 0],
          [8, 0, 2]
        ]}
      />
      
      {/* Kiddolini Box */}
      <KiddoliniBox 
        ref={boxRef}
        lidRef={boxLidRef}
        position={[0, 0.6, 0]}
        onInteraction={handleBoxInteraction}
      />
      
      {/* Trail effect for the box journey */}
      <TrailEffect 
        ref={trailEffectRef}
        target={boxRef.current}
        length={20}
        width={0.2}
        color="#FFE66D"
        visible={boxAnimation === 'journey'}
      />
      
      {/* Toys */}
      <group visible={toysVisible}>
        <TeddyBear 
          ref={toysRefs.current[0]}
          position={[-1, 0.3, 0.5]}
          scale={0.6}
        />
        
        <BuildingBlocks 
          ref={toysRefs.current[1]}
          position={[1, 0.3, 0.5]}
          scale={0.6}
        />
        
        <ToyCar 
          ref={toysRefs.current[2]}
          position={[0.8, 0.3, -0.5]}
          scale={0.6}
        />
        
        <WoodenTrain 
          ref={toysRefs.current[3]}
          position={[-0.8, 0.3, -0.5]}
          scale={0.6}
        />
        
        <FabricDoll 
          ref={toysRefs.current[4]}
          position={[0, 0.3, 0]}
          scale={0.6}
        />
      </group>
      
      {/* Emotion particles effect */}
      <EmotionParticles 
        ref={emotionParticlesRef}
        type={emotionType}
        position={emotionPosition}
        visible={emotionVisible}
        count={15}
      />
      
      {/* Camera controls with limits */}
      <OrbitControls 
        enableZoom={true}
        enablePan={false}
        minDistance={3}
        maxDistance={15}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2}
      />
    </>
  );
};

// Fallback loading component
const Loader = () => {
  const { progress } = useProgress();
  return (
    <div className="loading-screen">
      <div className="loading-animation"></div>
      <p>Loading Kiddolini's world... {progress.toFixed(0)}%</p>
    </div>
  );
};

// Main scene component
const KiddoliniScene = () => {
  return (
    <Canvas shadows dpr={[1, 2]}>
      <AdaptiveDpr pixelated />
      <color attach="background" args={['#87CEEB']} />
      <fog attach="fog" args={['#87CEEB', 10, 30]} />
      
      <Suspense fallback={<Loader />}>
        <SceneManager />
        <Environment preset="sunset" />
      </Suspense>
    </Canvas>
  );
};

export default KiddoliniScene; 