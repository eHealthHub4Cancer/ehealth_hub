import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Calendar, User, ExternalLink, MonitorPlay, UserCheck, Microscope } from 'lucide-react';
import './NewsArticle.css';

function DellTechnologiesPresentation() {
  return (
    <div className="news-article-container">
      {/* Breadcrumb Navigation */}
      <nav className="article-breadcrumb">
        <Link to="/news" className="breadcrumb-link">News</Link>
        <ChevronLeft size={16} />
        <span>Prof Mark Lawler and DELL Technologies</span>
      </nav>

      {/* Article Header */}
      <div className="article-header">
        {/* <div className="article-categories">
          <span className="category-tag">DELL TECHNOLOGIES</span>
          <span className="category-tag">CONNECTED HEALTH</span>
          <span className="category-tag">TALK</span>
        </div> */}
        <br/>
        <h1>Prof Mark Lawler and DELL Technologies</h1>
        <div className="article-meta">
          <div className="meta-item">
            <Calendar size={18} />
            <span>April 20, 2023</span>
          </div>
          <div className="meta-item">
            <User size={18} />
            <span>AEDIN CULHANE</span>
          </div>
        </div>
      </div>

      {/* Featured Video Banner */}
      <div className="video-banner">
        <img 
          src={require('../../Images/News/DELL.PNG')} 
          alt="Digital Futures in Healthcare" 
          className="video-banner-image"
        />
        {/* <div className="video-overlay">
          <div className="video-title">Digital Futures in Healthcare</div>
          <Play size={60} className="play-icon" />
        </div> */}
      </div>

      {/* Article Content */}
      <div className="article-content">
        <div className="presentation-summary">
          <h2>Presentation Overview</h2>
          <p>Presentation by Prof Mark Lawler on Connected Health for the Digital Futures in Healthcare program with DELL Technologies.</p>
        </div>

        <div className="speaker-info">
          <div className="speaker-credentials">
            <h3>About the Speaker</h3>
            <p>Prof Mark Lawler, Chair in Translational Cancer Genomics at Queens University Belfast and DATACAN Leader</p>
          </div>
        </div>

        <div className="talk-highlights">
          <h2>Key Topics Covered</h2>
          <div className="highlights-grid">
            <div className="highlight-card">
              <MonitorPlay size={24} />
              <h3>Next Generation Diagnostics</h3>
              <p>Exploring advanced diagnostic technologies and their impact on healthcare</p>
            </div>
            <div className="highlight-card">
              <UserCheck size={24} />
              <h3>Digital Workplace</h3>
              <p>Future of healthcare digital workplace and its transformation</p>
            </div>
            <div className="highlight-card">
              <Microscope size={24} />
              <h3>Personalised Medicine</h3>
              <p>Insights into the world of personalised medicine and its potential</p>
            </div>
          </div>
        </div>

        <div className="presentation-details">
          <p>This talk was extremely informative for all participants to gain insights into the next generation of diagnostics, the healthcare digital workplace of the future and the interesting world of personalised medicine.</p>
        </div>
        <div className="program-link">
          <h2>Digital Futures in Healthcare Program</h2>
          <br/>
          <a 
            href="https://www.dell.com/en-ie/dt/microsites/digital-futures-in-healthcare.htm#scroll=off"
            target="_blank"
            rel="noopener noreferrer"
            className="program-button"
          >
            <span>Learn More About the Program</span>
            <ExternalLink size={16} />
          </a>
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

export default DellTechnologiesPresentation;