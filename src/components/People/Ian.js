import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Mail, ChevronRight, ExternalLink, Twitter, Linkedin } from 'lucide-react';
import './Profile.css';

function Ian() {
  const profileImage = require('../../Images/People/ianOverton.png');
  
  const researchInterests = [
    'Cancer Metastasis',
    'Drug Resistance Mechanisms',
    'Machine Learning in Medicine',
    'Network Biology',
    'Molecular Systems Biology',
    'Computational Biology',
    'Cancer Personalized Medicine',
    'Patient Stratification',
    'Big Data Analytics',
    'Clinical Decision Support'
  ];

  const bioParagraphs = [
    `Prof Ian Overton is a Reader in the School of Medicine, Dentistry and Biomedical Sciences at Queen's University Belfast, where he leads research at the intersection of computational biology and cancer medicine. His work focuses on understanding the complex molecular mechanisms that drive cancer progression and treatment resistance.`,

    `Prof Overton's research employs sophisticated computational approaches to decode how cancer cells spread throughout the body (metastasis) and develop resistance to treatments - two critical factors that account for the majority of cancer-related deaths. His lab integrates vast amounts of molecular data, including DNA and protein information, to map and analyze the intricate networks that control cellular function.`,

    `Using advanced statistical inference and machine learning techniques, Prof Overton's team processes billions of data points to reveal the molecular logic underlying health and disease. This computational approach is fundamental to modern biology, enabling the interpretation of complex systems through large-scale data analysis.`,

    `A key focus of his work is developing software solutions that can meaningfully interpret large datasets and inform clinical decision-making, particularly in predicting patient responses to specific treatments. His research aims to identify molecular 'weak points' that could be targeted for personalized cancer treatments, ultimately working to translate these findings into practical medical applications through collaboration with clinical colleagues.`
  ];

  const researchAreas = [
    {
      title: "Molecular Control in Cancer",
      description: "Understanding cell phenotypic plasticity in metastasis and drug resistance to identify molecular 'Achilles' heels' for personalized medicine"
    },
    {
      title: "Patient Stratification",
      description: "Developing more effective approaches for cancer patient stratification and treatment pathway optimization"
    },
    {
      title: "Computational Methods",
      description: "Generation of novel algorithms and computational workflows for advanced cancer research and treatment"
    }
  ];

  return (
    <div className="profile-container">
      {/* Breadcrumb Navigation */}
      <nav className="breadcrumb">
        <Link to="/">People</Link>
        <ChevronRight size={16} />
        <Link to="/people">Directory</Link>
        <ChevronRight size={16} />
        <span>Prof Ian Overton</span>
      </nav>

      {/* Hero Section */}
      <div className="profile-hero">
        <div className="hero-content">
          <div className="hero-left">
            <div className="hero-image-wrapper">
              <img src={profileImage} alt="Prof Ian Overton" className="hero-image" />
            </div>
          </div>
          
          <div className="hero-right">
            <div className="hero-header">
              <h1>Prof Ian Overton</h1>
              <div className="role-badges">
                <span className="role-badge supervisor">
                  Project Supervisor
                </span>
                <span className="role-badge location">
                  Belfast
                </span>
                <span className="role-badge institution">
                  QUB
                </span>
              </div>
            </div>

            <div className="hero-details">
              <div className="institution-info">
                <h2>Institution</h2>
                <p>Reader, School of Medicine, Dentistry and Biomedical Sciences, Patrick G Johnston Centre for Cancer Research, Queens University, Belfast</p>
              </div>

              <div className="contact-actions">
                <a 
                  href="https://pure.qub.ac.uk/en/persons/ian-overton"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="action-button homepage"
                >
                  <Home size={20} />
                  <span>Homepage</span>
                  <ExternalLink size={16} />
                </a>
                <a 
                  href="mailto:I.Overton@qub.ac.uk"
                  className="action-button email"
                >
                  <Mail size={20} />
                  <span>Email</span>
                </a>
              </div>

              <div className="social-links">
                <a href="https://x.com/IOvertonScience" target="_blank" rel="noopener noreferrer" className="social-button">
                  <Twitter size={20} />
                  <span>Twitter</span>
                </a>
                <a href="https://scholar.google.com/citations?user=-jpF9EgAAAAJ&hl=en" target="_blank" rel="noopener noreferrer" className="social-button scholar">
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
            
            <div className="research-areas-section">
              <h3>Key Research Areas</h3>
              <div className="research-areas-grid">
                {researchAreas.map((area, index) => (
                  <div key={index} className="research-area-card">
                    <h4>{area.title}</h4>
                    <p>{area.description}</p>
                  </div>
                ))}
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

export default Ian;