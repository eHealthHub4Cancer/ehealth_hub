import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import NSRPLogo from '../Images/logo/NSRP_Logo.png';
import LDCRCLogo from '../Images/logo/LDCRC_Logo_fixed.png';
import QUBLogo from '../Images/logo/QUB_logo.jpg';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section main-info">
          <h3 className="footer-title">eHealth-Hub for Cancer</h3>
          <p className="footer-description">
            Advancing cancer research through cross-border collaboration and 
            real-time data access across the island of Ireland.
          </p>
          <div className="social-links">
            <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" 
               className="social-link" aria-label="Twitter">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
              </svg>
            </a>
            <a href="https://github.com/" target="_blank" rel="noopener noreferrer" 
               className="social-link" aria-label="GitHub">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/>
              </svg>
            </a>
          </div>
        </div>

        <div className="footer-section quick-links">
          <h4>Quick Links</h4>
          <nav>
            <Link to="/about">About</Link>
            <Link to="/people">People</Link>
            <Link to="/projects">Projects</Link>
            <Link to="/news">News</Link>
          </nav>
        </div>

        <div className="footer-section contact-info">
          <h4>Contact</h4>
          <p>University of Limerick</p>
          <p>Limerick, Ireland</p>
          <a href="mailto:contact@ehealthhub.ie">contact@ehealthhub.ie</a>
        </div>

        <div className="footer-section organizations">
          <div className="lead-organizations">
            <h4>Lead Organizations</h4>
            <div className="org-logos">
              <a href="https://www.ul.ie" target="_blank" rel="noopener noreferrer" 
                 className="org-logo">
                <img src={LDCRCLogo} alt="LDCRC Logo" />
              </a>
              <a href="https://www.qub.ac.uk" target="_blank" rel="noopener noreferrer" 
                 className="org-logo">
                <img src={QUBLogo} alt="QUB Logo" />
              </a>
            </div>
          </div>
          
          <div className="sponsors">
            <h4>Funded By</h4>
            <div className="sponsor-logo">
              <a href="https://www.nsrp.ie" target="_blank" rel="noopener noreferrer">
                <img src={NSRPLogo} alt="NSRP Logo" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>&copy; {currentYear} eHealth-Hub for Cancer. All rights reserved.</p>
          <div className="footer-bottom-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;