import gsap from 'gsap';
import * as THREE from 'three';

// Animation for the box opening
export const animateBoxOpen = (box, lid, duration = 1, onComplete = () => {}) => {
  return gsap.to(lid.rotation, {
    x: -Math.PI / 2,
    duration,
    ease: 'elastic.out(1, 0.7)',
    onComplete
  });
};

// Animation for the box closing
export const animateBoxClose = (box, lid, duration = 1, onComplete = () => {}) => {
  return gsap.to(lid.rotation, {
    x: 0,
    duration,
    ease: 'power2.inOut',
    onComplete
  });
};

// Animation for toys hopping out of the box
export const animateToysOut = (toys, delay = 0, duration = 1, stagger = 0.2) => {
  const timeline = gsap.timeline({ delay });
  
  toys.forEach((toy, index) => {
    const initialPosition = toy.position.clone();
    const targetY = initialPosition.y + 1.5;
    
    // Jump out animation
    timeline.to(
      toy.position, 
      {
        y: targetY,
        duration: duration * 0.5,
        ease: 'power2.out'
      }, 
      index * stagger
    );
    
    // Apply bouncy elastic effect
    timeline.to(
      toy.scale, 
      {
        x: 1.2,
        y: 0.8,
        z: 1.2,
        duration: duration * 0.25,
        ease: 'power1.in'
      }, 
      index * stagger
    );
    
    timeline.to(
      toy.scale, 
      {
        x: 1,
        y: 1,
        z: 1,
        duration: duration * 0.25,
        ease: 'elastic.out(1, 0.5)'
      }, 
      index * stagger + duration * 0.25
    );
    
    // Land back
    timeline.to(
      toy.position, 
      {
        y: initialPosition.y,
        duration: duration * 0.5,
        ease: 'bounce.out'
      }, 
      index * stagger + duration * 0.5
    );
  });
  
  return timeline;
};

// Animation for toys returning to the box
export const animateToysIn = (toys, box, delay = 0, duration = 1, stagger = 0.15) => {
  const timeline = gsap.timeline({ delay });
  const boxPosition = new THREE.Vector3(box.position.x, box.position.y + 0.5, box.position.z);
  
  toys.forEach((toy, index) => {
    // Jump up first
    timeline.to(
      toy.position, 
      {
        y: toy.position.y + 1,
        duration: duration * 0.3,
        ease: 'power2.out'
      }, 
      index * stagger
    );
    
    // Move to box
    timeline.to(
      toy.position, 
      {
        x: boxPosition.x,
        y: boxPosition.y,
        z: boxPosition.z,
        duration: duration * 0.7,
        ease: 'power2.inOut'
      }, 
      index * stagger + duration * 0.3
    );
    
    // Scale down as if going inside
    timeline.to(
      toy.scale, 
      {
        x: 0.1,
        y: 0.1,
        z: 0.1,
        duration: duration * 0.2,
        ease: 'power2.in'
      }, 
      index * stagger + duration * 0.8
    );
    
    // Hide
    timeline.set(
      toy, 
      { visible: false }, 
      index * stagger + duration * 1
    );
  });
  
  return timeline;
};

// Idle floating animation for the box
export const animateBoxFloat = (box) => {
  // Create continuous bobbing effect
  gsap.to(box.position, {
    y: box.position.y + 0.1,
    duration: 1.5,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  });
  
  // Add slight rotation to make it more lively
  gsap.to(box.rotation, {
    x: box.rotation.x + 0.03,
    y: box.rotation.y + 0.03,
    duration: 3,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  });
};

