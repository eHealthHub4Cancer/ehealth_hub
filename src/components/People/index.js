import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Mail, ChevronRight, ExternalLink, Twitter, Github, Linkedin } from 'lucide-react';
import './Profile.css';
import { useParams } from 'react-router-dom';

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
        const data = require(`./${slug}.json`);
        setProfile(data.profile);
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
    name, image,
    institution, role_badges,
    homepage_url, email,
    affiliations,
    bio, expertise,
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
        <span>{name}</span>
      </nav>

      {/* Hero Section */}
      <div className="profile-hero">
        <div className="hero-content">
          {image && (
            <div className="hero-image-wrapper hero-left">
              <img src={require(`../../Images/People/${image}`)} alt={name} className="hero-image" />
            </div>
          )}

          <div className="hero-right">
            <h1>{name}</h1>
            {role_badges && (
              <div className="role-badges">
                {role_badges.map((badge, index) => (
                  <span key={index} className={`role-badge ${badge.toLowerCase().replace(/ /g, '-')}`}>{badge}</span>
                ))}
              </div>
            )}

            {institution && (
              <div className="institution-info">
                <h2>Institution</h2>
                <p>{institution.title}, {institution.location}</p>
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
        {bio && (
          <section className="content-section about-section">
            <div className="section-header">
              <h2>About</h2>
              <div className="section-line"></div>
            </div>
            <div className="section-content">
              {bio.map((paragraph, index) => (
                <p key={index} className="bio-paragraph">{paragraph}</p>
              ))}

             {supervisors && (
                <div className="affiliations-list">
                  <h3>Supervisors</h3>
                  <ul>
                    {supervisors.map((affiliation, index) => (
                      <li key={index}>{affiliation}</li>
                    ))}
                  </ul>
                </div>
              )}

              {affiliations && (
                <div className="affiliations-list">
                  <h3>Current Positions</h3>
                  <ul>
                    {affiliations.map((affiliation, index) => (
                      <li key={index}>{affiliation}</li>
                    ))}
                  </ul>
                </div>
              )}

              {research_focus && (
                <div className="research-focus-section">
                    <h3>Research focus</h3>
                    <div className="research-focus-grid">
                    {research_focus.map((focus, index) => (
                    <div key={index} className="research-focus-card">
                        <h4>{focus.title}</h4>
                        <p>{focus.description}</p>
                    </div>
                    ))}
                    </div>
                </div>
              )}

            {research_areas &&
            <div className="research-areas-section">
            <h3>Key Research Areas</h3>
            <div className="research-areas-grid">
                {research_areas.map((area, index) => (
                <div key={index} className="research-area-card">
                    <h4>{area.title}</h4>
                    <p>{area.description}</p>
                </div>
                ))}
            </div>
            </div>
            }

            {expertise &&
            <div className="expertise-section">
            <h3>Areas of Expertise</h3>
            <ul className="expertise-list">
              {expertise.map((item, index) => (
                <li key={index} className="expertise-item">
                  {item}
                </li>
              ))}
            </ul>
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
            
            {positions &&
            <div className="positions-section">
              <h3>Current Positions</h3>
              <ul className="positions-list">
                {positions.map((position, index) => (
                  <li key={index} className="position-item">
                    {position}
                  </li>
                ))}
              </ul>
            </div>
            }
            {key_initiatives &&
            <div className="key-initiatives">
              <h3>Key Initiatives</h3>
              <div className="initiatives-grid">
                {key_initiatives.map((initiative, index) => (
                  <a 
                    key={index}
                    href={initiative.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="initiative-card"
                  >
                    <span className="initiative-title">{initiative.title}</span>
                    <ExternalLink size={16} />
                  </a>
                ))}
              </div>
            </div>
            }
              {associated_institutions && (
                <div className="external-links">
                  <h3>Associated Institutions</h3>
                  <div className="institution-links">
                    {associated_institutions.map((institution, index) => (
                      <a 
                        key={index}
                        href={institution.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {institution.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}
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