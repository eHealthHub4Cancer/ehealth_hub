import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Mail, ChevronRight, ExternalLink, Linkedin } from 'lucide-react';
import './Profile.css';

function Bill() {
  const profileImage = require('../../Images/People/BillWatson.jpeg');
  
  const researchInterests = [
    'Prostate Cancer Biology',
    'Biomarker Discovery',
    'Treatment Resistance',
    'Molecular Pathways',
    'Translational Research',
    'Cancer Therapeutics',
    'Clinical Biomarkers',
    'Cancer Progression',
    'Therapy Resistance',
    'Precision Medicine'
  ];

  const bioParagraphs = [
    `Professor Bill Watson is a distinguished Professor of Cancer Biology in the UCD School of Medicine, where he serves as Head of Pathology and Director of the Biomedical Health and Life Science honours BSc programme. His expertise spans fundamental cancer biology and translational research, with a particular focus on prostate cancer.`,

    `Professor Watson's academic journey began with his PhD in Biochemistry from University College Cork in 1995, followed by post-doctoral research at the University of Toronto and Toronto General Hospital in Canada. In 1997, he joined University College Dublin as a college Lecturer in the Department of Surgery at the Mater Misericordiae University Hospital, where he has since built an internationally recognized research program.`,

    `As the lead Principal Investigator of the Prostate Cancer Research Consortium (PCRC), Professor Watson directs a multidisciplinary team of scientists and clinicians addressing crucial clinical challenges in prostate cancer. His research utilizes cutting-edge technologies at the Conway Institute to study cellular and molecular pathways, working closely with clinical collaborators to advance our understanding of prostate cancer initiation and progression.`,

    `His research has attracted significant funding from prestigious bodies including Science Foundation Ireland, the Health Research Board, Enterprise Ireland, Irish Cancer Society, Prostate Cancer Foundation, and Movember. With an H-index of 55, his work has been published in leading peer-reviewed journals such as European Urology, Cancers, BJU International, Oncotarget, and Molecular Oncology.`
  ];

  const researchFocus = [
    {
      title: "Biomarker Discovery and Validation",
      description: "Leveraging PCRC resources to identify and validate biomarkers for prostate cancer grade and stage, informing treatment strategies"
    },
    {
      title: "Therapy Resistance Mechanisms",
      description: "Investigating resistance to androgen ablation therapy and chemotherapy through genomic and bioinformatic approaches"
    },
    {
      title: "Translational Research",
      description: "Bridging laboratory discoveries with clinical applications through international collaborations and the Movember Global Action Plan"
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
        <span>Prof Bill Watson</span>
      </nav>

      {/* Hero Section */}
      <div className="profile-hero">
        <div className="hero-content">
          <div className="hero-left">
            <div className="hero-image-wrapper">
              <img src={profileImage} alt="Prof Bill Watson" className="hero-image" />
            </div>
          </div>
          
          <div className="hero-right">
            <div className="hero-header">
              <h1>Prof Bill Watson</h1>
              <div className="role-badges">
                <span className="role-badge supervisor">
                  Project Supervisor
                </span>
                <span className="role-badge location">
                  Dublin
                </span>
                <span className="role-badge institution">
                  UCD
                </span>
              </div>
            </div>

            <div className="hero-details">
              <div className="institution-info">
                <h2>Institution</h2>
                <p>Professor, University College Dublin</p>
                <p className="institution-roles">Head of Pathology | Director, Biomedical Health and Life Science BSc</p>
              </div>

              <div className="contact-actions">
                <a 
                  href="https://people.ucd.ie/william.watson/grants"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="action-button homepage"
                >
                  <Home size={20} />
                  <span>Homepage</span>
                  <ExternalLink size={16} />
                </a>
                <a 
                  href="mailto:william.watson@ucd.ie"
                  className="action-button email"
                >
                  <Mail size={20} />
                  <span>Email</span>
                </a>
              </div>

              <div className="social-links">
                <a href="https://scholar.google.com/citations?user=3sIZx1sAAAAJ&hl=en" target="_blank" rel="noopener noreferrer" className="social-button scholar">
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
            
            <div className="research-focus-section">
              <h3>Research Focus</h3>
              <div className="research-focus-grid">
                {researchFocus.map((focus, index) => (
                  <div key={index} className="research-focus-card">
                    <h4>{focus.title}</h4>
                    <p>{focus.description}</p>
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

export default Bill;