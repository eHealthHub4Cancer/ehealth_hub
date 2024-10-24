import React from 'react';
import { useNavigate } from 'react-router-dom';
import './FundingSection.css';
import fundingImage from '../Images/sliders/Slide1.jpeg';

const FundingSection = () => {
  const navigate = useNavigate();

  const handleLearnMore = () => {
    navigate('/about');
  };

  return (
    <section className="funding-section">
      <div className="funding-container">
        <div className="funding-image-container" data-aos="fade-right">
          <div className="image-wrapper">
            <img 
              src={fundingImage} 
              alt="eHealth-Hub Funding" 
              className="funding-image"
            />
            <div className="image-overlay">
              <div className="overlay-content">
                <div className="stat">
                  <span className="stat-value">HEA</span>
                  <span className="stat-label">Funded</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat">
                  <span className="stat-value">2023-26</span>
                  <span className="stat-label">Duration</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="funding-content" data-aos="fade-left">
          <div className="funding-text-container">
            <h2 className="funding-title">Funding Sources</h2>
            <div className="accent-line"></div>
            <p className="funding-description">
              The <span className="highlight">eHealth-Hub for Cancer</span> is an emerging hub of 
              excellence funded under the Higher Education Authority Shared Island North-South Program. 
              This research initiative is driven by significant contributions to enhance cross-border 
              collaboration and improve cancer research across the island of Ireland.
            </p>
            <button 
              className="learn-more-btn" 
              onClick={handleLearnMore}
              data-aos="fade-up"
              data-aos-delay="200"
            >
              Learn More
              <svg 
                className="arrow-icon" 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FundingSection;