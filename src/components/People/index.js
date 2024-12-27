import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Home, Mail, ChevronRight, ExternalLink, Twitter, Github, Linkedin } from "lucide-react";
import "./Profile.css";
import { useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import { useGlobalData } from "../globaldatacontext";
import Loader from "../loader";

const Index = () => {
  const { slug } = useParams();
  const { personInformation, loading, progress, error, fetchPersonInformation } = useGlobalData();

  // Fetch person information when the slug changes
  useEffect(() => {
    if (slug) {
      fetchPersonInformation(slug);
    }
  }, [slug, fetchPersonInformation]);

  // Handle loading and error states
  if (loading) return <Loader percentage={progress} dataName="person" />;
  if (error) return <p>Error: {error}</p>;
  if (!personInformation && !loading) {
    return <p>No data available for this person.</p>;
  }

  const {
    people, image,
    full_name,
    institution, role_badge,
    homepage_url, email,
    about_user, areas_of_expertise,
    research_interests, memberships,
    research_areas, qualifications,
    key_initiatives,
    social_links
  } = personInformation;

  // console.log(profile.areas_of_expertise)

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

            {areas_of_expertise && areas_of_expertise.length > 0 &&
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
             {research_areas && research_areas.length > 0 &&
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
            {key_initiatives && key_initiatives.length > 0 &&
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
                {qualifications && qualifications.length > 0 &&
                <div className="qualifications">
                <h3>Qualifications</h3>
                <ul className="credentials-list">
                  {qualifications.map((qual, index) => (
                    <li key={index} className="credential-item">{qual}</li>
                  ))}
                </ul>
              </div>
                }

                {memberships && memberships.length > 0 &&
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
      {research_interests && research_interests.length > 0 && (
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