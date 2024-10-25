import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Mail, ChevronRight, ExternalLink } from 'lucide-react';
import './Profile.css';

function Shirin() {
  const profileImage = require('../../Images/People/ShirinMoghaddam.jpeg');
  
  const researchInterests = [
    'Survival Analysis',
    'Bayesian Statistics',
    'Statistical Modelling',
    'Machine Learning',
    'Clinical Decision Making',
    'Translational Statistics',
    'Cancer Research'
  ];

  const bioParagraphs = [
    `Dr Shirin Moghaddam is a Lecturer in Statistics & Data Science in the Department of Mathematics and Statistics in the University of Limerick. Shirin holds a BSc in Statistics and an MSc in Mathematical Statistics from the University of Tehran. She completed her PhD in Statistics at the University of Galway (NUIG) on developing Bayesian imputation approaches in survival analysis.`,
    
    `Following her PhD, she worked as a postdoctoral research fellow in the Conway Institute at University College Dublin on an interdisciplinary project on developing prediction models for prostate cancer progression. She was a lecturer at University College Cork before taking up her current position at the University of Limerick.`,
    
    `Her primary research interests are Survival analysis, Bayesian modelling and Machine learning approaches, in particular, their applications in cancer research. She collaborates nationally and internationally on modelling time-to-event data and developing prediction models in medical research. She is the chair of the Young Statisticians' Section of the Irish Statistical Association and also a member of Cancer Trials Ireland.`
  ];

  return (
    <div className="profile-container">
      {/* Breadcrumb Navigation */}
      <nav className="breadcrumb">
        <Link to="/">People</Link>
        <ChevronRight size={16} />
        <Link to="/people">Directory</Link>
        <ChevronRight size={16} />
        <span>Dr Shirin Moghaddam</span>
      </nav>

      {/* Hero Section */}
      <div className="profile-hero">
        <div className="hero-content">
          <div className="hero-left">
            <div className="hero-image-wrapper">
              <img src={profileImage} alt="Dr Shirin Moghaddam" className="hero-image" />
            </div>
          </div>
          
          <div className="hero-right">
            <div className="hero-header">
              <h1>Dr Shirin Moghaddam</h1>
              <div className="role-badges">
                <span className="role-badge supervisor">
                  Project Supervisor
                </span>
                <span className="role-badge location">
                  Limerick
                </span>
                <span className="role-badge institution">
                  UL
                </span>
              </div>
            </div>

            <div className="hero-details">
              <div className="institution-info">
                <h2>Institution</h2>
                <p>Mathematics and Statistics, Faculty Of Science & Engineering, University of Limerick</p>
              </div>

              <div className="contact-actions">
                <a 
                  href="https://www.ul.ie/research/dr-shirin-moghaddam" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="action-button homepage"
                >
                  <Home size={20} />
                  <span>Homepage</span>
                  <ExternalLink size={16} />
                </a>
                <a 
                  href="mailto:shirin.moghaddam@ul.ie"
                  className="action-button email"
                >
                  <Mail size={20} />
                  <span>Email</span>
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

        {/* Publications Section - Optional */}
        <section className="content-section publications-section">
          <div className="section-header">
            <h2>Recent Publications</h2>
            <div className="section-line"></div>
          </div>
          <div className="section-content">
            <div className="publications-list">
              
                <a 
                  href="https://scholar.google.com/citations?user=lr2xJDEAAAAJ&hl=en" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="view-all-publications"
                >
                  <span>View all publications</span>
                  <ExternalLink size={16} />
                  <ChevronRight size={16} />
                </a>
                
             
              
            </div>
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

export default Shirin;