import React from "react";
import HomeSlider from "./HomeSlider";
import CollaboratorsSection from './CollaboratorsSection';
import FundingSection from "./FundingSection";


import "./HomePage.css";

function HomePage() {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text-container">
            <h1 className="hero-title">The eHealth-Hub for Cancer</h1>
            <div className="hero-subtitle-container">
              <h2 className="hero-subtitle">Unified harmonized health data for network cancer research studies</h2>
              <div className="accent-line"></div>
            </div>
            <div className="hero-description">
              <p>
                The all-island eHealth Hub for Cancer is an all-island partnership on the island of Ireland that is building software and data platforms using best practice open science international health data standards to unlock and share health data, to grow clinical cancer research and improve cancer care.
              </p>
            </div>
          </div>
        </div>
        <HomeSlider />
        <CollaboratorsSection/>
        <FundingSection/>
        
      </section>
    </div>
  );
}

export default HomePage;