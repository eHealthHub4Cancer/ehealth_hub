import React from 'react';
import './HeroSection.css';
import ehealthLogo from '../Images/logo/eHealthHub_logo.png';
import eHealthHubDiagram from '../Images/logo/eHealth.png';

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <div className="hero-grid">
          <div className="hero-text-container" data-aos="fade-right">
            <div className="hero-logo-container">
              <img src={ehealthLogo} alt="eHealth Hub Logo" className="hero-logo" />
            </div>
            <h1 className="hero-title">The eHealth-Hub for Cancer</h1>
            <div className="hero-subtitle-container">
              <h2 className="hero-subtitle">Unified harmonized health data for network cancer research studies</h2>
              <div className="accent-line"></div>
            </div>
            <div className="hero-description">
              <p>
                The all-island eHealth Hub for Cancer is an all-island partnership on the island of Ireland
                that is building software and data platforms using best practice open science international
                health data standards to unlock and share health data, to grow clinical cancer research
                and improve cancer care.
              </p>
            </div>
          </div>

          <div className="hero-visual-container" data-aos="fade-left">
            <div className="diagram-container">
              <div className="diagram-overlay">
                <div className="diagram-wrapper">
                  <div className="diagram-title">Enhancing Health Research through CDM and Federated Analytics</div>
                  <div className="diagram-content">
                    <img src={eHealthHubDiagram} alt="eHealth Hub Diagram" className="hero-diagram enhanced-diagram" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;