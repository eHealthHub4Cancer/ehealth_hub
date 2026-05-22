// src/components/FirebaseNewsArticle.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ChevronLeft, Calendar, User, ExternalLink, MapPin,
  Briefcase, GraduationCap, Clock, Building, Globe
} from 'lucide-react';
import { ClipLoader } from 'react-spinners';
import { getArticleBySlug } from '../services/newsService';
import './FirebaseNewsArticle.css';

const FirebaseNewsArticle = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const override = {
    display: "block",
    margin: "100px auto",
    borderColor: "#1a3e5a",
  };

  useEffect(() => {
    loadArticle();
  }, [slug]);

  const loadArticle = async () => {
    setLoading(true);
    try {
      const data = await getArticleBySlug(slug);
      if (!data) {
        setError('Article not found');
      } else {
        setArticle(data);
        setError(null);
      }
    } catch (err) {
      console.error('Error loading article:', err);
      setError('Failed to load article. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleExternalLink = (e, url) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="fb-article-container">
        <div className="loading-container">
          <ClipLoader
            color="#1a3e5a"
            loading={loading}
            cssOverride={override}
            size={50}
            aria-label="Loading Spinner"
          />
          <p>Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="fb-article-container">
        <div className="error-container">
          <h2>{error || 'Article Not Found'}</h2>
          <Link to="/news-new" className="back-link">
            <ChevronLeft size={20} />
            Back to News
          </Link>
        </div>
      </div>
    );
  }

  const renderEventDetails = () => {
    const details = article.eventDetails || {};
    const hasDetails = Object.values(details).some(v => v && v.trim());

    if (!hasDetails) return null;

    switch (article.type) {
      case 'research':
        return (
          <div className="event-details-grid">
            {details.Publication && (
              <div className="event-detail-card">
                <Globe size={24} />
                <div>
                  <h3>Publication</h3>
                  <p>{details.Publication}</p>
                </div>
              </div>
            )}
            {details.PublishDate && (
              <div className="event-detail-card">
                <Calendar size={24} />
                <div>
                  <h3>Publish Date</h3>
                  <p>{details.PublishDate}</p>
                </div>
              </div>
            )}
            {details.ImageCaption && (
              <div className="event-detail-card">
                <User size={24} />
                <div>
                  <h3>Image Caption</h3>
                  <p>{details.ImageCaption}</p>
                </div>
              </div>
            )}
          </div>
        );

      case 'job':
        return (
          <div className="job-details">
            <div className="job-meta-grid">
              {details.Institution && (
                <div className="job-meta-item">
                  <Building size={20} />
                  <span>{details.Institution}</span>
                </div>
              )}
              {details.Location && (
                <div className="job-meta-item">
                  <MapPin size={20} />
                  <span>{details.Location}</span>
                </div>
              )}
              {details.ClosingDate && (
                <div className="job-meta-item">
                  <Clock size={20} />
                  <span>Closing: {details.ClosingDate}</span>
                </div>
              )}
            </div>
            <div className="job-info-grid">
              {details.PositionLevel && (
                <div className="job-info-card">
                  <Briefcase size={24} />
                  <div>
                    <h3>Position Level</h3>
                    <p>{details.PositionLevel}</p>
                  </div>
                </div>
              )}
              {details.Department && (
                <div className="job-info-card">
                  <GraduationCap size={24} />
                  <div>
                    <h3>Department</h3>
                    <p>{details.Department}</p>
                  </div>
                </div>
              )}
              {details.ContractType && (
                <div className="job-info-card">
                  <Calendar size={24} />
                  <div>
                    <h3>Contract Type</h3>
                    <p>{details.ContractType}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'conference':
        return (
          <div className="event-details-grid">
            {details.Location && (
              <div className="event-detail-card">
                <MapPin size={24} />
                <div>
                  <h3>Location</h3>
                  <p>{details.Location}</p>
                </div>
              </div>
            )}
            {details.Date && (
              <div className="event-detail-card">
                <Calendar size={24} />
                <div>
                  <h3>Date</h3>
                  <p>{details.Date}</p>
                </div>
              </div>
            )}
            {details.Type && (
              <div className="event-detail-card">
                <Globe size={24} />
                <div>
                  <h3>Type</h3>
                  <p>{details.Type}</p>
                </div>
              </div>
            )}
          </div>
        );

      case 'presentation':
        return (
          <div className="speaker-info">
            {(details.Speaker || details.Role) && (
              <div className="speaker-card">
                <h3>About the Speaker</h3>
                <p>{details.Speaker}{details.Role && `, ${details.Role}`}</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fb-article-container">
      <nav className="article-breadcrumb">
        <Link to="/news-new" className="breadcrumb-link">News</Link>
        <ChevronLeft size={16} />
        <span>{article.title}</span>
      </nav>

      <article className="article-content">
        {/* Header */}
        <header className="article-header">
          <div className="article-categories">
            {article.categories?.map((cat, index) => (
              <span key={index} className="category-tag">{cat}</span>
            ))}
          </div>
          <h1>{article.title}</h1>
          <div className="article-meta">
            {article.date && (
              <div className="meta-item">
                <Calendar size={18} />
                <span>{article.date}</span>
              </div>
            )}
            {article.author && (
              <div className="meta-item">
                <User size={18} />
                <span>{article.author}</span>
              </div>
            )}
          </div>
        </header>

        {/* Featured Image */}
        {article.imageUrl && (
          <div className="article-image-container">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="article-image"
            />
            {article.eventDetails?.ImageCaption && (
              <div className="image-caption">
                {article.eventDetails.ImageCaption}
              </div>
            )}
          </div>
        )}

        {/* Event Details */}
        {renderEventDetails()}

        {/* Excerpt */}
        {article.excerpt && (
          <div className="article-summary">
            {article.excerpt}
          </div>
        )}

        {/* Main Content */}
        {article.content && (
          <div
            className="article-body"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        )}

        {/* Key Points */}
        {article.keyPoints && article.keyPoints.length > 0 && (
          <div className="key-findings">
            <h2>Key Points</h2>
            <ul>
              {article.keyPoints.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Related Links */}
        {article.relatedLinks && article.relatedLinks.length > 0 && (
          <div className="related-links">
            <h2>Related Links</h2>
            <div className="links-grid">
              {article.relatedLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  className="related-link"
                  onClick={(e) => handleExternalLink(e, link.url)}
                >
                  <span>{link.title}</span>
                  <ExternalLink size={16} />
                </a>
              ))}
            </div>
          </div>
        )}
      </article>

      <div className="article-footer">
        <Link to="/news-new" className="back-to-news">
          <ChevronLeft size={20} />
          <span>Back to News</span>
        </Link>
      </div>
    </div>
  );
};

export default FirebaseNewsArticle;
