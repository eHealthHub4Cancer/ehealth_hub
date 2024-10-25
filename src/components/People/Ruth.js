import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Mail, ChevronRight, ExternalLink, Twitter } from 'lucide-react';
import './Profile.css';

function Ruth() {
  const profileImage = require('../../Images/People/RuthClifford.jpg');
  
  const researchInterests = [
    'Malignant Haematology',
    'Lymphoid Malignancies',
    'Chronic Lymphocytic Leukaemia',
    'Cancer Genetics',
    'Drug Resistance Studies',
    'Next Generation Sequencing',
    'Diagnostic Innovation',
    'AI in Cancer Diagnostics',
    'Clinical Trials',
    'Translational Research'
  ];

  const bioParagraphs = [
    `Prof. Ruth Clifford is a Consultant Haematologist at UHL since November 2016. Her clinical practice is in malignant haematology, in particular, the care of patients with lymphoid malignancies including chronic lymphocytic leukaemia (CLL). Key areas of research include: the study of genetic changes driving the development of blood cancers and factors leading to relapse and resistant disease. In addition, Ruth has an interest in innovating diagnostic pathways for patients, applying novel tech and AI tools, to aid accurate and timely diagnosis of blood cancers and to improve patient acquisition to clinical trials.`,
    
    `Ruth received her medical degree from NUI Galway in 2002 and began her specialist haematology training in Ireland in 2006 later transferring to Oxford. She was awarded a Cancer Research UK Fellowship to undertake a PhD at the University of Oxford. Her doctoral research focused on the applications of Next Generation Sequencing Technologies in Leukaemia. A key finding of this work was the discovery of a novel gene mutation in SAMHD1 that predicts chemotherapy resistance in CLL. She has published with numerous UK and European CLL groups and continues to maintain active links in the haematology genomics research field.`,
    
    `Ruth is the translational co-chair of the Haematology and Lymphoma DSSG of Cancer Trials Ireland clinical trial network. She is an Investigator with the Blood Cancer Network Ireland and a member of the molecular advisory group for the National Cancer Control Programme that guides the development of a national infrastructure for partner diagnostics in Haemato-Oncology.`,
    
    `Within UL, Ruth is a pillar lead for the Basic Sciences Pillar of ULCan and a member of the Limerick DCRC Development Committee. Ruth has a number of active collaborative research projects across the ULCan pillars and is keen to progress links between ULHG and UL on cutting edge cancer research for the benefit of the Mid West and the broader cancer community.`
  ];

  const positions = [
    'Consultant Haematologist, University Hospital Limerick',
    'Translational Co-Chair, Haematology and Lymphoma DSSG, Cancer Trials Ireland',
    'Investigator, Blood Cancer Network Ireland',
    'Member, Molecular Advisory Group, National Cancer Control Programme',
    'Pillar Lead, Basic Sciences Pillar of ULCan',
    'Member, Limerick DCRC Development Committee'
  ];

  return (
    <div className="profile-container">
      {/* Breadcrumb Navigation */}
      <nav className="breadcrumb">
        <Link to="/">People</Link>
        <ChevronRight size={16} />
        <Link to="/people">Directory</Link>
        <ChevronRight size={16} />
        <span>Prof Ruth Clifford</span>
      </nav>

      {/* Hero Section */}
      <div className="profile-hero">
        <div className="hero-content">
          <div className="hero-left">
            <div className="hero-image-wrapper">
              <img src={profileImage} alt="Prof Ruth Clifford" className="hero-image" />
            </div>
          </div>
          
          <div className="hero-right">
            <div className="hero-header">
              <h1>Prof Ruth Clifford</h1>
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
                <p>Consultant Haematologist, University Hospital Limerick</p>
              </div>

              <div className="contact-actions">
                <a 
                  href="https://www.ul.ie/limerick-dcrc/professor-ruth-clifford"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="action-button homepage"
                >
                  <Home size={20} />
                  <span>Homepage</span>
                  <ExternalLink size={16} />
                </a>
                <a 
                  href="mailto:ruth.clifford1@hse.ie"
                  className="action-button email"
                >
                  <Mail size={20} />
                  <span>Email</span>
                </a>
              </div>

              <div className="social-links">
                <a href="https://x.com/RuthClifford5" target="_blank" rel="noopener noreferrer" className="social-button">
                  <Twitter size={20} />
                  <span>Twitter</span>
                </a>
                <a href="https://scholar.google.de/citations?user=huGfo9EAAAAJ&hl=de" target="_blank" rel="noopener noreferrer" className="social-button scholar">
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
            
            <div className="positions-section">
              <h3>Current Positions</h3>
              <ul className="positions-list">
                {positions.map((position, index) => (
                  <li key={index} className="position-item">
                    {position}
                  </li>
                ))}
              </ul>
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

export default Ruth;