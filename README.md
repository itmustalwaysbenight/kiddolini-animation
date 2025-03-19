# Kiddolini Three.js Animation

A playful, Pixar-inspired Three.js animation for the Kiddolini platform - a service that facilitates the passing of used toys between families in colorful toy boxes.

## Project Overview

This animation showcases "The Toy Journey" - a visual story of toys finding new homes through the Kiddolini box sharing system. The 3D scene features:

- An interactive Kiddolini box with opening/closing animations
- Five charming toy characters with unique personalities
- A stylized environment with houses connected by a path
- Emotional effects (hearts/stars) when toys find new homes
- Animated journeys of the box traveling between houses

## Features

- **Interactive Elements:**
  - Hover over the box to see a pulsing glow effect
  - Click on the box to open it and see toys hop out
  - Background journey animation of the box traveling between homes
  - Toys peek out occasionally from the box during idle state

- **Technical Implementation:**
  - Built with React, Three.js, @react-three/fiber and @react-three/drei
  - GSAP animations for smooth, playful motion
  - Optimized for performance on both desktop and mobile devices
  - Modular architecture with clean separation of concerns

## Running the Project

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```
4. Open your browser and navigate to http://localhost:5173 (or the port shown in your terminal)

## Build for Production

```
npm run build
```

The build files will be in the `dist` directory, ready for deployment.

## Project Structure

- `src/components/three/` - Three.js components
  - `models/` - 3D models for box, toys, and environment
  - `effects/` - Special effects (particles, trails)
- `src/utils/` - Utility functions
  - `animations.js` - GSAP animations
  - `three.js` - Three.js helper functions

## License

This project is licensed under the ISC license.

## Credits

Created for Kiddolini - Passing Joy Forward. 