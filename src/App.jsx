import React, { Suspense } from 'react';
import MinimalScene from './components/three/MinimalScene';
import ErrorBoundary from './components/ErrorBoundary';

const App = () => {
  return (
    <>
      <header className="site-header">
        <h1>Kiddolini</h1>
        <nav>
          <ul>
            <li><a href="#how-it-works">How It Works</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </header>
      
      <main>
        <section className="hero">
          <div className="hero-content">
            <h2>Pass Joy Forward</h2>
            <p>Giving toys a second home and bringing smiles to new faces.</p>
            <button className="cta-button">Get Started</button>
          </div>
          
          <div className="scene-container">
            <ErrorBoundary>
              <MinimalScene />
            </ErrorBoundary>
          </div>
        </section>
        
        <section id="how-it-works" className="content-section">
          <h2>How It Works</h2>
          {/* Content will go here */}
        </section>
      </main>
      
      <footer>
        <p>&copy; {new Date().getFullYear()} Kiddolini. All rights reserved.</p>
      </footer>
    </>
  );
};

export default App; 