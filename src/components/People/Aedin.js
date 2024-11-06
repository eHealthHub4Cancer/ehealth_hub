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
    `Aedín Culhane is a Professor of Biomedical Sciences (Cancer Genomics) at UL School of Medicine. With expertise in multi-omics data integration, statistical genomics, and clinical bioinformatics, she has over 20 years of experience in cancer genomics, including 15 years at Dana-Farber Cancer Institute and Harvard TH Chan School of Public Health.`,
    `Her research focuses on algorithm development and integrative analysis of single-cell molecular data in cancer to identify key molecules in tumor progression, drug response, and resistance. She is also a member of the Human Cell Atlas project.`,
    `Aedín is a leader in the Bioconductor community, a global open-source initiative for genomics in R, and an advocate for open-source science.`
  ];

  const affiliations = [
    'Director, Limerick Digital Cancer Center',
    'Lead, all-island eHealth-Hub for Cancer',
    'Member, All-Ireland Cancer Institute Steering Group'
  ];

  // Social links constant
  const socialLinks = [
    {
      name: 'Twitter',
      url: 'https://twitter.com/AedinCulhane',
      icon: <Twitter size={20} />
    },
    {
      name: 'GitHub',
      url: 'https://github.com/aedin',
      icon: <Github size={20} />
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/aedinculhane',
      icon: <Linkedin size={20} />
    },
    {
      name: 'Google Scholar',
      url: 'https://scholar.google.com/citations?user=O8OszPcAAAAJ&hl=en',
      icon: null // Google Scholar has no specific icon from 'lucide-react'
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
        <span>Prof Aedin Culhane</span>
      </nav>

      {/* Hero Section */}
      <div className="profile-hero">
        <div className="hero-content">
          <div className="hero-image-wrapper hero-left">
            <img src={profileImage} alt="Prof Aedin Culhane" className="hero-image" />
          </div>

          <div className="hero-right">
            <h1>Prof Aedin Culhane</h1>
            <div className="role-badges">
              <span className="role-badge supervisor">Project Leader</span>
              <span className="role-badge location">Limerick</span>
              <span className="role-badge institution">LDCRC</span>
            </div>

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
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`social-button ${link.name.toLowerCase()}`}
                >
                  {link.icon && link.icon}
                  <span>{link.name}</span>
                </a>
              ))}
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
