import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Calendar, MapPin, ExternalLink, Briefcase, GraduationCap, Clock, Building } from 'lucide-react';
import './NewsArticle.css';

function Postdoc() {
  return (
    <div className="news-article-container">
      {/* Breadcrumb Navigation */}
      <nav className="article-breadcrumb">
        <Link to="/news" className="breadcrumb-link">News</Link>
        <ChevronLeft size={16} />
        <span>Postdoctoral Opportunities</span>
      </nav>

      {/* Job Header */}
      <div className="job-header">
        <h1>Post Doctoral Researcher in Cancer Digital Health</h1>
        <div className="job-meta">
          <div className="meta-item">
            <Building size={18} />
            <span>University of Limerick</span>
          </div>
          <div className="meta-item">
            <MapPin size={18} />
            <span>Limerick, Ireland</span>
          </div>
          <div className="meta-item">
            <Clock size={18} />
            <span>Closing: November 20, 2024</span>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      <div className="campus-showcase">
        <img 
          src={require('../../Images/News/postdoc.png')}
          alt="University of Limerick Campus" 
          className="campus-image"
        />
      </div>

      {/* Job Content */}
      <div className="job-content">
        <div className="key-details">
          <div className="detail-card">
            <Briefcase size={24} />
            <div>
              <h3>Position Level</h3>
              <p>PD1 or PD2</p>
            </div>
          </div>
          <div className="detail-card">
            <GraduationCap size={24} />
            <div>
              <h3>Department</h3>
              <p>School of Medicine</p>
            </div>
          </div>
          <div className="detail-card">
            <Calendar size={24} />
            <div>
              <h3>Contract Type</h3>
              <p>Specific Purpose</p>
            </div>
          </div>
        </div>

        <div className="salary-info">
          <h2>Salary Scales</h2>
          <div className="salary-grid">
            <div className="salary-card pd1">
              <h3>PD1</h3>
              <p>€44,847 - €51,313 p.a. pro rata</p>
            </div>
            <div className="salary-card pd2">
              <h3>PD2</h3>
              <p>€52,715 - €57,332 p.a. pro rata</p>
            </div>
          </div>
        </div>

        <div className="project-areas">
          <h2>Key Project Areas</h2>
          <div className="areas-grid">
            <div className="area-card">
              <h3>Data Harmonization</h3>
              <p>Leading development of analytical pipelines for harmonising cancer clinical data to international standards</p>
            </div>
            <div className="area-card">
              <h3>Algorithm Development</h3>
              <p>Developing innovative algorithms and software for clinical genomics</p>
            </div>
            <div className="area-card">
              <h3>Framework Creation</h3>
              <p>Establishing federated cancer clinical genomics frameworks</p>
            </div>
          </div>
        </div>

        <div className="apply-section">
          <h2>How to Apply</h2>
          <p>Applications must be completed online before 12 noon, Irish Standard Time on November 20, 2024</p>
          <a 
            href="https://universityvacancies.com/university-limerick/post-doctoral-researcher-level-1-or-2-cancer-digital-health-real-world-0"
            target="_blank"
            rel="noopener noreferrer"
            className="apply-button"
          >
            <span>Apply Now</span>
            <ExternalLink size={16} />
          </a>
        </div>
      </div>

      {/* Back Navigation */}
      <div className="article-footer">
        <Link to="/news" className="back-to-news">
          <ChevronLeft size={20} />
          <span>Back to News</span>
        </Link>
      </div>
    </div>
  );
}

export default Postdoc;