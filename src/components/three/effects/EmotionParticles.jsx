import React, { useRef, useMemo, forwardRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

// Create a custom heart shape
const createHeartShape = () => {
  const shape = new THREE.Shape();
  const x = 0, y = 0;
  
  shape.moveTo(x, y + 0.25);
  shape.bezierCurveTo(x, y + 0.25, x - 0.25, y, x - 0.25, y);
  shape.bezierCurveTo(x - 0.25, y - 0.25, x, y - 0.5, x, y - 0.5);
  shape.bezierCurveTo(x, y - 0.5, x + 0.25, y - 0.25, x + 0.25, y);
  shape.bezierCurveTo(x + 0.25, y, x, y + 0.25, x, y + 0.25);
  
  return shape;
};

// Create a custom star shape
const createStarShape = (innerRadius = 0.2, outerRadius = 0.5, points = 5) => {
  const shape = new THREE.Shape();
  const angleStep = Math.PI / points;
  
  // Start at the top (y is positive up)
  shape.moveTo(0, outerRadius);
  
  // Draw the star points
  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? innerRadius : outerRadius;
    const angle = angleStep * i;
    const x = Math.sin(angle) * radius;
    const y = Math.cos(angle) * radius;
    shape.lineTo(x, y);
  }
  
  shape.closePath();
  return shape;
};

// Emotion Particles Component
const EmotionParticles = forwardRef(({ 
  type = 'heart', 
  count = 15, 
  color = '#FF6B6B', 
  position = [0, 0, 0],
  visible = false
}, ref) => {
  const groupRef = useRef();
  const particlesRef = useRef([]);
  
  // Expose the ref
  React.useImperativeHandle(ref, () => groupRef.current);
  
  // Initialize particle references
  particlesRef.current = Array(count).fill().map((_, i) => particlesRef.current[i] || React.createRef());
  
  // Create either heart or star geometry based on type
  const geometry = useMemo(() => {
    if (type === 'heart') {
      const heartShape = createHeartShape();
      return new THREE.ShapeGeometry(heartShape);
    } else {
      const starShape = createStarShape();
      return new THREE.ShapeGeometry(starShape);
    }
  }, [type]);
  
  // Animation for particles
  useFrame(({ clock }) => {
    if (!groupRef.current || !visible) return;
    
    const t = clock.getElapsedTime();
    
    particlesRef.current.forEach((particleRef, i) => {
      if (particleRef.current) {
        // Create different timing for each particle
        const individualOffset = i * 0.2;
        const individualTime = t + individualOffset;
        
        // Rising motion with slight x-axis movement
        particleRef.current.position.y = position[1] + individualTime * 0.5;
        particleRef.current.position.x = position[0] + Math.sin(individualTime * 2) * 0.2;
        
        // Rotation
        particleRef.current.rotation.z = individualTime * 0.5;
        
        // Fade out based on distance from origin
        const distanceFromOrigin = particleRef.current.position.y - position[1];
        particleRef.current.material.opacity = Math.max(0, 1 - distanceFromOrigin / 2);
        
        // Reset particles that have gone too far or faded out
        if (distanceFromOrigin > 3 || particleRef.current.material.opacity <= 0) {
          particleRef.current.position.set(
            position[0] + (Math.random() - 0.5) * 0.3,
            position[1],
            position[2] + (Math.random() - 0.5) * 0.3
          );
          particleRef.current.material.opacity = 1;
          particleRef.current.scale.set(
            0.1 + Math.random() * 0.2,
            0.1 + Math.random() * 0.2,
            0.1 + Math.random() * 0.2
          );
        }
      }
    });
  });
  
  return (
    <group ref={groupRef} position={position} visible={visible}>
      {Array.from({ length: count }).map((_, i) => (
        <mesh 
          key={i}
          ref={particlesRef.current[i]}
          position={[
            (Math.random() - 0.5) * 0.3,
            0,
            (Math.random() - 0.5) * 0.3
          ]}
          scale={[0.1 + Math.random() * 0.2, 0.1 + Math.random() * 0.2, 0.1 + Math.random() * 0.2]}
        >
          <primitive object={geometry.clone()} />
          <meshBasicMaterial 
            color={color}
            transparent
            opacity={1}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
});

export default EmotionParticles; 