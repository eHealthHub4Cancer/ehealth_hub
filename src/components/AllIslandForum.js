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
        // Set active year to the first one (2024 if exists)
        setActiveYear(forumsData[0].year.toString());
      }
    } catch (error) {
      console.error('Error loading forum data:', error);
    } finally {
      setLoading(false);
    }
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
                  {currentForum.status === 'past' && '✅ Past Event'}
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
                {currentForum.registrationLink && currentForum.status === 'upcoming' && (
                  <a href={currentForum.registrationLink} target="_blank" rel="noopener noreferrer" className="register-btn">
                    Register Now
                  </a>
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
                  <p>{currentForum.description}</p>
                </div>
              </div>
            )}

            {/* Highlights Card */}
            {currentForum.highlights && (
              <div className="content-card highlight-card">
                <div className="card-header">
                  <h3>✨ Key Highlights</h3>
                </div>
                <div className="card-body">
                  <p>{currentForum.highlights}</p>
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

            {/* Speakers Card */}
            {currentForum.speakers && currentForum.speakers.length > 0 && (
              <div className="content-card">
                <div className="card-header">
                  <h3>
                    {currentForum.status === 'upcoming' ? '🎤 Confirmed Speakers' : '🎤 Featured Speakers'}
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
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Posters Card */}
            {currentForum.posters && currentForum.posters.length > 0 && (
              <div className="content-card">
                <div className="card-header">
                  <h3>
                    {currentForum.status === 'upcoming' ? '📄 Poster Submissions' : '📄 Presented Posters'}
                  </h3>
                </div>
                <div className="card-body">
                  {currentForum.status === 'upcoming' && currentForum.submitAbstractLink && (
                    <div className="poster-submission-notice">
                      <p>Submit your poster abstract for consideration at the forum.</p>
                      <a href={currentForum.submitAbstractLink} target="_blank" rel="noopener noreferrer" className="submit-poster-btn">
                        Submit Your Abstract
                      </a>
                    </div>
                  )}
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
                  <h3>📸 Photo Gallery</h3>
                </div>
                <div className="card-body">
                  <p>View photos and highlights from the forum</p>
                  <a href={currentForum.mediaGalleryUrl} target="_blank" rel="noopener noreferrer" className="gallery-btn">
                    View Gallery
                  </a>
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