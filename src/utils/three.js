import * as THREE from 'three';

// Utility function to create a random color with warm, inviting tones
export const getRandomToyColor = () => {
  const colors = [
    '#FF6B6B', // warm red
    '#FFE66D', // warm yellow
    '#4ECDC4', // teal
    '#7D70BA', // purple
    '#FF9F1C', // orange
    '#2EC4B6', // turquoise
    '#E71D36', // bright red
    '#FF9F1C', // amber
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Create a function to generate a simple glow effect
export const createGlowEffect = (color, intensity = 1, distance = 2) => {
  const light = new THREE.PointLight(color, intensity, distance);
  light.position.set(0, 0, 0);
  return light;
};

// Helper to create a path along which the box will travel
export const createPath = (points) => {
  const curve = new THREE.CatmullRomCurve3(points);
  return curve;
};

// Utility to create particles
export const createParticles = (count, color, size = 0.05) => {
  const particleGeometry = new THREE.BufferGeometry();
  const particlesMaterial = new THREE.PointsMaterial({
    color,
    size,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const particlesPositions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    particlesPositions[i * 3] = (Math.random() - 0.5) * 2;
    particlesPositions[i * 3 + 1] = (Math.random() - 0.5) * 2;
    particlesPositions[i * 3 + 2] = (Math.random() - 0.5) * 2;
  }

  particleGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(particlesPositions, 3)
  );

  return new THREE.Points(particleGeometry, particlesMaterial);
};

// Helper for responsive design
export const handleResize = (camera, renderer) => {
  window.addEventListener('resize', () => {
    // Update camera
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
};

// Detect device capability to set appropriate quality
export const getDevicePerformanceLevel = () => {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  
  if (isMobile) {
    return 'low';
  }
  
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      return 'low';
    }
    
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    
    // Check for keywords in renderer string to identify high-end GPUs
    if (/(nvidia|geforce|gtx|rtx|radeon|intel iris)/i.test(renderer)) {
      return 'high';
    }
    
    return 'medium';
  } catch (e) {
    return 'medium'; // Default to medium if detection fails
  }
}; 