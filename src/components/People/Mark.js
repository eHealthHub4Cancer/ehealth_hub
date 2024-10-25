import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Mail, ChevronRight, ExternalLink, Twitter, Linkedin } from 'lucide-react';
import './Profile.css';

function Mark() {
  const profileImage = require('../../Images/People/MarkLawler.jpg');
  
  const researchInterests = [
    'Cancer Research',
    'Health Data Research',
    'Colorectal Cancer',
    'Patient Rights & Policy',
    'COVID-19 Impact on Cancer',
    'Public Health Policy',
    'Cancer Epidemiology',
    'Health Data Analytics',
    'Medical Outreach',
    'International Collaboration'
  ];

  const bioParagraphs = [
    `Professor Lawler is an internationally renowned scientist with over 30 years experience in cancer research, who is passionate about translating his research for the benefit of patients and society.`,
    
    `He has received numerous awards including the prestigious 2018 European Health Award and he is frequently invited to speak at top-tier international conferences.`,
    
    `He was architect of the European Cancer Patient's Bill of Rights, which he launched with patients and health professionals in the European Parliament on World Cancer Day 2014. The Bill of Rights, translated into 17 European languages and adopted in 25 European countries, is a beacon of hope for cancer patients Europe-wide, leading to development of the 70:35 Vision - 70% average survival for cancer patients by 2035. This Vision has been adopted by the European CanCer Organisation, the largest multidisciplinary cancer organisation in Europe, and is influencing health policy in many European countries.`,
    
    `His research in colorectal cancer (CRC) has increased our understanding of this common disease. His leadership of Bowel Cancer UK's Critical Research Gaps in Colorectal Cancer Initiative will influence CRC research activity/policy over the next decade.`,
    
    `Professor Lawler is Associate Director of Health Data Research Wales-Northern Ireland and Scientific Director of DATA-CAN, the UK Health Data Research Hub for Cancer. His leadership in heath data research, with a particular emphasis on cancer has been world leading with key publications in the premier scientific and medical journals.`,
    
    `His recent work on Coronavirus and cancer, highlighting how the current COVID-19 pandemic may lead to a future cancer epidemic, has received international recognition, with over 300 media stories and publications in key international scientific journals.`,
    
    `Professor Lawler is also a passionate advocate for the development of outreach activities, fostering increased public understanding of science and medicine.`
  ];

  const keyInitiatives = [
    {
      title: "European Cancer Patient's Bill of Rights",
      link: "https://ecpc.org/european-bill-of-cancer-patients-rights/"
    },
    {
      title: "Bowel Cancer Research Initiative",
      link: "https://www.huffingtonpost.co.uk/entry/over-300000-people-will-needlessly-die-from-bowel-cancer-by-2035-because-of-research-gaps-charity-warns_uk_5a2e72fce4b069ec48aece15"
    },
    {
      title: "DATA-CAN",
      link: "https://www.data-can.org.uk/"
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
        <span>Prof Mark Lawler</span>
      </nav>

      {/* Hero Section */}
      <div className="profile-hero">
        <div className="hero-content">
          <div className="hero-left">
            <div className="hero-image-wrapper">
              <img src={profileImage} alt="Prof Mark Lawler" className="hero-image" />
            </div>
          </div>
          
          <div className="hero-right">
            <div className="hero-header">
              <h1>Prof Mark Lawler</h1>
              <div className="role-badges">
                <span className="role-badge supervisor">
                  Project Leader
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
                <p>Professor, Queens University Belfast</p>
              </div>

              <div className="contact-actions">
                <a 
                  href="https://www.data-can.org.uk/about-us/management-group/professor-mark-lawler/"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="action-button homepage"
                >
                  <Home size={20} />
                  <span>Homepage</span>
                  <ExternalLink size={16} />
                </a>
                <a 
                  href="mailto:mark.lawler@qub.ac.uk"
                  className="action-button email"
                >
                  <Mail size={20} />
                  <span>Email</span>
                </a>
              </div>

              <div className="social-links">
                <a href="https://x.com/QUBCancerProf" target="_blank" rel="noopener noreferrer" className="social-button">
                  <Twitter size={20} />
                  <span>Twitter</span>
                </a>
                <a href="https://www.linkedin.com/in/mark-lawler-b8387324/" target="_blank" rel="noopener noreferrer" className="social-button">
                  <Linkedin size={20} />
                  <span>LinkedIn</span>
                </a>
                <a href="https://pure.qub.ac.uk/en/persons/mark-lawler/publications/" target="_blank" rel="noopener noreferrer" className="social-button scholar">
                  <span>Publications</span>
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
            
            <div className="key-initiatives">
              <h3>Key Initiatives</h3>
              <div className="initiatives-grid">
                {keyInitiatives.map((initiative, index) => (
                  <a 
                    key={index}
                    href={initiative.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="initiative-card"
                  >
                    <span className="initiative-title">{initiative.title}</span>
                    <ExternalLink size={16} />
                  </a>
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

export default Mark;