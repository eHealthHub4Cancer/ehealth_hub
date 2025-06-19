import React, { useEffect } from 'react';
import './CollaboratorsSection.css';
import AOS from 'aos'; 
import 'aos/dist/aos.css';
import image4 from '../Images/sliders/overview.jpeg'; 

function CollaboratorsSection() {
  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true,
      easing: 'ease-in-out'
    });
  }, []);

  const collaborators = [
    { name: 'University of Limerick (UL)', role: 'Lead Institution', link: 'https://www.ul.ie/' },
    { name: "Queen's University Belfast (QUB)", role: 'Research Partner', link: 'https://www.qub.ac.uk/' },
    { name: 'National Cancer Registry Ireland (NCRI)', role: 'Data Registry', link: 'https://www.ncri.ie/' },
    { name: 'Royal College of Surgeons in Ireland (RCSI), University College Dublin (UCD), University of Galway (UG), University College Cork (UCC), and Trinity College Dublin (TCD)', role: 'Academic Partners', link: 'https://www.rcsi.com/' }
  ];

  return (
    <section className="collaborators-section">
      <div className="collaborators-container">
        <div className="collaborators-content" data-aos="fade-right">
          <div className="header-group">
            <h2 className="section-heading">Our Collaborators</h2>
            <div className="accent-bar"></div>
            <p className="section-subheading">
              Leading institutions driving innovation in cancer eHealth research.
            </p>
          </div>

          <div className="main-text" data-aos="fade-up" data-aos-delay="200">
            <p>
              The <span className="highlight">eHealthHub for Cancer</span> brings together key institutions across Ireland in an effort 
              to advance cancer research and improve patient care outcomes. This partnership enables us to leverage 
              cutting-edge technology, data sharing, and collaborative research.
            </p>
          </div>

          <div className="collaborators-grid" data-aos="fade-up" data-aos-delay="400">
            {collaborators.map((collaborator, index) => (
              <div className="collaborator-card" key={index}>
                <div className="collaborator-content">
                  <h3><a href={collaborator.link} target="_blank" rel="noopener noreferrer">{collaborator.name}</a></h3>
                  <span className="role-tag"><a href={collaborator.link} target="_blank" rel="noopener noreferrer">{collaborator.role}</a></span>
                </div>
              </div>
            ))}
          </div>

          <div className="quote-container" data-aos="fade-up" data-aos-delay="600">
            <blockquote className="styled-quote">
              <p>
                "By connecting cancer data from across the island of Ireland, we are creating a future 
                where real-time data access drives evidence-based healthcare decisions and improves 
                cancer care for all."
              </p>
              <div className="quote-author">- eHealthHub for Cancer</div>
            </blockquote>
          </div>
        </div>

        <div className="collaborators-visual" data-aos="fade-left">
          <div className="image-container">
            <img 
              src={image4} 
              alt="Overview of Collaborators"
              loading="lazy"
              className="overview-image"
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
