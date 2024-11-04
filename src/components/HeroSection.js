import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Users, 
  Share2, 
  Database, 
  Cloud, 
  Microscope, 
  Network,
  ChevronRight
} from 'lucide-react';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <div className="hero-grid">
          <div className="hero-left">
            
            <div className="hero-text">
              <h1 className="hero-title">
                The eHealth-Hub for Cancer
              </h1>
              <h2 className="hero-subtitle">Transforming Healthcare Data</h2>
              <h3 className="hero-subheading">
                Unified harmonized health data for network cancer research studies
              </h3>
              <div className="accent-line"></div>
            </div>

            <div className="hero-badges">
              <div className="badge">
                <Shield className="badge-icon" size={20} />
                <span>Secure Data</span>
              </div>
              <div className="badge">
                <Users className="badge-icon" size={20} />
                <span>All-Island Partnership</span>
              </div>
              <div className="badge">
                <Share2 className="badge-icon" size={20} />
                <span>Open Science</span>
              </div>
            </div>

            <div className="hero-description">
              <p>
                The all-island eHealth Hub for Cancer is an all-island partnership 
                on the island of Ireland that is building software and data platforms 
                using best practice open science international health data standards 
                to unlock and share health data, to grow clinical cancer research 
                and improve cancer care.
              </p>
            </div>

            <div className="hero-cta">
              <Link to="/about" className="cta-button primary">
                Learn More
                <ChevronRight size={20} />
              </Link>
              <Link to="/projects" className="cta-button secondary">
                View Projects
                <Database size={20} />
              </Link>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-number">€4M</span>
                <span className="stat-label">Funding</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">10</span>
                <span className="stat-label">PhD Students</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">4</span>
                <span className="stat-label">Post Doctoral Fellow</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">7</span>
                <span className="stat-label">Research Assistants</span>
              </div>
            </div>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Database size={32} />
              </div>
              <h3>Data Science</h3>
              <p>Advanced analytics and machine learning for healthcare insights</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Cloud size={32} />
              </div>
              <h3>Cloud Computing</h3>
              <p>Scalable infrastructure for secure data processing</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Microscope size={32} />
              </div>
              <h3>Clinical Research</h3>
              <p>Evidence-based approaches to improve patient care</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Network size={32} />
              </div>
              <h3>Data Integration</h3>
              <p>Seamless connectivity across healthcare systems</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;