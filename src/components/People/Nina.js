import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Mail, ChevronRight, ExternalLink, Linkedin } from 'lucide-react';
import './Profile.css';

function Nina() {
  const profileImage = require('../../Images/People/NinaOrfali.png');
  
  const researchInterests = [
    'Myeloid Malignancies',
    'Stem Cell Transplantation',
    'Cellular Therapy',
    'Translational Medicine',
    'Autophagy Research',
    'Immune System Enhancement',
    'Gene Mutation Analysis',
    'Differentiation Therapy',
    'Post-transplant Care',
    'Clinical Research'
  ];

  const bioParagraphs = [
    `Dr Nina Orfali is a Consultant Haematologist at St. James's Hospital Dublin, where she joined the team in 2020. As a member of the Adult Bone Marrow Transplant team, she brings extensive international experience and specialized expertise in stem cell transplantation and myeloid malignancies.`,

    `A medical graduate of NUI Galway, Dr Orfali's career path reflects a commitment to both clinical excellence and research innovation. Her early training included internal medicine experience at both Galway University Hospital and the prestigious Mayo Clinic in Minnesota. She further developed her expertise through laboratory research at the Cork Cancer Research Centre and Weill Cornell University in New York, earning her PhD from UCC for groundbreaking work on autophagy in leukaemic cell differentiation.`,

    `After completing her haematology specialist training in Ireland, Dr Orfali pursued advanced specialization in stem cell transplantation through a two-year fellowship at Cornell University in New York. This international experience has helped shape her current research focus, which includes developing strategies to reduce relapse and strengthen immune system function post-donor stem cell transplantation.`,

    `Currently, Dr Orfali's research concentrates on the significance and prognostic impact of gene mutations in myeloid disease, maintaining active collaborations with researchers at Cornell University. She is particularly focused on myeloid malignancies, including acute myeloid leukaemia, myelodysplastic syndromes, and myeloproliferative disorders.`
  ];

  const qualifications = [
    'MB BCh BAO - NUI Galway',
    'MRCPI - Royal College of Physicians of Ireland',
    'FRCPath - Royal College of Pathology, UK',
    'PhD - University College Cork'
  ];

  const professionalMemberships = [
    'Royal College of Physicians of Ireland',
    'Royal College of Pathology, UK',
    'Haematology Association of Ireland (HAI)',
    'American Society of Haematology (ASH)',
    'American Society of Transplantation and Cellular Therapy (ASTCT)'
  ];

  return (
    <div className="profile-container">
      {/* Breadcrumb Navigation */}
      <nav className="breadcrumb">
        <Link to="/">People</Link>
        <ChevronRight size={16} />
        <Link to="/people">Directory</Link>
        <ChevronRight size={16} />
        <span>Prof Nina Orfali</span>
      </nav>

      {/* Hero Section */}
      <div className="profile-hero">
        <div className="hero-content">
          <div className="hero-left">
            <div className="hero-image-wrapper">
              <img src={profileImage} alt="Prof Nina Orfali" className="hero-image" />
            </div>
          </div>
          
          <div className="hero-right">
            <div className="hero-header">
              <h1>Prof Nina Orfali</h1>
              <div className="role-badges">
                <span className="role-badge supervisor">
                  Project Supervisor
                </span>
                <span className="role-badge location">
                  Dublin
                </span>
                <span className="role-badge institution">
                  St James
                </span>
              </div>
            </div>

            <div className="hero-details">
              <div className="institution-info">
                <h2>Institution</h2>
                <p>Consultant Haematologist, St. James's Hospital Dublin</p>
              </div>

              <div className="contact-actions">
                <a 
                  href="https://www.stjames.ie/services/hope/nationalstemcelltransplantunit/"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="action-button homepage"
                >
                  <Home size={20} />
                  <span>Homepage</span>
                  <ExternalLink size={16} />
                </a>
                <a 
                  href="mailto:conneallysec@stjames.ie"
                  className="action-button email"
                >
                  <Mail size={20} />
                  <span>Email</span>
                </a>
              </div>

              <div className="social-links">
                <a href="https://www.linkedin.com/in/nina-orfali-mb-mrcpi-frcpath-phd-9a782668/" target="_blank" rel="noopener noreferrer" className="social-button">
                  <Linkedin size={20} />
                  <span>LinkedIn</span>
                </a>
                <a href="https://www.researchgate.net/profile/Nina-Orfali" target="_blank" rel="noopener noreferrer" className="social-button scholar">
                  <span>ResearchGate</span>
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
            
            <div className="credentials-section">
              <div className="qualifications">
                <h3>Qualifications</h3>
                <ul className="credentials-list">
                  {qualifications.map((qual, index) => (
                    <li key={index} className="credential-item">{qual}</li>
                  ))}
                </ul>
              </div>
              
              <div className="memberships">
                <h3>Professional Memberships</h3>
                <ul className="credentials-list">
                  {professionalMemberships.map((membership, index) => (
                    <li key={index} className="credential-item">{membership}</li>
                  ))}
                </ul>
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

export default Nina;