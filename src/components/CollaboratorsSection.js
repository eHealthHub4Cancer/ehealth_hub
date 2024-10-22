import React, { useEffect } from 'react';
import './CollaboratorsSection.css';
import AOS from 'aos'; 
import 'aos/dist/aos.css';
import image4 from '../Images/sliders/overview.jpeg'; 

function CollaboratorsSection() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true
    });
  }, []);

  const collaborators = [
    { name: 'University of Limerick (UL)', role: 'Lead Institution' },
    { name: 'Queen\'s University Belfast (QUB)', role: 'Research Partner' },
    { name: 'National Cancer Registry Ireland (NCRI)', role: 'Data Registry' },
    { name: 'RCSI, UCD, NUIG, and UCC', role: 'Academic Partners' }
  ];

  return (
    <section className="collaborators-section">
      <div className="collaborators-container">
        <div className="collaborators-content" data-aos="fade-right">
          <div className="header-group">
            <h2 className="section-heading">Our Collaborators</h2>
            <div className="accent-bar"></div>
            <p className="section-subheading">
              Leading institutions driving cancer eHealth research forward.
            </p>
          </div>

          <div className="main-text" data-aos="fade-up" data-aos-delay="200">
            <p>
              The <span className="highlight">eHealthHub for Cancer</span> is proud to be a collaborative 
              effort led by key institutions across the island of Ireland, working together to advance 
              cancer research and improve patient outcomes.
            </p>
          </div>

          <div className="collaborators-grid" data-aos="fade-up" data-aos-delay="400">
            {collaborators.map((collaborator, index) => (
              <div className="collaborator-card" key={index}>
                <h3>{collaborator.name}</h3>
                <span className="role-tag">{collaborator.role}</span>
              </div>
            ))}
          </div>

          <div className="quote-container" data-aos="fade-up" data-aos-delay="600">
            <blockquote>
              "By connecting cancer data from across the island of Ireland, we are creating a future 
              where real-time data access drives evidence-based healthcare decisions and improves 
              cancer care for all."
            </blockquote>
          </div>
        </div>

        <div className="collaborators-visual" data-aos="fade-left">
          <div className="image-container">
            <img 
              src={image4} 
              alt="Overview of Collaborators"
              loading="lazy"
              style={{ maxHeight: '600px', width: '100%', objectFit: 'cover' }}
            />
            <div className="stats-overlay">
              <div className="stat-item">
                <span className="stat-number">4M</span>
                <span className="stat-label">Euro Funding</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">10</span>
                <span className="stat-label">PhD Students</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">7</span>
                <span className="stat-label">Research Assistants</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CollaboratorsSection;