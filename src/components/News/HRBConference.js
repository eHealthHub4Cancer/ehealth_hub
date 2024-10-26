import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Calendar, User, ExternalLink, Youtube, MapPin, Users } from 'lucide-react';
import './NewsArticle.css';

function HRBConference() {
  return (
    <div className="news-article-container">
      {/* Breadcrumb Navigation */}
      <nav className="article-breadcrumb">
        <Link to="/news" className="breadcrumb-link">News</Link>
        <ChevronLeft size={16} />
        <span>HRB</span>
      </nav>

      {/* Article Header */}
      <div className="article-header">
        <div className="article-categories">
          <span className="category-tag">CONFERENCE</span>
          <span className="category-tag">DUBLIN</span>
          <span className="category-tag">VIDEO</span>
        </div>
        <h1>National HRB Conference "Personalised Medicine in Ireland"</h1>
        <div className="article-meta">
          <div className="meta-item">
            <Calendar size={18} />
            <span>November 30, 2022</span>
          </div>
          <div className="meta-item">
            <User size={18} />
            <span>AEDIN CULHANE</span>
          </div>
        </div>
      </div>

      {/* Conference Info Banner */}
      <div className="conference-banner">
        <div className="conference-location">
          <MapPin size={24} />
          <div>
            <h3>Venue</h3>
            <p>Radisson Blu Royal Hotel, Dublin</p>
          </div>
        </div>
        <div className="conference-focus">
          <Users size={24} />
          <div>
            <h3>Panel Focus</h3>
            <p>Personalised medicine in action</p>
          </div>
        </div>
      </div>

      {/* Video Section */}
      <div className="video-embed-container">
        <h2>Watch the Panel Discussion</h2>
        <div className="video-wrapper">
          <iframe
            src="https://www.youtube.com/embed/uc0LTOxXItI"
            title="Personalised medicine in action - Panel Discussion"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      {/* Article Content */}
      <div className="article-content">
        <div className="conference-overview">
          <h2>Conference Overview</h2>
          <p>On the 30th of November, the eHealthHub lead Prof Aedin Culhane was invited to chair and participate in a panel discussion on Personalised medicine in action at the National HRB Conference "Personalised Medicine in Ireland" held at the Radisson Blu Royal Hotel, Dublin.</p>
        </div>

        <div className="conference-highlights">
          <div className="highlight-box">
            <h3>Key Discussion Points</h3>
            <ul>
              <li>Current state of personalised medicine in Ireland</li>
              <li>Future directions and opportunities</li>
              <li>Implementation challenges and solutions</li>
              <li>Cross-sector collaboration opportunities</li>
            </ul>
          </div>
        </div>

        <div className="conference-links">
          <h2>Additional Resources</h2>
          <div className="resources-grid">
            <a 
              href="https://www.hrb.ie/event/personalised-medicine-in-ireland/"
              target="_blank"
              rel="noopener noreferrer"
              className="resource-link"
            >
              <div>
                <h3>Conference Website</h3>
                <p>Visit the official HRB conference page</p>
              </div>
              <ExternalLink size={16} />
            </a>
            <a 
              href="https://www.youtube.com/watch?v=uc0LTOxXItI"
              target="_blank"
              rel="noopener noreferrer"
              className="resource-link youtube"
            >
              <div>
                <h3>Full Panel Discussion</h3>
                <p>Watch the complete video on YouTube</p>
              </div>
              <Youtube size={16} />
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

export default HRBConference;