import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Mail, ChevronRight, ExternalLink, Twitter, Github, Linkedin } from 'lucide-react';
import './Profile.css';

function Aedin() {
  const profileImage = require('../../Images/People/aedinculhane.png');
  
  const researchInterests = [
    'Cancer Computational Genomics',
    'Digital Health',
    'Single Cell Genomics',
    'Spatial Biology',
    'Cancer Genomics',
    'Algorithm Development',
    'Immune-Oncology',
    'Genomics Programs',
    'Real World Evidence',
    'Open Science'
  ];

  const bioParagraphs = [
    `Aedín Culhane is a Professor of Biomedical Sciences (Cancer Genomics) in the UL School of Medicine. She is a computational oncologist with expertise in multi-omics data integration, statistical genomics, clinical bioinformatics and genomics in oncology. She has over 20 years' experience in cancer genomics, of which over 15 years were in the Dana-Farber Cancer Institute and Harvard TH Chan School of Public Health in Boston, USA.`,
    
    `Her recent research focuses on algorithm development and integrative data of single cell molecular data in cancer to identify molecules that regulate and can be targeted during tumour development, progression, drug response and resistance. She is a member of the Human Cell Atlas project.`,
    
    `She is a leader in the Bioconductor community, a global open source, open development software in R for genomics and an advocate for open source science.`
  ];

  const affiliations = [
    'Director of the Limerick Digital Cancer Center',
    'Lead the all-island eHealth-Hub for Cancer',
    'Member, All-Ireland Cancer Institute Steering Group'
  ];

  return (
    <div className="profile-container">
      {/* Breadcrumb Navigation */}
      <nav className="breadcrumb">
        <Link to="/">People</Link>
        <ChevronRight size={16} />
        <Link to="/people">Directory</Link>
        <ChevronRight size={16} />
        <span>Prof Aedin Culhane</span>
      </nav>

      {/* Hero Section */}
      <div className="profile-hero">
        <div className="hero-content">
          <div className="hero-left">
            <div className="hero-image-wrapper">
              <img src={profileImage} alt="Prof Aedin Culhane" className="hero-image" />
            </div>
          </div>
          
          <div className="hero-right">
            <div className="hero-header">
              <h1>Prof Aedin Culhane</h1>
              <div className="role-badges">
                <span className="role-badge supervisor">
                  Project Leader
                </span>
                <span className="role-badge location">
                  Limerick
                </span>
                <span className="role-badge institution">
                  LDCRC
                </span>
              </div>
            </div>

            <div className="hero-details">
              <div className="institution-info">
                <h2>Institution</h2>
                <p>Professor, University of Limerick</p>
              </div>

              <div className="contact-actions">
                <a 
                  href="https://www.ul.ie/research/prof-aedin-culhane"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="action-button homepage"
                >
                  <Home size={20} />
                  <span>Homepage</span>
                  <ExternalLink size={16} />
                </a>
                <a 
                  href="mailto:aedin.culhane@ul.ie"
                  className="action-button email"
                >
                  <Mail size={20} />
                  <span>Email</span>
                </a>
              </div>

              <div className="social-links">
                <a href="https://twitter.com/AedinCulhane" target="_blank" rel="noopener noreferrer" className="social-button">
                  <Twitter size={20} />
                  <span>Twitter</span>
                </a>
                <a href="https://github.com/aedin" target="_blank" rel="noopener noreferrer" className="social-button">
                  <Github size={20} />
                  <span>GitHub</span>
                </a>
                <a href="https://www.linkedin.com/in/aedinculhane" target="_blank" rel="noopener noreferrer" className="social-button">
                  <Linkedin size={20} />
                  <span>LinkedIn</span>
                </a>
                <a href="https://scholar.google.com/citations?user=O8OszPcAAAAJ&hl=en" target="_blank" rel="noopener noreferrer" className="social-button scholar">
                  <span>Google Scholar</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="profile-sections">
        {/* About Section */}
        <section className="content-section about-section">
          <div className="section-header">
            <h2>About</h2>
            <div className="section-line"></div>
          </div>
          <div className="section-content">
            {bioParagraphs.map((paragraph, index) => (
              <p key={index} className="bio-paragraph">{paragraph}</p>
            ))}
            
            <div className="affiliations-list">
              <h3>Current Positions</h3>
              <ul>
                {affiliations.map((affiliation, index) => (
                  <li key={index}>{affiliation}</li>
                ))}
              </ul>
            </div>

            <div className="external-links">
              <h3>Associated Institutions</h3>
              <div className="institution-links">
                <a href="https://www.dana-farber.org/research/departments-centers/data-science" target="_blank" rel="noopener noreferrer">
                  Dana-Farber Cancer Institute
                </a>
                <a href="https://www.hsph.harvard.edu/biostatistics" target="_blank" rel="noopener noreferrer">
                  Harvard TH Chan School of Public Health
                </a>
                <a href="https://www.bioconductor.org" target="_blank" rel="noopener noreferrer">
                  Bioconductor Project
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Research Interests Section */}
        <section className="content-section interests-section">
          <div className="section-header">
            <h2>Research Interests</h2>
            <div className="section-line"></div>
          </div>
          <div className="interests-grid">
            {researchInterests.map((interest, index) => (
              <div 
                key={index} 
                className="interest-card"
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div className="interest-content">
                  <span className="interest-number">{(index + 1).toString().padStart(2, '0')}</span>
                  <span className="interest-text">{interest}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Footer Navigation */}
      <div className="profile-footer">
        <Link to="/people" className="back-to-directory">
          ← Back to Directory
        </Link>
      </div>
    </div>
  );
}

export default Aedin;