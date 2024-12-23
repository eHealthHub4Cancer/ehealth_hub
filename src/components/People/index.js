import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Mail, ChevronRight, ExternalLink, Twitter, Github, Linkedin } from 'lucide-react';
import './Profile.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import API_ENDPOINTS from "../api/config";
import DOMPurify from "dompurify";



  const Index = () => {
  const { slug } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!slug) {
        console.warn('No slug provided. Skipping profile fetch.');
        return;
      }

      // Fetch profile data based on the slug
      try {
        const response = await axios.get(`${API_ENDPOINTS.PEOPLE_INFORMATION}${slug}/`, { withCredentials: true });
        const data = response.data;
        setProfile(data);
        console.log(data)
        // console.log(data.profile)
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [slug]);  

  if (!profile) {
    return <div>Loading...</div>;
  }

  const {
    people, image,
    full_name,
    institution, role_badge,
    homepage_url, email,
    affiliations,
    about_user, areas_of_expertise,
    research_focus,
    research_interests, memberships,
    research_areas, qualifications,
    positions, key_initiatives,
    supervisors,
    associated_institutions,
    social_links
  } = profile;

  return (
    <div className="profile-container">
      {/* Breadcrumb Navigation */}
      <nav className="breadcrumb">
        <Link to="/">People</Link>
        <ChevronRight size={16} />
        <Link to="/people">Directory</Link>
        <ChevronRight size={16} />
        <span>{people}</span>
      </nav>

      {/* Hero Section */}
      <div className="profile-hero">
        <div className="hero-content">
          {image && (
            <div className="hero-image-wrapper hero-left">
              <img src={image} alt={people} className="hero-image" />
            </div>
          )}

          <div className="hero-right">
            <h1>{full_name}</h1>
            {role_badge && (
              <div className="role-badges">
                {role_badge.map((badge, index) => (
                  <span key={index} className={`role-badge ${badge.toLowerCase().replace(/ /g, '-')}`}>{badge}</span>
                ))}
              </div>

            )}

            {institution && (
              <div className="institution-info">
                <h2>Institution</h2>
                <p>{institution}</p>
              </div>
            )}

            <div className="contact-actions">
              {homepage_url && (
                <a 
                  href={homepage_url}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="action-button homepage"
                >
                  <Home size={20} />
                  <span>Homepage</span>
                  <ExternalLink size={16} />
                </a>
              )}
              {email && (
                <a 
                  href={`mailto:${email}`}
                  className="action-button email"
                >
                  <Mail size={20} />
                  <span>Email</span>
                </a>
              )}
            </div>

            {social_links && (
              <div className="social-links">
                {social_links.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`social-button ${link.name.toLowerCase()}`}
                  >
                    {link.name === 'Twitter' && <Twitter size={20} />}
                    {link.name === 'GitHub' && <Github size={20} />}
                    {link.name === 'LinkedIn' && <Linkedin size={20} />}
                    <span>{link.name}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Main Content Sections */}
      <div className="profile-sections">
        {/* About Section */}
        {about_user && (
          <section className="content-section about-section">
            <div className="section-header">
              <h2>About</h2>
              <div className="section-line"></div>
            </div>
            <div className="section-content">
              <div 
                className="bio-paragraph" 
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(about_user) }}>
              </div>

              {areas_of_expertise &&
            <div className="expertise-section">
            <h3>Areas of Expertise</h3>
            <ul className="expertise-list">
              {areas_of_expertise.map((item, index) => (
                <li key={index} className="expertise-item">
                  {item}
                </li>
              ))}
            </ul>
          </div>
            }
             {research_areas &&
            <div className="research-areas-section">
            <h3>Key Research Areas</h3>
            <div className="research-areas-grid">
                {research_areas.map((area, index) => (
                <div key={index} className="research-area-card">
                    <h4>{area.name}</h4>
                    <p>{area.description}</p>
                </div>
                ))}
            </div>
            </div>
            }
            {key_initiatives &&
            <div className="key-initiatives">
              <h3>Key Initiatives</h3>
              <div className="initiatives-grid">
                {key_initiatives.map((initiative, index) => (
                  <a 
                    key={index}
                    href={initiative.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="initiative-card"
                  >
                    <span className="initiative-title">{initiative.name}</span>
                    <ExternalLink size={16} />
                  </a>
                ))}
              </div>
            </div>
            }
            <div className='credentials-section'>
                {qualifications &&
                <div className="qualifications">
                <h3>Qualifications</h3>
                <ul className="credentials-list">
                  {qualifications.map((qual, index) => (
                    <li key={index} className="credential-item">{qual}</li>
                  ))}
                </ul>
              </div>
                }

                {memberships &&
                <div className="memberships">
                <h3>Professional Memberships</h3>
                <ul className="credentials-list">
                  {memberships.map((membership, index) => (
                    <li key={index} className="credential-item">{membership}</li>
                  ))}
                </ul>
                </div>
                }
            </div>
          </div>
        </section>
      )}
      {/* Research Interests Section */}
      {research_interests && (
          <section className="content-section interests-section">
            <div className="section-header">
              <h2>Research Interests</h2>
              <div className="section-line"></div>
            </div>
            <div className="interests-grid">
              {research_interests.map((interest, index) => (
                <div 
                  key={index} 
                  className="interest-card"
                  style={{
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  <div className="interest-content">
                    <span className="interest-number">{(index + 1).toString().padStart(2, '0')}</span>
                    <span className="interest-text">{interest}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div> 
      {/* Footer Navigation */}
      <div className="profile-footer">
        <Link to="/people" className="back-to-directory">
          ← Back to Directory
        </Link>
      </div>
    </div>
  );
}

export default Index;