// Peeking toy animation
export const animateToyPeek = (toy, box, repeat = 2) => {
  const timeline = gsap.timeline({ repeat, repeatDelay: 4 });
  const initialPosition = toy.position.clone();
  const peekPosition = new THREE.Vector3(
    box.position.x, 
    box.position.y + 0.7, 
    box.position.z
  );
  
  timeline.set(toy, { visible: true, scale: 0.6 });
  
  // Set initial position inside box
  timeline.set(toy.position, {
    x: box.position.x,
    y: box.position.y,
    z: box.position.z
  });
  
  // Peek out
  timeline.to(toy.position, {
    x: peekPosition.x,
    y: peekPosition.y,
    z: peekPosition.z,
    duration: 0.7,
    ease: 'back.out(1.7)'
  });
  
  // Wave or rotate - depending on toy type
  timeline.to(toy.rotation, {
    y: toy.rotation.y + Math.PI * 0.25,
    duration: 0.5,
    yoyo: true,
    repeat: 1,
    ease: 'sine.inOut'
  });
  
  // Go back in
  timeline.to(toy.position, {
    x: box.position.x,
    y: box.position.y,
    z: box.position.z,
    duration: 0.5,
    ease: 'back.in(1.7)'
  });
  
  timeline.set(toy, { visible: false });
  
  return timeline;
};

// Toy emotion animation (hearts/stars)
export const animateToyEmotion = (particles, toy, type = 'heart') => {
  const timeline = gsap.timeline();
  
  // Position particles at toy
  particles.position.copy(toy.position);
  particles.position.y += 0.5;
  
  // Make particles visible
  timeline.set(particles, { visible: true });
  
  // Spread particles outward
  const positions = particles.geometry.attributes.position.array;
  const initialPositions = [...positions];
  
  for (let i = 0; i < positions.length; i += 3) {
    const targetX = initialPositions[i] * 2;
    const targetY = initialPositions[i + 1] * 2 + 1;
    const targetZ = initialPositions[i + 2] * 2;
    
    timeline.to([positions[i], positions[i + 1], positions[i + 2]], {
      0: targetX,
      1: targetY,
      2: targetZ,
      duration: 1.5,
      ease: 'power2.out',
      onUpdate: () => {
        particles.geometry.attributes.position.needsUpdate = true;
      }
    }, 0);
  }
  
  // Fade out
  timeline.to(particles.material, {
    opacity: 0,
    duration: 1,
    ease: 'power2.in'
  }, 0.5);
  
  // Reset and hide
  timeline.set(particles, {
    visible: false,
    onComplete: () => {
      particles.material.opacity = 0.8;
      for (let i = 0; i < positions.length; i++) {
        positions[i] = initialPositions[i];
      }
      particles.geometry.attributes.position.needsUpdate = true;
    }
  });
  
  return timeline;
};

// Animation for box traveling between houses
export const animateBoxJourney = (box, path, toys, duration = 10, onHouseReached = () => {}) => {
  const timeline = gsap.timeline({ repeat: -1 });
  
  gsap.to({}, {
    duration,
    repeat: -1,
    onUpdate: function() {
      const progress = this.progress();
      const point = path.getPointAt(progress % 1);
      box.position.copy(point);
      
      // Determine correct rotation to face direction of travel
      if (progress < 1) {
        const lookAtPoint = path.getPointAt((progress + 0.01) % 1);
        box.lookAt(lookAtPoint);
      }
      
      // Trigger house events at specific points
      [0.2, 0.5, 0.8].forEach((housePoint, index) => {
        if (progress % 1 > housePoint - 0.01 && progress % 1 < housePoint + 0.01) {
          onHouseReached(index, box);
        }
      });
    }
  });
  
  return timeline;
};

// Add a parallax effect based on mouse movement or device orientation
export const setupParallaxEffect = (scene, intensity = 0.1) => {
  const initialPosition = {
    x: scene.position.x,
    y: scene.position.y
  };
  
  // Mouse movement parallax
  document.addEventListener('mousemove', (event) => {
    const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    const mouseY = (event.clientY / window.innerHeight) * 2 - 1;
    
    gsap.to(scene.position, {
      x: initialPosition.x + mouseX * intensity,
      y: initialPosition.y - mouseY * intensity, // Inverted for natural feel
      duration: 1,
      ease: 'power2.out'
    });
  });
  
  // Device orientation for mobile
  window.addEventListener('deviceorientation', (event) => {
    if (event.beta && event.gamma) {
      const tiltX = event.gamma / 45; // -1 to 1
      const tiltY = event.beta / 45;  // -1 to 1
      
      gsap.to(scene.position, {
        x: initialPosition.x + tiltX * intensity,
        y: initialPosition.y + tiltY * intensity,
        duration: 1,
        ease: 'power2.out'
      });
    }
  });
}; 