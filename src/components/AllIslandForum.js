// src/pages/AllIslandForum.jsx
import React, { useState, useEffect } from 'react';
import { getForumData } from '../services/forumService';
import './AllIslandForum.css';

const AllIslandForum = () => {
  const [loading, setLoading] = useState(true);
  const [forums, setForums] = useState([]);
  const [activeYear, setActiveYear] = useState(null);

  useEffect(() => {
    loadForumData();
  }, []);

  const loadForumData = async () => {
    setLoading(true);
    try {
      // Check for forums from 2024 to 2028
      const years = [2024, 2025, 2026, 2027, 2028]; // Oldest to newest
      const forumsData = [];
      
      for (const year of years) {
        const data = await getForumData(year.toString());
        if (data) {
          forumsData.push(data);
        }
      }
      
      if (forumsData.length > 0) {
        setForums(forumsData);
        // Set active year to the latest one (newest year)
        setActiveYear(forumsData[forumsData.length - 1].year.toString());
      }
    } catch (error) {
      console.error('Error loading forum data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format text with paragraphs
  const formatTextWithParagraphs = (text) => {
    if (!text) return null;
    
    // Split by double newlines to create paragraphs
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim());
    
    return paragraphs.map((paragraph, index) => (
      <p key={index} style={{ marginBottom: index < paragraphs.length - 1 ? '16px' : '0' }}>
        {paragraph.trim()}
      </p>
    ));
  };

  if (loading) {
    return (
      <div className="forum-loading-container">
        <div className="forum-spinner"></div>
        <p>Loading forum information...</p>
      </div>
    );
  }

  if (forums.length === 0) {
    return (
      <div className="forum-empty-state">
        <div className="empty-icon">📅</div>
        <h2>All-Island Forum on Cancer</h2>
        <p>Forum information will be available soon.</p>
      </div>
    );
  }

  // Get current forum data
  const currentForum = forums.find(f => f.year.toString() === activeYear);
  const hasMultipleYears = forums.length > 1;

  return (
    <div className="forum-page">
      {/* Header Section */}
      <div className="forum-header">
        <div className="forum-header-content">
          <h1 className="forum-main-title">All-Island Forum on Cancer Data</h1>
          <p className="forum-subtitle">{currentForum?.subtitle || 'From Data to Impact: Roadmap for Cancer Data'}</p>
        </div>
      </div>

      {/* Year Selector */}
      {hasMultipleYears && (
        <div className="year-toggle-container">
          <div className="year-toggle">
            {forums.map((forum) => (
              <button 
                key={forum.year}
                className={activeYear === forum.year.toString() ? 'active' : ''} 
                onClick={() => setActiveYear(forum.year.toString())}
              >
                {forum.year} Forum
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="forum-container">
        {currentForum && (
          <>
            {/* Hero Card */}
            <div className="hero-card">
              {currentForum.coverImage && (
                <div className="hero-image">
                  <img src={currentForum.coverImage} alt={currentForum.title} />
                </div>
              )}
              <div className="hero-content">
                <div className="hero-badge">
                  {currentForum.status === 'upcoming' && '🗓️ Upcoming Event'}
                  {currentForum.status === 'ongoing' && '🔴 Live Event'}
                  {currentForum.status === 'past' && '📅 Past Event'}
                </div>
                <h2 className="hero-title">{currentForum.title}</h2>
                <div className="hero-info">
                  <div className="info-item">
                    <span className="info-icon">📅</span>
                    <span>{currentForum.date}</span>
                  </div>
                  {currentForum.venue && (
                    <div className="info-item">
                      <span className="info-icon">📍</span>
                      <span>{currentForum.venue}</span>
                    </div>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="hero-buttons">
                  {currentForum.registrationLink && currentForum.status === 'upcoming' && (
                    <a href={currentForum.registrationLink} target="_blank" rel="noopener noreferrer" className="register-btn">
                      Register Now
                    </a>
                  )}
                  {currentForum.posterSubmissionOpen && currentForum.submitAbstractLink && currentForum.status === 'upcoming' && (
                    <a href={currentForum.submitAbstractLink} target="_blank" rel="noopener noreferrer" className="submit-abstract-btn">
                      Submit Poster Abstract
                    </a>
                  )}
                </div>

                {/* Registration Note - Only for 2026 */}
                {currentForum.year === 2026 && currentForum.status === 'upcoming' && (
                  <div style={{ 
                    marginTop: '24px', 
                    padding: '16px 24px',
                    background: '#f0f7ff',
                    borderRadius: '8px',
                    borderLeft: '4px solid #3B6B8F'
                  }}>
                    <p style={{ 
                      margin: '0',
                      fontSize: '15px', 
                      color: '#2a5570',
                      fontWeight: '500',
                      textAlign: 'center'
                    }}>
                      Registration is free, but early sign-up is encouraged as places are limited.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Description Card */}
            {currentForum.description && (
              <div className="content-card">
                <div className="card-header">
                  <h3>About the Forum</h3>
                </div>
                <div className="card-body">
                  {formatTextWithParagraphs(currentForum.description)}
                </div>
              </div>
            )}

            {/* Highlights Card */}
            {currentForum.highlights && (
              <div className="content-card highlight-card">
                <div className="card-header">
                  <h3>Key Highlights</h3>
                </div>
                <div className="card-body">
                  {formatTextWithParagraphs(currentForum.highlights)}
                </div>
              </div>
            )}

            {/* Agenda Card */}
            {currentForum.agendaItems && currentForum.agendaItems.length > 0 && (
              <div className="content-card">
                <div className="card-header">
                  <h3>📋 Event Agenda</h3>
                </div>
                <div className="card-body">
                  <div className="agenda-list">
                    {currentForum.agendaItems.map((item, index) => (
                      <div key={item.id || index} className="agenda-item">
                        <div className="agenda-time">{item.time}</div>
                        <div className="agenda-details">
                          <h4>{item.title}</h4>
                          {item.speaker && (
                            <p className="agenda-speaker">
                              <span className="speaker-icon">👤</span>
                              {item.speaker}
                            </p>
                          )}
                          {item.description && (
                            <p className="agenda-description">{item.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Agenda Coming Soon Message - Only for 2026 when no agenda exists */}
            {currentForum.year === 2026 && (!currentForum.agendaItems || currentForum.agendaItems.length === 0) && (
              <div className="content-card">
                <div className="card-header">
                  <h3>📋 Event Agenda</h3>
                </div>
                <div className="card-body">
                  <p style={{ marginBottom: '16px' }}>
                    A full agenda will be shared in the coming weeks. Follow us on{' '}
                    <a 
                      href="https://www.linkedin.com/company/ehealth-hub-for-cancer/posts/?feedView=all&viewAsMember=true" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: '#0077b5', fontWeight: '600', textDecoration: 'none' }}
                    >
                      LinkedIn
                    </a>
                    {' '}for the latest updates and speaker announcements.
                  </p>
                  <p>
                    We look forward to welcoming you back for another engaging and collaborative Forum.
                  </p>
                </div>
              </div>
            )}

            {/* Speakers Card */}
            {currentForum.speakers && currentForum.speakers.length > 0 && (
              <div className="content-card">
                <div className="card-header">
                  <h3>
                    {currentForum.status === 'upcoming' ? 'Confirmed Speakers' : 'Featured Speakers'}
                  </h3>
                </div>
                <div className="card-body">
                  <div className="speakers-grid">
                    {currentForum.speakers.map((speaker, index) => (
                      <div key={speaker.id || index} className="speaker-card">
                        <div className="speaker-info">
                          <h4 className="speaker-name">{speaker.name}</h4>
                          {speaker.title && (
                            <p className="speaker-title">{speaker.title}</p>
                          )}
                          {speaker.organization && (
                            <p className="speaker-org">{speaker.organization}</p>
                          )}
                          {speaker.bio && (
                            <p className="speaker-bio">{speaker.bio}</p>
                          )}
                          {(speaker.linkedIn || speaker.website) && (
                            <div className="speaker-links">
                              {speaker.linkedIn && (
                                <a 
                                  href={speaker.linkedIn} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="speaker-link linkedin"
                                  aria-label={`${speaker.name} LinkedIn profile`}
                                >
                                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                                  </svg>
                                  LinkedIn
                                </a>
                              )}
                              {speaker.website && (
                                <a 
                                  href={speaker.website} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="speaker-link website"
                                  aria-label={`${speaker.name} personal website`}
                                >
                                  🌐 Website
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Posters Card - Simplified for upcoming events */}
            {currentForum.status === 'past' && currentForum.posters && currentForum.posters.length > 0 && (
              <div className="content-card">
                <div className="card-header">
                  <h3>📄 Presented Posters</h3>
                </div>
                <div className="card-body">
                  <div className="posters-list">
                    {currentForum.posters.map((poster, index) => (
                      <div key={poster.id || index} className="poster-item">
                        <div className="poster-content">
                          <h4 className="poster-title">{poster.title}</h4>
                          <p className="poster-author">
                            <strong>Author:</strong> {poster.author}
                          </p>
                          {poster.affiliations && (
                            <p className="poster-affiliations">
                              <strong>Affiliations:</strong> {poster.affiliations}
                            </p>
                          )}
                        </div>
                        {poster.posterLink && (
                          <a href={poster.posterLink} target="_blank" rel="noopener noreferrer" className="view-poster-btn">
                            📄 View Poster
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Resources Section */}
            {((currentForum.blogLinks && currentForum.blogLinks.length > 0) || 
              (currentForum.newsLinks && currentForum.newsLinks.length > 0)) && (
              <div className="content-card">
                <div className="card-header">
                  <h3>📚 Resources & Coverage</h3>
                </div>
                <div className="card-body">
                  {/* Blog Links */}
                  {currentForum.blogLinks && currentForum.blogLinks.length > 0 && (
                    <div className="resource-section">
                      <h4 className="resource-title">Blog Posts</h4>
                      <div className="resource-grid">
                        {currentForum.blogLinks.map((link, index) => (
                          <a 
                            key={link.id || index} 
                            href={link.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="resource-link"
                          >
                            <span className="resource-icon">📝</span>
                            <span className="resource-text">{link.title}</span>
                            <span className="arrow">→</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* News Links */}
                  {currentForum.newsLinks && currentForum.newsLinks.length > 0 && (
                    <div className="resource-section">
                      <h4 className="resource-title">News Coverage</h4>
                      <div className="resource-grid">
                        {currentForum.newsLinks.map((link, index) => (
                          <a 
                            key={link.id || index} 
                            href={link.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="resource-link"
                          >
                            <span className="resource-icon">📰</span>
                            <span className="resource-text">{link.title}</span>
                            <span className="arrow">→</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Media Gallery Card */}
            {currentForum.mediaGalleryUrl && (
              <div className="content-card gallery-card">
                <div className="card-header">
                  <h3>📷 Photo Gallery</h3>
                </div>
                <div className="card-body">
                  <p>View photos and highlights from the forum</p>
                  <a href={currentForum.mediaGalleryUrl} target="_blank" rel="noopener noreferrer" className="gallery-btn">
                    View Gallery
                  </a>
                </div>
              </div>
            )}

            {/* Sponsors Section */}
            {currentForum.sponsors && currentForum.sponsors.length > 0 && (
              <div className="content-card sponsors-card">
                <div className="card-header">
                  <h3>🤝 Thanks to Our Sponsors</h3>
                </div>
                <div className="card-body">
                  <div className="sponsors-grid">
                    {/* Group sponsors by tier */}
                    {['platinum', 'gold', 'silver', 'bronze', 'standard'].map(tier => {
                      const tierSponsors = currentForum.sponsors.filter(s => s.tier === tier);
                      if (tierSponsors.length === 0) return null;
                      
                      return (
                        <div key={tier} className={`sponsor-tier-group ${tier}`}>
                          <h4 className="sponsor-tier-title">
                            {tier.charAt(0).toUpperCase() + tier.slice(1)} Sponsors
                          </h4>
                          <div className="sponsor-logos">
                            {tierSponsors.map((sponsor, index) => (
                              <div key={sponsor.id || index} className="sponsor-logo-item">
                                {sponsor.website ? (
                                  <a 
                                    href={sponsor.website} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    title={sponsor.name}
                                    className="sponsor-link"
                                  >
                                    {sponsor.logo ? (
                                      <img 
                                        src={sponsor.logo} 
                                        alt={sponsor.name} 
                                        className={`sponsor-logo ${tier}`}
                                      />
                                    ) : (
                                      <div className="sponsor-name">{sponsor.name}</div>
                                    )}
                                  </a>
                                ) : (
                                  sponsor.logo ? (
                                    <img 
                                      src={sponsor.logo} 
                                      alt={sponsor.name} 
                                      className={`sponsor-logo ${tier}`}
                                    />
                                  ) : (
                                    <div className="sponsor-name">{sponsor.name}</div>
                                  )
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AllIslandForum;