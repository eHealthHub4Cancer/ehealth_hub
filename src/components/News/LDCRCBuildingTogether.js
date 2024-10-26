import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Calendar, User, ExternalLink, Users } from 'lucide-react';
import './NewsArticle.css';

function LDCRCBuildingTogether() {
  return (
    <div className="news-article-container">
      {/* Breadcrumb Navigation */}
      <nav className="article-breadcrumb">
        <Link to="/" className="breadcrumb-link">News</Link>
        <ChevronLeft size={16} />
        <span>LDCRC Building Together Event</span>
      </nav>

      {/* Article Header */}
      <div className="article-header">
        <div className="article-categories">
          <span className="category-tag">LDCRC</span>
          <span className="category-tag">CONNECTED HEALTH</span>
          <span className="category-tag">TALK</span>
        </div>
        <h1>LDCRC Building Together Event</h1>
        <div className="article-meta">
          <div className="meta-item">
            <Calendar size={18} />
            <span>April 25, 2023</span>
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
          src={require('../../Images/News/LDCRC_BuildingTogether_April_2023.jpeg')} 
          alt="LDCRC Building Together Event" 
          className="article-image"
        />
        <div className="image-caption">
          LDCRC Building Together Event led by Prof Aedin Culhane and Prof Ruth Clifford
        </div>
      </div>

      {/* Article Content */}
      <div className="article-content">
        <div className="event-banner">
          <div className="event-banner-content">
            <Users size={24} />
            <div>
              <h2>Building Together</h2>
              <p>A collaborative initiative to advance cancer research</p>
            </div>
          </div>
        </div>

        <div className="article-body">
          <div className="event-description">
            <h2>About the Event</h2>
            <p>The event was led by Prof. Aedin Culhane Director of the LDCRC (UL) and Prof. Ruth Clifford (UL) Clinical Director/Lead. It was a pleasure to hear from such gifted speakers on the day who provided us with insights into various aspects of cancer research.</p>
          </div>

          <div className="event-leaders">
            <h2>Event Leaders</h2>
            <div className="leaders-grid">
              <div className="leader-card">
                <h3>Prof. Aedin Culhane</h3>
                <p>Director of the LDCRC (UL)</p>
              </div>
              <div className="leader-card">
                <h3>Prof. Ruth Clifford</h3>
                <p>Clinical Director/Lead (UL)</p>
              </div>
            </div>
          </div>

          <div className="learn-more-section">
            <h2>Learn More</h2>
            <a 
              href="https://www.ul.ie/limerick-dcrc"
              target="_blank"
              rel="noopener noreferrer"
              className="learn-more-button"
            >
              <span>Visit LDCRC Website</span>
              <ExternalLink size={16} />
            </a>
            <p className="learn-more-description">
              Discover more about the Limerick Digital Cancer Research Centre and our ongoing initiatives in cancer research.
            </p>
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

export default LDCRCBuildingTogether;