import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Home,
  Mail,
  ChevronRight,
  ExternalLink,
  Twitter,
  Github,
  Linkedin,
} from "lucide-react";
import DOMPurify from "dompurify";
import { useGlobalData } from "../globaldatacontext";
import Loader from "../loader";
import "./Profile.css";

const Index = () => {
  const { slug } = useParams();
  const {
    personInformation,
    loading,
    progress,
    error,
    fetchPersonInformation,
    resetPersonInformation,
  } = useGlobalData();

  // Fetch the person's information when the slug changes
  useEffect(() => {
    if (slug) {
      fetchPersonInformation(slug);
    }
  }, [slug, fetchPersonInformation]);

  // Reset personInformation on unmount to clear stale data
  useEffect(() => {
    return () => {
      if (resetPersonInformation) {
        resetPersonInformation();
      }
    };
  }, [resetPersonInformation]);

  if (loading) return <Loader percentage={progress} dataName="person" />;
  if (error) return <p>Error: {error}</p>;

  // Use the full_name for breadcrumb, falling back to a default text if it's not available.
  const fullName = personInformation?.full_name || "Profile Not Found";

  return (
    <div className="profile-container">
      {/* Breadcrumb Navigation */}
      <nav className="breadcrumb">
        <Link to="/people">People</Link>
        <ChevronRight size={16} />
        <Link to="/people">Directory</Link>
        <ChevronRight size={16} />
        <span>{fullName}</span>
      </nav>

      {/* If there's no personInformation (profile not found), show fallback content */}
      {!personInformation ? (
        <p>No data available for this person.</p>
      ) : (
        <>
          {/* Hero Section */}
          <div className="profile-hero">
            <div className="hero-content">
              {personInformation.image && (
                <div className="hero-image-wrapper hero-left">
                  <img
                    src={personInformation.image}
                    alt={fullName}
                    className="hero-image"
                  />
                </div>
              )}

              <div className="hero-right">
                <h1>{fullName}</h1>
                {personInformation.role_badge && (
                  <div className="role-badges">
                    {personInformation.role_badge.map((badge, index) => (
                      <span
                        key={index}
                        className={`role-badge ${badge
                          .toLowerCase()
                          .replace(/ /g, "-")}`}
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                )}

                {personInformation.institution && (
                  <div className="institution-info">
                    <h2>Institution</h2>
                    <p>{personInformation.institution}</p>
                  </div>
                )}

                <div className="contact-actions">
                  {personInformation.homepage_url && (
                    <a
                      href={personInformation.homepage_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="action-button homepage"
                    >
                      <Home size={20} />
                      <span>Homepage</span>
                      <ExternalLink size={16} />
                    </a>
                  )}
                  {personInformation.email && (
                    <a
                      href={`mailto:${personInformation.email}`}
                      className="action-button email"
                    >
                      <Mail size={20} />
                      <span>Email</span>
                    </a>
                  )}
                </div>

                {personInformation.social_links && (
                  <div className="social-links">
                    {personInformation.social_links.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`social-button ${link.name.toLowerCase()}`}
                      >
                        {link.name === "Twitter" && <Twitter size={20} />}
                        {link.name === "GitHub" && <Github size={20} />}
                        {link.name === "LinkedIn" && <Linkedin size={20} />}
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
            {/* About Section with Fallback */}
            <section className="content-section about-section">
              <div className="section-header">
                <h2>About</h2>
                <div className="section-line"></div>
              </div>
              <div className="section-content">
                {personInformation.about_user ? (
                  <div
                    className="bio-paragraph"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(personInformation.about_user),
                    }}
                  />
                ) : (
                  <p>No additional information available.</p>
                )}
              </div>
              {personInformation.areas_of_expertise &&
                personInformation.areas_of_expertise.length > 0 && (
                  <div className="expertise-section">
                    <h3>Areas of Expertise</h3>
                    <ul className="expertise-list">
                      {personInformation.areas_of_expertise.map((item, index) => (
                        <li key={index} className="expertise-item">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              {personInformation.research_areas &&
                personInformation.research_areas.length > 0 && (
                  <div className="research-areas-section">
                    <h3>Key Research Areas</h3>
                    <div className="research-areas-grid">
                      {personInformation.research_areas.map((area, index) => (
                        <div key={index} className="research-area-card">
                          <h4>{area.name}</h4>
                          <p>{area.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              {personInformation.key_initiatives &&
                personInformation.key_initiatives.length > 0 && (
                  <div className="key-initiatives">
                    <h3>Key Initiatives</h3>
                    <div className="initiatives-grid">
                      {personInformation.key_initiatives.map((initiative, index) => (
                        <a
                          key={index}
                          href={initiative.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="initiative-card"
                        >
                          <span className="initiative-title">
                            {initiative.name}
                          </span>
                          <ExternalLink size={16} />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              <div className="credentials-section">
                {personInformation.qualifications &&
                  personInformation.qualifications.length > 0 && (
                    <div className="qualifications">
                      <h3>Qualifications</h3>
                      <ul className="credentials-list">
                        {personInformation.qualifications.map((qual, index) => (
                          <li key={index} className="credential-item">
                            {qual}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                {personInformation.memberships &&
                  personInformation.memberships.length > 0 && (
                    <div className="memberships">
                      <h3>Professional Memberships</h3>
                      <ul className="credentials-list">
                        {personInformation.memberships.map((membership, index) => (
                          <li key={index} className="credential-item">
                            {membership}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
            </section>

            {personInformation.research_interests &&
              personInformation.research_interests.length > 0 && (
                <section className="content-section interests-section">
                  <div className="section-header">
                    <h2>Research Interests</h2>
                    <div className="section-line"></div>
                  </div>
                  <div className="interests-grid">
                    {personInformation.research_interests.map((interest, index) => (
                      <div
                        key={index}
                        className="interest-card"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="interest-content">
                          <span className="interest-number">
                            {(index + 1).toString().padStart(2, "0")}
                          </span>
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
        </>
      )}
    </div>
  );
};

export default Index;
