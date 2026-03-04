import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Users, Share2, Database, Cloud, Microscope, Network, ChevronRight } from 'lucide-react';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hs-section">
      <div className="hs-inner">
        <div className="hs-grid">

          {/* ── Left column ── */}
          <div className="hs-left">
            <div className="hs-text">
              <span className="hs-eyebrow">All-Island Cancer Research Platform</span>
              <h1 className="hs-title">The eHealth-Hub<br/>for Cancer</h1>
              <h2 className="hs-subtitle">Transforming Healthcare Data</h2>
              <p className="hs-subheading">Unified harmonized health data for network cancer research studies</p>
              <div className="hs-accent-line"></div>
            </div>

            <div className="hs-badges">
              <div className="hs-badge">
                <Shield className="hs-badge-icon" size={16} />
                <span>Secure Data</span>
              </div>
              <div className="hs-badge">
                <Users className="hs-badge-icon" size={16} />
                <span>All-Island Partnership</span>
              </div>
              <div className="hs-badge">
                <Share2 className="hs-badge-icon" size={16} />
                <span>Open Science</span>
              </div>
            </div>

            <p className="hs-description">
              The all-island eHealth Hub for Cancer is an all-island partnership
              on the island of Ireland that is building software and data platforms
              using best practice open science international health data standards
              to unlock and share health data, to grow clinical cancer research
              and improve cancer care.
            </p>

            <div className="hs-cta">
              <Link to="/about" className="hs-btn hs-btn-primary">
                Learn More <ChevronRight size={18} />
              </Link>
              <Link to="/projects" className="hs-btn hs-btn-secondary">
                View Projects <Database size={16} />
              </Link>
            </div>

            <div className="hs-stats">
              <div className="hs-stat">
                <span className="hs-stat-num">€4M</span>
                <span className="hs-stat-lbl">Funding</span>
              </div>
              <div className="hs-stat">
                <span className="hs-stat-num">10</span>
                <span className="hs-stat-lbl">PhD Students</span>
              </div>
              <div className="hs-stat">
                <span className="hs-stat-num">4</span>
                <span className="hs-stat-lbl">Post Doctoral Fellows</span>
              </div>
              <div className="hs-stat">
                <span className="hs-stat-num">7</span>
                <span className="hs-stat-lbl">Research Assistants</span>
              </div>
            </div>
          </div>

          {/* ── Right column — feature cards ── */}
          <div className="hs-features">
            <div className="hs-feature">
              <div className="hs-feature-icon"><Database size={28} /></div>
              <h3>Data Science</h3>
              <p>Advanced analytics and machine learning for healthcare insights</p>
            </div>
            <div className="hs-feature">
              <div className="hs-feature-icon"><Cloud size={28} /></div>
              <h3>Cloud Computing</h3>
              <p>Scalable infrastructure for secure data processing</p>
            </div>
            <div className="hs-feature">
              <div className="hs-feature-icon"><Microscope size={28} /></div>
              <h3>Clinical Research</h3>
              <p>Evidence-based approaches to improve patient care</p>
            </div>
            <div className="hs-feature">
              <div className="hs-feature-icon"><Network size={28} /></div>
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