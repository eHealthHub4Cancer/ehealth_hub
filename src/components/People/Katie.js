import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Mail, ChevronRight, ExternalLink, Twitter, Github, Linkedin } from 'lucide-react';
import './Profile.css';

function Katie() {
  const profileImage = require('../../Images/People/KatieCrowley.png');
  
  const researchInterests = [
    'Affective Computing',
    'Human Computer Interaction',
    'Health Informatics',
    'User Experience (UX)',
    'Health IoT/IoMT',
    'Psychophysiology',
    'Wearable Technology',
    'Digital Signal Processing',
    'Mobile Technology',
    'Social Technology'
  ];

  const bioParagraphs = [
    `Dr. Katie Crowley is an academic in the Department of Computer Science and Information Systems at the University of Limerick, where she serves as the Course Director for the MSc in Health Informatics. Her research focuses on the intersection of computer science and healthcare, with particular emphasis on affective computing, human-computer interaction, and health information technology.`,
    
    `Katie's academic journey began with a BSc in Computer Science from University College Cork, followed by an MSc from the University of Limerick. She later completed her PhD in Computer Science at University College Cork, focusing on Affective Computing and Human-Computer Interaction, supported by an IRCSET scholarship.`,
    
    `Throughout her career, Katie has built extensive experience in designing and managing research programs, working across multiple prestigious Irish institutions including Trinity College Dublin (Neuroscience/Psychology), University College Cork (Computer Science/Psychology), University of Limerick (Computer Science/Computer & Electronic Engineering), and Munster Technological University (Computer & Electronic Engineering).`,
    
    `Katie has demonstrated strong leadership in research project management, from stakeholder collaboration to data analysis and implementation. Her work spans the full project lifecycle, emphasizing user-centered design principles and thorough documentation. She has secured significant national funding, including a Science Foundation Ireland Industry Fellowship grant, and regularly leads multidisciplinary teams in both academic and industry partnerships.`
  ];

  const expertise = [
    'Course Director, MSc in Health Informatics',
    'Project Management & Stakeholder Engagement',
    'User-Centered Design',
    'Interdisciplinary Research Leadership',
    'Industry-Academic Collaboration',
    'Research Methodology Development'
  ];

  return (
    <div className="profile-container">
      {/* Breadcrumb Navigation */}
      <nav className="breadcrumb">
        <Link to="/">People</Link>
        <ChevronRight size={16} />
        <Link to="/people">Directory</Link>
        <ChevronRight size={16} />
        <span>Dr. Katie Crowley</span>
      </nav>

      {/* Hero Section */}
      <div className="profile-hero">
        <div className="hero-content">
          <div className="hero-left">
            <div className="hero-image-wrapper">
              <img src={profileImage} alt="Dr. Katie Crowley" className="hero-image" />
            </div>
          </div>
          
          <div className="hero-right">
            <div className="hero-header">
              <h1>Dr. Katie Crowley</h1>
              <div className="role-badges">
                <span className="role-badge supervisor">
                  Project Supervisor
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
                <p>Associate Professor Computer Science & Health Informatics, Funded Investigator, Lero, University of Limerick</p>
              </div>

              <div className="contact-actions">
                <a 
                  href="https://www.ul.ie/scieng/dr-katie-crowley"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="action-button homepage"
                >
                  <Home size={20} />
                  <span>Homepage</span>
                  <ExternalLink size={16} />
                </a>
                <a 
                  href="mailto:katie.crowley@ul.ie"
                  className="action-button email"
                >
                  <Mail size={20} />
                  <span>Email</span>
                </a>
              </div>

              <div className="social-links">
                <a href="https://www.linkedin.com/in/katiecrowley/" target="_blank" rel="noopener noreferrer" className="social-button">
                  <Linkedin size={20} />
                  <span>LinkedIn</span>
                </a>
                <a href="https://github.com/katiecrowley" target="_blank" rel="noopener noreferrer" className="social-button">
                  <Github size={20} />
                  <span>GitHub</span>
                </a>
                <a href="https://scholar.google.com/citations?user=aCA5y-YAAAAJ&hl=en" target="_blank" rel="noopener noreferrer" className="social-button scholar">
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
            
            <div className="expertise-section">
              <h3>Areas of Expertise</h3>
              <ul className="expertise-list">
                {expertise.map((item, index) => (
                  <li key={index} className="expertise-item">
                    {item}
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

export default Katie;