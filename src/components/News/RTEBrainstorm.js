import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Calendar, User, ExternalLink, Clock, Newspaper } from 'lucide-react';
import './NewsArticle.css';

function RTEBrainstorm() {
  return (
    <div className="news-article-container">
      {/* Breadcrumb Navigation */}
      <nav className="article-breadcrumb">
        <Link to="/news" className="breadcrumb-link">News</Link>
        <ChevronLeft size={16} />
        <span>RTE Brainstorm Article</span>
      </nav>

      {/* Article Header */}
      <div className="article-header">
        {/* <div className="article-categories">
          <span className="category-tag">RTE</span>
          <span className="category-tag">NEWS ARTICLE</span>
        </div> */}
        <br/>
        <h1>A race against time: catching missed cancer cases due to Covid</h1>
        <div className="article-meta">
          <div className="meta-item">
            <Calendar size={18} />
            <span>May 19, 2022</span>
          </div>
          <div className="meta-item">
            <User size={18} />
            <span>AEDIN CULHANE</span>
          </div>
        </div>
      </div>

      {/* Featured Media */}
      <div className="media-container">
        <div className="rte-brand-bar">
          <img 
            src={require('../../Images/News/BrainStorm (1).png')}
            alt="RTE Brainstorm" 
            className="rte-logo"
          />
        </div>
        <div className="feature-image-wrapper">
          <img 
            src={require('../../Images/News/BrainStorm (1).png')}
            alt="X-ray showing cancer diagnosis" 
            className="feature-image"
          />
          {/* <div className="image-caption">
            'As people now begin to return, screening services and cancer care are at risk of being overwhelmed with demand'
          </div> */}
        </div>
      </div>

      {/* Article Content */}
      <div className="article-content">
        <div className="article-overview">
          <div className="overview-box">
            <div className="overview-icon">
              <Clock size={24} />
            </div>
            <div className="overview-content">
              <h3>Published</h3>
              <p>Thursday, May 19, 2022 16:00</p>
            </div>
          </div>
          <div className="overview-box">
            <div className="overview-icon">
              <Newspaper size={24} />
            </div>
            <div className="overview-content">
              <h3>Featured On</h3>
              <p>RTE Brainstorm</p>
            </div>
          </div>
        </div>

        <div className="article-summary2">
          <h2>Article Summary</h2>
          <p>In May 2022, the eHealthHub lead Prof Aedin Culhane and Prof Mark Lawler spoke with RTE Brainstorm about the pressing need for harmonization of clinical cancer health data, to enable health research to tackle COVID-19 and Cancer</p>
        </div>

        <div className="article-highlight">
          <blockquote>
            The article discusses the critical importance of addressing delayed cancer diagnoses due to COVID-19 and the role of harmonized health data in tackling this challenge.
          </blockquote>
        </div>

        <div className="article-cta">
          <h2>Read the Full Article</h2>
          <br/>
          <a 
            href="https://www.rte.ie/brainstorm/2022/0519/1299916-cancer-treatment-diagnosis-covid-delays-data-ireland-europe/"
            target="_blank"
            rel="noopener noreferrer"
            className="read-more-button"
          >
            <span>Read on RTE Brainstorm</span>
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

export default RTEBrainstorm;