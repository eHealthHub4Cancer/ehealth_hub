import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Calendar, User, ExternalLink, MapPin, Presentation, Network, Users } from 'lucide-react';
import './NewsArticle.css';

function BCNITalk() {
  return (
    <div className="news-article-container">
      {/* Breadcrumb Navigation */}
      <nav className="article-breadcrumb">
        <Link to="/" className="breadcrumb-link">News</Link>
        <ChevronLeft size={16} />
        <span>BCNI Talk</span>
      </nav>

      {/* Article Header */}
      <div className="article-header">
        {/* <div className="article-categories">
          <span className="category-tag">CONFERENCE</span>
          <span className="category-tag">GALWAY</span>
          <span className="category-tag">BLOOD CANCER</span>
          <span className="category-tag">TALK</span>
        </div> */}
        <br/>
        <h1>BCNI Talk</h1>
        <div className="article-meta">
          <div className="meta-item">
            <Calendar size={18} />
            <span>September 9, 2022</span>
          </div>
          <div className="meta-item">
            <User size={18} />
            <span>AEDIN CULHANE</span>
          </div>
        </div>
      </div>

      {/* Featured Banner */}
      <div className="bcni-banner">
        <img 
          src={require('../../Images/News/BCNI_meeting.png')}
          alt="BCNI Symposium" 
          className="bcni-image"
        />
        <div className="banner-content">
          <h2>Blood Cancer Network Ireland Symposium 2022</h2>
          <p>Presentation of the eHealth Hub at the Blood Cancer Network Ireland Meeting</p>
        </div>
      </div>

      {/* Event Details */}
      <div className="event-details-cards">
        <div className="detail-card location">
          <MapPin size={24} />
          <div>
            <h3>Location</h3>
            <p>Galway, Ireland</p>
          </div>
        </div>
        <div className="detail-card network">
          <Network size={24} />
          <div>
            <h3>Network</h3>
            <p>Blood Cancer Network Ireland</p>
          </div>
        </div>
        <div className="detail-card format">
          <Users size={24} />
          <div>
            <h3>Format</h3>
            <p>In-Person Symposium</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="article-content">
        <div className="symposium-description">
          <p>On the 9th of September, the eHealthHub lead Prof Aedin Culhane presented at the Irish Blood Cancer Network Symposium which was held in person in Galway.</p>
        </div>

        <div className="resources-section">
          <h2>Symposium Resources</h2>
          <div className="resources-grid">
            <a 
              href="https://ehealth4cancer.org/contents/presentations/22_09_09_BCNI_Galway.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="resource-card presentation"
            >
              <Presentation size={24} />
              <div>
                <h3>Presentation Slides</h3>
                <p>View Prof Culhane's presentation slides</p>
              </div>
              <ExternalLink size={16} />
            </a>

            <a 
              href="https://nuigalwaybcni.clr.events/event/132483:blood-cancer-network-bcni-symposium-2022"
              target="_blank"
              rel="noopener noreferrer"
              className="resource-card symposium"
            >
              <Network size={24} />
              <div>
                <h3>Symposium Details</h3>
                <p>Learn more about the BCNI Symposium 2022</p>
              </div>
              <ExternalLink size={16} />
            </a>

            <a 
              href="https://ehealth4cancer.org/News/Irish%20Blood%20Cancer%20Network%20Symposium"
              target="_blank"
              rel="noopener noreferrer"
              className="resource-card network-info"
            >
              <Users size={24} />
              <div>
                <h3>Network Information</h3>
                <p>Explore the Irish Blood Cancer Network</p>
              </div>
              <ExternalLink size={16} />
            </a>
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

export default BCNITalk;