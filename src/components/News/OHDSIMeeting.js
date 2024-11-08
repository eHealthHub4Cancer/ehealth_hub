import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Calendar, User, ExternalLink, MapPin, Globe } from 'lucide-react';
import './NewsArticle.css';

function OHDSIMeeting() {
  return (
    <div className="news-article-container">
      {/* Breadcrumb Navigation */}
      <nav className="article-breadcrumb">
        <Link to="/news" className="breadcrumb-link">News</Link>
        <ChevronLeft size={16} />
        <span>eHealth-Hub at the OHDSI 2022 meeting</span>
      </nav>

      {/* Article Header */}
      <div className="article-header">
        {/* <div className="article-categories">
          <span className="category-tag">USA</span>
          <span className="category-tag">CONFERENCE</span>
          <span className="category-tag">OHDSI</span>
        </div> */}
        <br/>
        <h1>eHealth-Hub at the OHDSI 2022 meeting</h1>
        <div className="article-meta">
          <div className="meta-item">
            <Calendar size={18} />
            <span>October 16, 2022</span>
          </div>
          <div className="meta-item">
            <User size={18} />
            <span>AEDIN CULHANE</span>
          </div>
        </div>
      </div>

      {/* Featured Image with Enhanced Caption */}
      <div className="conference-image-container">
        <img 
          src={require('../../Images/News/2022_OHDSI_meeting_WashingtonDC.jpg')}
          alt="OHDSI 2022 Symposium attendees in Washington DC" 
          className="conference-main-image"
        />
        <div className="image-overlay">
          <span>OHDSI 2022 Symposium Attendees in Bethesda, Washington DC</span>
        </div>
      </div>


      {/* Event Details Banner */}
      <div className="event-details-grid">
        <div className="event-detail-card">
          <MapPin size={24} />
          <div>
            <h3>Location</h3>
            <p>Bethesda, Washington DC</p>
          </div>
        </div>
        <div className="event-detail-card">
          <Calendar size={24} />
          <div>
            <h3>Date</h3>
            <p>October 14-16, 2022</p>
          </div>
        </div>
        <div className="event-detail-card">
          <Globe size={24} />
          <div>
            <h3>Type</h3>
            <p>International Symposium</p>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="article-content">
        <div className="symposium-overview">
          <h2>Symposium Overview</h2>
          <p>In Oct 2022, the eHealthHub lead Prof Aedin Culhane attended the 2022 OHDSI Symposium in Bethesda, Washington DC. Prof Culhane met with OHDSI oncology collaborators, strengthening international partnerships and advancing collaborative research initiatives.</p>
        </div>

        <div className="conference-highlights">
          <div className="highlights-container">
            <h2>Key Aspects</h2>
            <div className="highlights-grid">
              <div className="highlight-item">
                <h3>International Collaboration</h3>
                <p>Meeting with OHDSI oncology collaborators</p>
              </div>
              <div className="highlight-item">
                <h3>Knowledge Exchange</h3>
                <p>Sharing insights and best practices</p>
              </div>
              <div className="highlight-item">
                <h3>Network Building</h3>
                <p>Strengthening research partnerships</p>
              </div>
            </div>
          </div>
        </div>

        <div className="conference-link-section">
          <h2>Learn More About OHDSI 2022</h2>
          <br/>
          <a 
            href="https://ohdsi.org/ohdsi2022symposium/"
            target="_blank"
            rel="noopener noreferrer"
            className="conference-link-button"
          >
            <span>Visit OHDSI Conference Website</span>
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

export default OHDSIMeeting;