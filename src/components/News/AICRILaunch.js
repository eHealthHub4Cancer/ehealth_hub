import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Calendar, User, ExternalLink, MapPin, Presentation, Video, Users } from 'lucide-react';
import './NewsArticle.css';

function AICRILaunch() {
  return (
    <div className="news-article-container">
      {/* Breadcrumb Navigation */}
      <nav className="article-breadcrumb">
        <Link to="/news" className="breadcrumb-link">News</Link>
        <ChevronLeft size={16} />
        <span>AICRI Launch</span>
      </nav>

      {/* Article Header */}
      <div className="article-header">
        {/* <div className="article-categories">
          <span className="category-tag">AICRI</span>
          <span className="category-tag">DUBLIN</span>
        </div> */}
        <br/>
        <h1>AICRI Launch</h1>
        <div className="article-meta">
          <div className="meta-item">
            <Calendar size={18} />
            <span>September 28, 2022</span>
          </div>
          <div className="meta-item">
            <User size={18} />
            <span>AEDIN CULHANE</span>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      <div className="showcase-banner">
        <img 
          src={require('../../Images/News/AICRI_launch.jpeg')}
          alt="AICRI Launch Event" 
          className="showcase-image"
        />
        <div className="showcase-overlay">
          <h2>All-Ireland Cancer Institute Showcase</h2>
          <p>15th International Symposium on Translational Research in Oncology</p>
        </div>
      </div>

      {/* Event Details */}
      <div className="event-info-grid">
        <div className="event-info-card location">
          <MapPin size={24} />
          <div>
            <h3>Venue</h3>
            <p>Herbert Park Hotel, Dublin</p>
          </div>
        </div>
        <div className="event-info-card presentation">
          <Presentation size={24} />
          <div>
            <h3>Type</h3>
            <p>Showcase Event & Symposium</p>
          </div>
        </div>
        <div className="event-info-card attendance">
          <Users size={24} />
          <div>
            <h3>Format</h3>
            <p>In-Person Meeting</p>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="article-content">
        <div className="event-summary">
          <p>On the 28th of September, the eHealthHub team presented at the All-Ireland Cancer Institute (AICRI) Showcase event which was held in collaboration with 15th International Symposium on Translational Research in Oncology, at the Herbert Park Hotel, Dublin.</p>
          
          <div className="showcase-highlights">
            <h2>Event Highlights</h2>
            <div className="highlights-boxes">
              <div className="highlight-box">
                <h3>Vision Showcase</h3>
                <p>Presented eHealthHub's vision and achievements to date</p>
              </div>
              <div className="highlight-box">
                <h3>Future Roadmap</h3>
                <p>Outlined planned activities and future directions</p>
              </div>
              <div className="highlight-box">
                <h3>Positive Reception</h3>
                <p>Received excellent feedback from attendees</p>
              </div>
            </div>
          </div>
        </div>

        <div className="resources-section">
          <h2>Event Resources</h2>
          <div className="resources-grid">
            <a 
              href="https://ehealth4cancer.org/contents/presentations/22_09_28_AICRI_launch.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="resource-card slides"
            >
              <Presentation size={24} />
              <div>
                <h3>Presentation Slides</h3>
                <p>Download the presentation slides</p>
              </div>
              <ExternalLink size={16} />
            </a>
            
            <a 
              href="https://www.aicri.org/news/aicri-showcase-vision-and-progress-event"
              target="_blank"
              rel="noopener noreferrer"
              className="resource-card website"
            >
              <Video size={24} />
              <div>
                <h3>AICRI Website</h3>
                <p>Watch the Taoiseach's address & learn more</p>
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

export default AICRILaunch;