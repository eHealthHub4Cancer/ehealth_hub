import React from 'react';
import './HeroSection.css';
// import dataIntegrationImage from '../Images/sliders/data_integration.jpeg';
import ehealthLogo from '../Images/logo/eHealthHub_logo.png';

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
              <div className="diagram-wrapper">
                <div className="diagram-title">Cancer Digital Health</div>
                <div className="diagram-content">
                  <div className="data-integration-circle">
                    <div className="circle-items">
                      <div className="circle-item">Family History Genetics</div>
                      <div className="circle-item">EHR Medical Profile</div>
                      <div className="circle-item">Environment</div>
                      <div className="circle-item">Liquid Biopsies</div>
                      <div className="circle-item">Metabolites</div>
                      <div className="circle-item">Digital Pathology</div>
                      <div className="circle-item">Single Cell Sequencing</div>
                      <div className="circle-item">Proteomics</div>
                    </div>
                    <div className="circle-center">Data Integration & Modelling</div>
                  </div>
                  <div className="tech-boxes">
                    <div className="tech-box">
                      <h3>Data Science</h3>
                      <div className="tech-items">
                        <span>Bioconductor</span>
                        <span>OHDSI</span>
                        <span>AnVIL</span>
                        <span>R</span>
                        <span>Python</span>
                      </div>
                    </div>
                    <div className="tech-box">
                      <h3>Technology</h3>
                      <div className="tech-items">
                        <span>Federated Learning</span>
                        <span>Cloud Computing</span>
                        <span>AI/ML</span>
                        <span>Connected Devices</span>
                      </div>
                    </div>
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