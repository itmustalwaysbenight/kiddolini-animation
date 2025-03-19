import React, { useRef, useMemo, forwardRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

const TrailEffect = forwardRef(({ 
  target, 
  length = 20, 
  width = 0.3, 
  color = '#FFE66D', 
  fade = 0.95,
  minOpacity = 0.2,
  visible = true
}, ref) => {
  const groupRef = useRef();
  const trailPointsRef = useRef([]);
  const trailMeshRef = useRef();
  const lastPosition = useRef(null);
  const trailGeometryRef = useRef(null);
  
  // Expose the ref
  React.useImperativeHandle(ref, () => groupRef.current);
  
  // Create trail material
  const trailMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide,
    });
  }, [color]);
  
  // Initialize trail points
  useMemo(() => {
    trailPointsRef.current = new Array(length).fill().map(() => new THREE.Vector3());
  }, [length]);
  
  useFrame(() => {
    if (!target || !groupRef.current || !trailMeshRef.current || !visible) return;
    
    // Get target position
    const targetPosition = target.position.clone();
    
    // If first time or target has moved enough
    if (!lastPosition.current || 
        lastPosition.current.distanceTo(targetPosition) > 0.1) {
      
      // Update trail points (shift all points down)
      for (let i = trailPointsRef.current.length - 1; i > 0; i--) {
        trailPointsRef.current[i].copy(trailPointsRef.current[i - 1]);
      }
      
      // Add current position to the front
      trailPointsRef.current[0].copy(targetPosition);
      lastPosition.current = targetPosition.clone();
      
      // Create or update trail geometry
      if (trailPointsRef.current.length >= 2) {
        if (trailGeometryRef.current) {
          trailGeometryRef.current.dispose();
        }
        
        // Create a curved path from points
        const curve = new THREE.CatmullRomCurve3(trailPointsRef.current.filter(p => !p.equals(new THREE.Vector3())));
        
        // Create tube geometry along the curve
        if (curve.points.length >= 2) {
          trailGeometryRef.current = new THREE.TubeGeometry(
            curve,
            20,         // tubular segments
            width,      // radius
            8,          // radial segments
            false       // closed
          );
          
          // Update mesh with new geometry
          trailMeshRef.current.geometry = trailGeometryRef.current;
          
          // Fade trail based on distance from head
          const colors = [];
          const positions = trailGeometryRef.current.getAttribute('position');
          
          for (let i = 0; i < positions.count; i++) {
            // Calculate distance from start
            const vertexIndex = Math.floor(i / (positions.count / curve.points.length));
            const fade = Math.max(minOpacity, 1 - vertexIndex / curve.points.length);
            
            colors.push(fade, fade, fade);
          }
          
          // Add colors attribute to the geometry
          trailGeometryRef.current.setAttribute(
            'color',
            new THREE.Float32BufferAttribute(colors, 3)
          );
          
          // Update material to use vertex colors
          trailMeshRef.current.material.vertexColors = true;
        }
      }
    }
  });
  
  return (
    <group ref={groupRef} visible={visible}>
      <mesh ref={trailMeshRef}>
        <primitive attach="material" object={trailMaterial} />
      </mesh>
    </group>
  );
});

export default TrailEffect; 