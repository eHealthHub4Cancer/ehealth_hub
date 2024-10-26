import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Calendar, User, ExternalLink, Mail, GraduationCap, Clock, Plane } from 'lucide-react';
import './NewsArticle.css';

function PhDOpportunity() {
  return (
    <div className="news-article-container">
      {/* Breadcrumb Navigation */}
      <nav className="article-breadcrumb">
        <Link to="/news" className="breadcrumb-link">News</Link>
        <ChevronLeft size={16} />
        <span>PhD Advert</span>
      </nav>

      {/* Article Header */}
      <div className="article-header">
        <div className="article-categories">
          <span className="category-tag">PHD</span>
          <span className="category-tag">RESEARCH OPPORTUNITY</span>
        </div>
        <h1>Interested in a Fully-Funded PhD?</h1>
        <div className="article-meta">
          <div className="meta-item">
            <Calendar size={18} />
            <span>May 12, 2023</span>
          </div>
          <div className="meta-item">
            <User size={18} />
            <span>AEDIN CULHANE</span>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      <div className="article-image-container">
        <img 
          src={require('../../Images/News/Computer_Stockphoto.PNG')} 
          alt="PhD Research Opportunity" 
          className="article-image"
        />
      </div>

      {/* Article Content */}
      <div className="article-content">
        <div className="opportunity-highlights">
          <div className="highlight-item">
            <GraduationCap size={24} />
            <div className="highlight-content">
              <h3>Full Funding</h3>
              <p>Tax-free stipend with fees paid</p>
            </div>
          </div>
          <div className="highlight-item">
            <Clock size={24} />
            <div className="highlight-content">
              <h3>Duration</h3>
              <p>Full-time PhD position</p>
            </div>
          </div>
          <div className="highlight-item">
            <Plane size={24} />
            <div className="highlight-content">
              <h3>Travel Support</h3>
              <p>12-month travel to partner sites</p>
            </div>
          </div>
        </div>

        <div className="article-body">
          <h2>About the Opportunity</h2>
          <p>We are looking for PhD students to work on cutting-edge cancer health data science research. This is an exciting opportunity to join our research team and contribute to groundbreaking research in Digital Health.</p>

          <div className="opportunity-details">
            <h2>What We Offer</h2>
            <ul>
              <li>Fully funded PhD studentship</li>
              <li>Tax-free stipend (with fees paid)</li>
              <li>Research expenses covered</li>
              <li>12-month travel to partner sites</li>
              <li>Materials and resources provided</li>
              <li>Expert supervision and mentoring</li>
            </ul>
          </div>

          <div className="application-section">
            <h2>How to Apply</h2>
            <p>Informal queries can be made to Aedin Culhane by emailing eHealth@ul.ie</p>
            
            <a 
              href="https://www.ul.ie/research/doctoral-college/postgraduate-research-scholarships"
              target="_blank"
              rel="noopener noreferrer"
              className="apply-button"
            >
              <span>View Full Details & Apply</span>
              <ExternalLink size={16} />
            </a>
          </div>

          <div className="contact-box">
            <Mail size={24} />
            <div className="contact-content">
              <h3>Got Questions?</h3>
              <p>Contact us at <a href="mailto:eHealth@ul.ie">eHealth@ul.ie</a> for more information</p>
            </div>
          </div>
        </div>
      </div>

      {/* Back to News */}
      <div className="article-footer">
        <Link to="/news" className="back-to-news">
          <ChevronLeft size={20} />
          <span>Back to News</span>
        </Link>
      </div>
    </div>
  );
}

export default PhDOpportunity;