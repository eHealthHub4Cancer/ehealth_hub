import React, { useEffect, useState } from 'react';
import './Project.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Project = () => {
    const [activeCategory, setActiveCategory] = useState(null);
  
    useEffect(() => {
      AOS.init({
        duration: 1000,
        once: true
      });
    }, []);
  
    const scrollToSection = (id) => {
      const element = document.getElementById(id);
      element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
  
    // Project categories for DNA visualization
    const projectCategories = [
      { id: 'blood-cancer', name: 'Blood Cancer', color: '#FF6B6B' },
      { id: 'solid-tumour', name: 'Solid Tumour', color: '#4ECDC4' },
      { id: 'genomics', name: 'Genomics', color: '#45B7D1' },
      { id: 'registries', name: 'Registries', color: '#96CEB4' },
      { id: 'covid', name: 'COVID-19', color: '#FFEEAD' }
    ];
  
    // Generate DNA strands
    const dnaStrands = Array.from({ length: 10 }, (_, index) => (
      <div key={index} className="dna-strand">
        {projectCategories.map((category) => (
          <div
            key={category.id}
            className={`dna-node ${activeCategory === category.id ? 'active' : ''}`}
            style={{ '--category-color': category.color }}
            onClick={() => {
              setActiveCategory(category.id);
              scrollToSection(category.id);
            }}
          />
        ))}
      </div>
    ));
  
    return (
      <div className="projects-page">
        <div className="visualization-sidebar" data-aos="fade-right">
          <div className="dna-visualization">
            <div className="dna-container">{dnaStrands}</div>
            <div className="category-legend">
              {projectCategories.map((category) => (
                <div 
                  key={category.id}
                  className="legend-item"
                  onClick={() => scrollToSection(category.id)}
                >
                  <span 
                    className="legend-color" 
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="legend-text">{category.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
  
        <div className="projects-container">
          <main className="projects-content">
            <section className="projects-intro" data-aos="fade-up">
              <div className="intro-card">
                <h1>Projects</h1>
                <div className="gradient-bar"></div>
                <p className="intro-text">
                  The eHealth-Hub for cancer is developing software and frameworks to harmonize, unify and connect clinical 
                  data to support all-island cancer research.
                </p>
                <div className="project-stats">
                  <div className="stat-item">
                    <span className="stat-number">5+</span>
                    <span className="stat-label">Major Research Areas</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">2</span>
                    <span className="stat-label">Countries Collaborating</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">∞</span>
                    <span className="stat-label">Potential Impact</span>
                  </div>
                </div>
              </div>
            </section>
  
            <section id="blood-cancer" className="project-section" data-aos="fade-up">
              <div className="project-card" style={{ '--card-accent': '#FF6B6B' }}>
                <div className="card-header">
                  <h2>Blood Cancer Research</h2>
                  <div className="card-accent"></div>
                </div>
                <div className="card-content">
                  <p>
                    Will enable network observational health studies in Haematological Malignancies. In partnership with colleagues in{' '}
                    <a href="https://www.bloodcancers.ie/" target="_blank" rel="noopener noreferrer" className="highlight-link">
                      Blood Cancer Network Ireland
                    </a>
                    , we will build data dictionaries, maps and tools to harmonize and network:
                  </p>
                  
                  <div className="feature-grid">
                    <div className="feature-item" data-aos="fade-up" data-aos-delay="100">
                      <div className="feature-icon">🔬</div>
                      <div className="feature-content">
                        <h3>AML</h3>
                        <p>Adult acute myeloid leukemia</p>
                      </div>
                    </div>
                    <div className="feature-item" data-aos="fade-up" data-aos-delay="200">
                      <div className="feature-icon">🔬</div>
                      <div className="feature-content">
                        <h3>CLL</h3>
                        <p>Chronic lymphocytic leukemia</p>
                      </div>
                    </div>
                    <div className="feature-item" data-aos="fade-up" data-aos-delay="300">
                      <div className="feature-icon">🔬</div>
                      <div className="feature-content">
                        <h3>MM</h3>
                        <p>Multiple myeloma</p>
                      </div>
                    </div>
                  </div>
  
                  <div className="partners-section">
                    <h3>Global Studies & Partners</h3>
                    <div className="partner-links">
                      <a href="https://www.darwin-eu.org/" target="_blank" rel="noopener noreferrer">Darwin EU</a>
                      <a href="https://www.harmony-alliance.eu/" target="_blank" rel="noopener noreferrer">Harmony Alliance</a>
                      <a href="https://portal.honeur.org/" target="_blank" rel="noopener noreferrer">HONEUR</a>
                    </div>
                  </div>
                </div>
              </div>
            </section>

          <section id="solid-tumour" className="project-section" data-aos="fade-up">
            <div className="project-card">
              <h2>All-island characterization of Solid Tumour patient data</h2>
              <div className="tumour-types">
                <div className="tumour-type-item">
                  <h3>Prostate Cancer</h3>
                  <p>With the <a href="https://www.ipcor.ie/" target="_blank" rel="noopener noreferrer">IPCOR</a></p>
                </div>
                <div className="tumour-type-item">
                  <h3>Upper gastrointestinal (UGI) cancer</h3>
                </div>
                <div className="tumour-type-item">
                  <h3>Breast Cancer</h3>
                  <p>Study of brain metastasis</p>
                </div>
              </div>

              <div className="info-box">
                <h3>Solid Tumour Cancer Studies</h3>
                <p>Using the OMOP common data model:</p>
                <div className="study-links">
                  <a href="https://www.optima-oncology.eu/" target="_blank" rel="noopener noreferrer">OPTIMA</a>
                  <a href="https://www.darwin-eu.org/" target="_blank" rel="noopener noreferrer">Darwin EU</a>
                </div>
              </div>
            </div>
          </section>

          <section id="genomics" className="project-section" data-aos="fade-up">
            <div className="project-card">
              <h2>Harmonizing cancer clinical genomics data</h2>
              <p>
                Will test standards, build methods and software that support harmonization of all-island 
                cancer genomics data.
              </p>
            </div>
          </section>

          <section id="registries" className="project-section" data-aos="fade-up">
            <div className="project-card">
              <h2>Cross-border Cancer Registries</h2>
              <p className="highlight-text">
                Cancer knows no border and neither do cancer registries
              </p>
            </div>
          </section>

          <section id="covid" className="project-section" data-aos="fade-up">
            <div className="project-card">
              <h2>COVID-19 and cancer</h2>
              <p>
                Will study the impact of the COVID-19 pandemic on cancer across the island of Ireland
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Project;