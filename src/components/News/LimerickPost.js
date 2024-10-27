import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Calendar, User, ExternalLink, MapPin, Users, Eye } from 'lucide-react';
import './NewsArticle.css';

function LimerickPost() {
  return (
    <div className="news-article-container">
      {/* Breadcrumb Navigation */}
      <nav className="article-breadcrumb">
        <Link to="/news" className="breadcrumb-link">News</Link>
        <ChevronLeft size={16} />
        <span>LimerickPost</span>
      </nav>

      {/* Article Header */}
      <div className="article-header">
        <div className="article-categories">
          <span className="category-tag">NEWS ARTICLE</span>
          <span className="category-tag">LIMERICK</span>
        </div>
        <h1>Limerick and Belfast researchers tackle 'future cancer epidemic'</h1>
        <div className="article-meta">
          <div className="meta-item">
            <Calendar size={18} />
            <span>April 4, 2022</span>
          </div>
          <div className="meta-item">
            <User size={18} />
            <span>AEDIN CULHANE</span>
          </div>
          <div className="meta-item">
            <Eye size={18} />
            <span>224 views</span>
          </div>
        </div>
      </div>

      {/* Featured Image Section */}
      <div className="news-feature">
        <div className="feature-image-container">
          <img 
            src={require('../../Images/News/2022_Apr_LimerickPost_Update.png')}
            alt="Professors Ruth Clifford and Aedin Culhane" 
            className="feature-image"
          />
          <div className="image-caption">
            Professor Ruth Clifford, Consultant Haematologist at University Hospital Limerick with Professor Aedin Culhane, Professor of Cancer Genomics at University of Limerick who is leading the All Island eHealth Hub for Cancer
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="article-content">
        
        {/* Read More Section */}
        <div className="read-more-section">
          <h2>Read the Full Story</h2>
          <a 
            href="https://www.limerickpost.ie/2022/04/04/limerick-and-belfast-researchers-tackle-future-cancer-epidemic/"
            target="_blank"
            rel="noopener noreferrer"
            className="read-article-button"
          >
            <span>Read in Limerick Post</span>
            <ExternalLink size={16} />
          </a>
        </div>

        {/* Research Impact */}
        <div className="impact-section">
          <h2>Research Impact</h2>
          <div className="impact-cards">
            <div className="impact-card">
              <Users size={24} />
              <h3>Cross-Border Collaboration</h3>
              <p>Strengthening all-island research initiatives</p>
            </div>
            <div className="impact-card">
              <Eye size={24} />
              <h3>Future Focus</h3>
              <p>Addressing potential cancer epidemic challenges</p>
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

export default LimerickPost;