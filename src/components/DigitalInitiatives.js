import React from 'react';
import { Link } from 'react-router-dom';
import './DigitalInitiatives.css';
import infrastructureImage from '../Images/sliders/data_integration.jpeg';

const DigitalInitiatives = () => {
  return (
    <section className="initiatives-section">
      <div className="initiatives-container">
        <div className="initiatives-content">
          <div className="content-grid">
            
            {/* Text content */}
            <div className="text-content" data-aos="fade-right">
              <h2 className="initiatives-title">eHealth-Hub Digital Health Initiatives</h2>
              <div className="accent-bar"></div>
              
              <div className="initiative-summary">
                <p>
                The eHealth-Hub for cancer is developing software and frameworks to harmonize, 
                unify and connect clinical data to support all-island cancer research.
                By integrating various data streams 
                such as genomics, liquid biopsies, digital pathology, and environmental factors, 
                we aim to enhance cancer research across the island.
                </p>
        
              </div>

              <div className="key-areas">
                <div className="key-area" data-aos="fade-up" data-aos-delay="100">
                  <h3>Data Science & Technology</h3>
                  <p>Utilizing tools like Bioconductor, OHDSI, and R, combined with advanced technologies 
                    such as federated learning and AI/ML.</p>
                </div>
                <div className="key-area" data-aos="fade-up" data-aos-delay="200">
                  <h3>Data Integration</h3>
                  <p>Bringing together family history, environmental factors, sequencing data, and more 
                    to support cancer research.</p>
                </div>
              </div>

              <Link to="/projects" className="explore-btn">
                Explore Our Projects
                <svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M5 12h14m-6-6l6 6-6 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>

            {/* Visual content on the right */}
            <div className="visual-content" data-aos="fade-left">
              <div className="image-wrapper">
                <img src={infrastructureImage} alt="Digital Health Infrastructure Diagram" />
                <div className="image-overlay">
                  <div className="diagram-caption">
                    Comprehensive Digital Health Infrastructure
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

export default DigitalInitiatives;