import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Mail, ChevronRight, ExternalLink, Linkedin } from 'lucide-react';
import './Profile.css';

function Simon() {
  const profileImage = require('../../Images/People/simonmcdade.png');
  
  const researchInterests = [
    'Functional Genomics',
    'Cancer Transcription Factors',
    'Integrative Data Analysis',
    'CRISPR Technology',
    'Epigenetics',
    'Cancer Therapeutics',
    'Computational Biology',
    'Molecular Diagnostics',
    'Precision Medicine',
    'Bioinformatics'
  ];

  const bioParagraphs = [
    `Dr Simon McDade is a Reader at the Patrick G Johnston Centre for Cancer Research, Queens University Belfast, where he leads the Functional Genomics (FGG) laboratory. His research combines cutting-edge genomic technologies with innovative data analysis approaches to develop novel treatment strategies for cancer patients.`,

    `At the forefront of cancer genomics research, Dr McDade's laboratory specializes in utilizing a comprehensive range of genomic technologies including RNA-seq, ChIP-seq, and CRISPR screening. This work is complemented by the development of sophisticated integrative data analysis tools, bridging the gap between complex genomic data and clinical applications.`,

    `Dr McDade's research particularly focuses on understanding transcription factor dysfunction in cancer, with special emphasis on the p53 family. His team's work aims to identify genes and processes altered by mutation or de-regulation that could be exploited for diagnostic or therapeutic purposes. This research spans multiple cancer types, including colorectal, prostate, and squamous cancers.`,

    `Under Dr McDade's leadership, the laboratory has developed significant expertise in epigenetic research and computational tool development, including the creation of specialized data analysis and Shiny applications. His team welcomes diverse expertise, from biological sciences to computational analysis, fostering an interdisciplinary approach to cancer research.`
  ];

  const researchAreas = [
    {
      title: "Genomic Technologies",
      description: "Utilizing RNA-seq, ChIP-seq, and CRISPR screening to understand cancer mechanisms"
    },
    {
      title: "Cancer Biology",
      description: "Focus on transcription factor dysfunction in colorectal, prostate, and squamous cancers"
    },
    {
      title: "Computational Tools",
      description: "Development of data analysis tools and Shiny applications for cancer research"
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
        <span>Dr Simon McDade</span>
      </nav>

      {/* Hero Section */}
      <div className="profile-hero">
        <div className="hero-content">
          <div className="hero-left">
            <div className="hero-image-wrapper">
              <img src={profileImage} alt="Dr Simon McDade" className="hero-image" />
            </div>
          </div>
          
          <div className="hero-right">
            <div className="hero-header">
              <h1>Dr Simon McDade</h1>
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
                <p>Reader, Patrick G Johnston Centre for Cancer Research, Queens University, Belfast</p>
              </div>

              <div className="contact-actions">
                <a 
                  href="https://www.qub.ac.uk/schools/mdbs/Research/find-a-phd-supervisor/dr-simon-mcdade.html"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="action-button homepage"
                >
                  <Home size={20} />
                  <span>Homepage</span>
                  <ExternalLink size={16} />
                </a>
                <a 
                  href="mailto:askmhls@qub.ac.uk"
                  className="action-button email"
                >
                  <Mail size={20} />
                  <span>Email</span>
                </a>
              </div>

              <div className="social-links">
                <a href="https://www.linkedin.com/in/simonmcdade/" target="_blank" rel="noopener noreferrer" className="social-button">
                  <Linkedin size={20} />
                  <span>LinkedIn</span>
                </a>
                <a href="https://scholar.google.co.uk/citations?user=3TXRQVSOwGMC&hl=en" target="_blank" rel="noopener noreferrer" className="social-button scholar">
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
            
            <div className="lab-focus-section">
              <h3>Laboratory Focus</h3>
              <div className="lab-focus-grid">
                {researchAreas.map((area, index) => (
                  <div key={index} className="lab-focus-card">
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

export default Simon;