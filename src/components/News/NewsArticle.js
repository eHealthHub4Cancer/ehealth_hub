import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ChevronLeft, Calendar, User, ExternalLink, MapPin, Briefcase, 
  GraduationCap, Clock, Building, Users, MonitorPlay, UserCheck, 
  Microscope, Globe 
} from 'lucide-react';
import { ClipLoader } from 'react-spinners';
import Papa from 'papaparse';
import './NewsArticle.css';

// Constants
const CACHE_KEY = 'article_data_cache';
const CACHE_EXPIRY = 60 * 60 * 1000; // 1 hour in milliseconds
const GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSTKMvqBJMCJPvUPIyk1M-l03Yyd57wmo_0pevGrZoHuRIS0qv0r5mwo4WK97gEQWVLXadmrCK5TXVK/pub?gid=226797145&single=true&output=csv';

function NewsArticle() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const override = {
    display: "block",
    margin: "100px auto",
    borderColor: "#1a3e5a",
  };

  const ensureValidUrl = (url) => {
    if (!url) return '#';
    try {
      new URL(url);
      return url;
    } catch {
      return url.startsWith('http') ? url : `https://${url}`;
    }
  };

  const handleExternalLink = (e, url) => {
    e.preventDefault();
    e.stopPropagation();
    const validUrl = ensureValidUrl(url);
    window.open(validUrl, '_blank', 'noopener,noreferrer');
  };

  const splitByPipes = (content) => {
    if (!content) return [];
    const doublePipeSections = content.split('||');
    return doublePipeSections.map((section, sectionIndex) => {
      const singlePipeSections = section.split('|');
      return singlePipeSections.map(subSection => ({
        text: subSection.trim(),
        spacing: sectionIndex < doublePipeSections.length - 1 && 
                 subSection === singlePipeSections[singlePipeSections.length - 1] ? 'large' : 'normal'
      }));
    }).flat();
  };

  const parsePipedContent = (content) => {
    return splitByPipes(content);
  };

  const parseLinks = (linksString) => {
    if (!linksString) return [];
    return splitByPipes(linksString).map(section => {
      const [title, ...urlParts] = section.text.split(':');
      return {
        title: title.trim(),
        url: urlParts.join(':').trim(),
        spacing: section.spacing
      };
    });
  };

  const parseDetails = (detailsString) => {
    if (!detailsString) return {};
    const result = {};
    splitByPipes(detailsString).forEach(section => {
      const [key, ...values] = section.text.split(':');
      if (key) {
        result[key.trim()] = {
          value: values.join(':').trim(),
          spacing: section.spacing
        };
      }
    });
    return result;
  };

  const fetchArticle = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check cache first
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        const { timestamp, data } = JSON.parse(cachedData);
        if (Date.now() - timestamp <= CACHE_EXPIRY) {
          const articleRow = data.find(row => row[6]?.trim() === slug);
          if (articleRow) {
            setArticle({
              title: articleRow[0],
              excerpt: articleRow[1],
              date: articleRow[2],
              author: articleRow[3],
              categories: articleRow[4].split(',').map(cat => cat.trim()),
              image: articleRow[5],
              slug: articleRow[6],
              type: articleRow[7],
              content: parsePipedContent(articleRow[8]),
              eventDetails: parseDetails(articleRow[9]),
              keyPoints: parsePipedContent(articleRow[10]),
              relatedLinks: parseLinks(articleRow[11]),
              additionalResources: parseDetails(articleRow[12])
            });
            setLoading(false);
            return;
          }
        }
      }

      // Fetch fresh data
      const response = await fetch(GOOGLE_SHEET_URL);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const text = await response.text();
      Papa.parse(text, {
        header: false,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.data && results.data.length > 1) {
            const rows = results.data.slice(1);
            const articleRow = rows.find(row => row[6]?.trim() === slug);
            if (!articleRow) {
              throw new Error('Article not found');
            }

            // Cache all rows
            localStorage.setItem(CACHE_KEY, JSON.stringify({
              timestamp: Date.now(),
              data: rows
            }));

            setArticle({
              title: articleRow[0],
              excerpt: articleRow[1],
              date: articleRow[2],
              author: articleRow[3],
              categories: articleRow[4].split(',').map(cat => cat.trim()),
              image: articleRow[5],
              slug: articleRow[6],
              type: articleRow[7],
              content: parsePipedContent(articleRow[8]),
              eventDetails: parseDetails(articleRow[9]),
              keyPoints: parsePipedContent(articleRow[10]),
              relatedLinks: parseLinks(articleRow[11]),
              additionalResources: parseDetails(articleRow[12])
            });
            setError(null);
          } else {
            throw new Error('No data found in the spreadsheet');
          }
        },
        error: (err) => {
          throw new Error(`CSV parsing error: ${err.message}`);
        }
      });
    } catch (err) {
      console.error('Error fetching article:', err);
      setError(err.message);
      // Try using cached data
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        const { data } = JSON.parse(cachedData);
        const articleRow = data.find(row => row[6]?.trim() === slug);
        if (articleRow) {
          setArticle({
            title: articleRow[0],
            excerpt: articleRow[1],
            date: articleRow[2],
            author: articleRow[3],
            categories: articleRow[4].split(',').map(cat => cat.trim()),
            image: articleRow[5],
            slug: articleRow[6],
            type: articleRow[7],
            content: parsePipedContent(articleRow[8]),
            eventDetails: parseDetails(articleRow[9]),
            keyPoints: parsePipedContent(articleRow[10]),
            relatedLinks: parseLinks(articleRow[11]),
            additionalResources: parseDetails(articleRow[12])
          });
          setError(`Using cached data. ${err.message}`);
        } else {
          setError(err.message);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchArticle();
  }, [fetchArticle]);

  if (loading) {
    return (
      <div className="news-article-container" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <ClipLoader
            color="#1a3e5a"
            loading={loading}
            cssOverride={override}
            size={50}
            aria-label="Loading Spinner"
          />
          <p style={{ marginTop: '20px', color: '#1a3e5a' }}>Loading article...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="news-article-container">
        <div style={{ textAlign: 'center', padding: '50px', color: '#dc2626' }}>
          <h2>Error Loading Article</h2>
          <p>{error}</p>
          <Link to="/news" className="back-to-news" style={{ marginTop: '20px', display: 'inline-block' }}>
            <ChevronLeft size={20} />
            <span>Back to News</span>
          </Link>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="news-article-container">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h2>Article Not Found</h2>
          <Link to="/news" className="back-to-news" style={{ marginTop: '20px', display: 'inline-block' }}>
            <ChevronLeft size={20} />
            <span>Back to News</span>
          </Link>
        </div>
      </div>
    );
  }

  const renderArticleContent = () => {
    switch (article.type) {
      case 'job':
        return (
          <>
            <div className="job-header">
              <div className="article-categories">
                {article.categories.map(category => (
                  <span key={category} className="category-tag">{category}</span>
                ))}
              </div>
              <h1>{article.title}</h1>
              <div className="job-meta">
                <div className="meta-item">
                  <Building size={18} />
                  <span>{article.eventDetails.Institution?.value || article.author}</span>
                </div>
                <div className="meta-item">
                  <MapPin size={18} />
                  <span>{article.eventDetails.Location?.value}</span>
                </div>
                <div className="meta-item">
                  <Clock size={18} />
                  <span>Closing: {article.eventDetails['Closing Date']?.value}</span>
                </div>
              </div>
            </div>
            <div className="campus-showcase">
              <img 
                src={article.image} 
                alt={article.title} 
                className="campus-image"
                loading="lazy" // Added lazy loading
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/placeholder-image.jpg';
                }} 
              />
            </div>

            <div className="job-content">
              <div className="key-details">
                <div className="detail-card">
                  <Briefcase size={24} />
                  <div>
                    <h3>Position Level</h3>
                    <p>{article.eventDetails['Position Level']?.value}</p>
                  </div>
                </div>
                <div className="detail-card">
                  <GraduationCap size={24} />
                  <div>
                    <h3>Department</h3>
                    <p>{article.eventDetails.Department?.value}</p>
                  </div>
                </div>
                <div className="detail-card">
                  <Calendar size={24} />
                  <div>
                    <h3>Contract Type</h3>
                    <p>{article.eventDetails['Contract Type']?.value}</p>
                  </div>
                </div>
              </div>

              <div className="salary-info">
                <h2>Salary Information</h2>
                <div className="salary-grid">
                  {/* General Salary Range */}
                  {article.additionalResources['Salary Range'] && (
                    <div className="salary-card salary-range">
                      <h3>Salary Range</h3>
                      <p>{article.additionalResources['Salary Range'].value}</p>
                    </div>
                  )}
                  
                  {/* Postdoctoral Level 1 */}
                  {article.additionalResources['Salary PD1'] && (
                    <div className="salary-card pd1">
                      <h3>Postdoctoral Level 1 (PD1)</h3>
                      <p>{article.additionalResources['Salary PD1'].value}</p>
                    </div>
                  )}
                  
                  {/* Postdoctoral Level 2 */}
                  {article.additionalResources['Salary PD2'] && (
                    <div className="salary-card pd2">
                      <h3>Postdoctoral Level 2 (PD2)</h3>
                      <p>{article.additionalResources['Salary PD2'].value}</p>
                    </div>
                  )}
                </div>
  
                {/* Additional salary notes if needed */}
                {article.additionalResources['Salary Notes'] && (
                  <div className="salary-notes">
                    <p className="salary-disclaimer">
                      <strong>Note:</strong> {article.additionalResources['Salary Notes'].value}
                    </p>
                  </div>
                )}
              </div>

              <div className="project-areas">
                <h2>Key Project Areas</h2>
                <div className="areas-grid">
                  {article.keyPoints.map((point, index) => {
                    const [title, description] = point.text.split(': ');
                    return (
                      <div key={index} className={`area-card ${point.spacing === 'large' ? 'large-spacing' : ''}`}>
                        <h3>{title}</h3>
                        <p>{description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="apply-section">
                <h2>How to Apply</h2>
                {article.content.map((paragraph, index) => (
                  <p key={index} className={paragraph.spacing === 'large' ? 'large-spacing' : ''}>
                    {paragraph.text}
                  </p>
                ))}
                {article.relatedLinks.map((link, index) => (
                  <a
                    key={index}
                    href={ensureValidUrl(link.url)}
                    className={`apply-button ${link.spacing === 'large' ? 'large-spacing' : ''}`}
                    onClick={(e) => handleExternalLink(e, link.url)}
                  >
                    <span>{link.title}</span>
                    <ExternalLink size={16} />
                  </a>
                ))}
              </div>
            </div>
          </>
        );

      case 'research':
        return (
          <>
            <div className="article-header">
              <div className="article-categories">
                {article.categories.map(category => (
                  <span key={category} className="category-tag">{category}</span>
                ))}
              </div>
              <h1>{article.title}</h1>
              <div className="article-meta">
                <div className="meta-item">
                  <Calendar size={18} />
                  <span>{article.date}</span>
                </div>
                <div className="meta-item">
                  <User size={18} />
                  <span>{article.author}</span>
                </div>
              </div>
            </div>

            <div className="article-image-container">
              <img 
                src={article.image} 
                alt={article.title} 
                className="article-image"
                loading="lazy" // Added lazy loading
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/placeholder-image.jpg';
                }}
              />
            </div>

            <div className="event-details-grid">
              <div className="event-detail-card">
                <Globe size={24} />
                <div>
                  <h3>Publication</h3>
                  <p>{article.eventDetails.Publication?.value}</p>
                </div>
              </div>
              <div className="event-detail-card">
                <Calendar size={24} />
                <div>
                  <h3>Publish Date</h3>
                  <p>{article.eventDetails.PublishDate?.value}</p>
                </div>
              </div>
              <div className="event-detail-card">
                <User size={24} />
                <div>
                  <h3>Image Caption</h3>
                  <p>{article.eventDetails['Image Caption']?.value}</p>
                </div>
              </div>
            </div>

            <div className="article-content">
              <div className="article-summary">
                {article.excerpt}
              </div>

              <div className="article-body">
                {article.content.map((paragraph, index) => (
                  <p key={index} className={paragraph.spacing === 'large' ? 'large-spacing' : ''}>
                    {paragraph.text}
                  </p>
                ))}

                {article.keyPoints.length > 0 && (
                  <div className="key-findings">
                    <h2>Key Findings</h2>
                    <ul>
                      {article.keyPoints.map((point, index) => (
                        <li key={index} className={point.spacing === 'large' ? 'large-spacing' : ''}>
                          {point.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {article.relatedLinks.length > 0 && (
                <div className="related-links">
                  <h2>Read More About This Story</h2>
                  <div className="links-grid">
                    {article.relatedLinks.map((link, index) => (
                      <a
                        key={index}
                        href={ensureValidUrl(link.url)}
                        className={`related-link ${link.spacing === 'large' ? 'large-spacing' : ''}`}
                        onClick={(e) => handleExternalLink(e, link.url)}
                      >
                        <span>{link.title}</span>
                        <ExternalLink size={16} />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        );

      case 'event':
        return (
          <>
            <div className="article-header">
              <div className="article-categories">
                {article.categories.map(category => (
                  <span key={category} className="category-tag">{category}</span>
                ))}
              </div>
              <h1>{article.title}</h1>
              <div className="article-meta">
                <div className="meta-item">
                  <Calendar size={18} />
                  <span>{article.date}</span>
                </div>
                <div className="meta-item">
                  <User size={18} />
                  <span>{article.author}</span>
                </div>
              </div>
            </div>

            <div className="article-image-container">
              <img 
                src={article.image} 
                alt={article.title} 
                className="article-image"
                loading="lazy" // Added lazy loading
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/placeholder-image.jpg';
                }}
              />
              {article.eventDetails['Image Caption'] && (
                <div className="image-caption">
                  {article.eventDetails['Image Caption'].value}
                </div>
              )}
            </div>

            <div className="article-content">
              <div className="event-banner">
                <div className="event-banner-content">
                  <Users size={24} />
                  <div>
                    <h2>{article.eventDetails['Event Title']?.value}</h2>
                    <p>{article.eventDetails['Description']?.value}</p>
                  </div>
                </div>
              </div>

              <div className="article-body">
                <div className="event-description">
                  <h2>About the Event</h2>
                  {article.content.map((paragraph, index) => (
                    <p key={index} className={paragraph.spacing === 'large' ? 'large-spacing' : ''}>
                      {paragraph.text}
                    </p>
                  ))}
                </div>

                {article.additionalResources && Object.entries(article.additionalResources).some(([key]) => key.startsWith('Leader')) && (
                  <div className="event-leaders">
                    <h2>Event Leaders</h2>
                    <div className="leaders-grid">
                      {Object.entries(article.additionalResources)
                        .filter(([key]) => key.startsWith('Leader'))
                        .map(([key, value], index) => {
                          const [name, role] = value.value.split(' - ');
                          return (
                            <div key={key} className={`leader-card ${value.spacing === 'large' ? 'large-spacing' : ''}`}>
                              <h3>{name}</h3>
                              <p>{role}</p>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}

                {article.relatedLinks && article.relatedLinks.length > 0 && (
                  <div className="learn-more-section">
                    <h2>Learn More</h2>
                    {article.relatedLinks.map((link, index) => (
                      <a
                        key={index}
                        href={ensureValidUrl(link.url)}
                        className={`learn-more-button ${link.spacing === 'large' ? 'large-spacing' : ''}`}
                        onClick={(e) => handleExternalLink(e, link.url)}
                      >
                        <span>{link.title}</span>
                        <ExternalLink size={16} />
                      </a>
                    ))}
                    <p className="learn-more-description">
                      {article.excerpt}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        );

      case 'presentation':
        return (
          <>
            <div className="article-header">
              <div className="article-categories">
                {article.categories.map(category => (
                  <span key={category} className="category-tag">
                    {category}
                  </span>
                ))}
              </div>
              <h1>{article.title}</h1>
              <div className="article-meta">
                <div className="meta-item">
                  <Calendar size={18} />
                  <span>{article.date}</span>
                </div>
                <div className="meta-item">
                  <User size={18} />
                  <span>{article.author}</span>
                </div>
              </div>
            </div>

            <div className="video-banner">
              <img 
                src={article.image} 
                alt={article.title}
                className="video-banner-image"
                loading="lazy" // Added lazy loading
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/placeholder-image.jpg';
                }}
              />
            </div>

            <div className="article-content">
              <div className="presentation-summary">
                <h2>Presentation Overview</h2>
                <p>{article.excerpt}</p>
              </div>

              {article.eventDetails && (
                <div className="speaker-info">
                  <div className="speaker-credentials">
                    <h3>About the Speaker</h3>
                    <p>{`${article.eventDetails.Speaker?.value}, ${article.eventDetails.Role?.value}`}</p>
                  </div>
                </div>
              )}

              {article.keyPoints && article.keyPoints.length > 0 && (
                <div className="talk-highlights">
                  <h2>Key Topics Covered</h2>
                  <div className="highlights-grid">
                    {article.keyPoints.map((point, index) => {
                      const [title, description] = point.text.split(':');
                      return (
                        <div key={index} className={`highlight-card ${point.spacing === 'large' ? 'large-spacing' : ''}`}>
                          <div className="highlight-icon">
                            {index === 0 && <MonitorPlay size={24} />}
                            {index === 1 && <UserCheck size={24} />}
                            {index === 2 && <Microscope size={24} />}
                          </div>
                          <div className="highlight-content">
                            <h3>{title}</h3>
                            <p>{description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {article.content && article.content.length > 0 && (
                <div className="presentation-details">
                  {article.content.map((paragraph, index) => (
                    <p key={index} className={paragraph.spacing === 'large' ? 'large-spacing' : ''}>
                      {paragraph.text}
                    </p>
                  ))}
                </div>
              )}

              {article.relatedLinks && article.relatedLinks.length > 0 && (
                <div className="program-link">
                  <h2>{article.eventDetails['Event Title']?.value || 'Learn More'}</h2>
                  {article.relatedLinks.map((link, index) => (
                    <a
                      key={index}
                      href={ensureValidUrl(link.url)}
                      className={`program-button ${link.spacing === 'large' ? 'large-spacing' : ''}`}
                      onClick={(e) => handleExternalLink(e, link.url)}
                    >
                      <span>{link.title}</span>
                      <ExternalLink size={16} />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </>
        );

      case 'conference':
        return (
          <>
            <div className="article-header">
              <div className="article-categories">
                {article.categories.map(category => (
                  <span key={category} className="category-tag">
                    {category}
                  </span>
                ))}
              </div>
              <h1>{article.title}</h1>
              <div className="article-meta">
                <div className="meta-item">
                  <Calendar size={18} />
                  <span>{article.date}</span>
                </div>
                <div className="meta-item">
                  <User size={18} />
                  <span>{article.author}</span>
                </div>
              </div>
            </div>

            <div className="conference-image-container">
              <img 
                src={article.image}
                alt={article.title}
                className="conference-main-image"
                loading="lazy" // Added lazy loading
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/placeholder-image.jpg';
                }}
              />
              {article.eventDetails['Image Caption'] && (
                <div className="image-overlay">
                  <span>{article.eventDetails['Image Caption'].value}</span>
                </div>
              )}
            </div>

            <div className="event-details-grid">
              <div className="event-detail-card">
                <MapPin size={24} />
                <div>
                  <h3>Location</h3>
                  <p>{article.eventDetails.Location?.value}</p>
                </div>
              </div>
              <div className="event-detail-card">
                <Calendar size={24} />
                <div>
                  <h3>Date</h3>
                  <p>{article.eventDetails.Date?.value}</p>
                </div>
              </div>
              <div className="event-detail-card">
                <Globe size={24} />
                <div>
                  <h3>Type</h3>
                  <p>{article.eventDetails.Type?.value}</p>
                </div>
              </div>
            </div>

            <div className="article-content">
              <div className="symposium-overview">
                <h2>Symposium Overview</h2>
                {article.content.map((paragraph, index) => (
                  <p 
                    key={index} 
                    className={paragraph.spacing === 'large' ? 'large-spacing' : ''}
                    style={{ marginBottom: '1.5em' }}
                  >
                    {paragraph.text}
                  </p>
                ))}
              </div>

              {article.keyPoints && article.keyPoints.length > 0 && (
                <div className="conference-highlights">
                  <div className="highlights-container">
                    <h2>Key Aspects</h2>
                    <div className="highlights-grid">
                      {article.keyPoints.map((point, index) => {
                        const [title, description] = point.text.split(':');
                        return (
                          <div key={index} className={`highlight-item ${point.spacing === 'large' ? 'large-spacing' : ''}`}>
                            <h3>{title}</h3>
                            <p>{description}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {article.relatedLinks && article.relatedLinks.length > 0 && (
                <div className="conference-link-section">
                  <h2>Learn More About {article.title}</h2>
                  <br/>
                  {article.relatedLinks.map((link, index) => (
                    <a
                      key={index}
                      href={ensureValidUrl(link.url)}
                      className={`conference-link-button ${link.spacing === 'large' ? 'large-spacing' : ''}`}
                      onClick={(e) => handleExternalLink(e, link.url)}
                    >
                      <span>{link.title}</span>
                      <ExternalLink size={16} />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="news-article-container">
      <nav className="article-breadcrumb">
        <Link to="/news" className="breadcrumb-link">News</Link>
        <ChevronLeft size={16} />
        <span>{article.title}</span>
      </nav>

      {renderArticleContent()}

      <div className="article-footer">
        <Link to="/news" className="back-to-news">
          <ChevronLeft size={20} />
          <span>Back to News</span>
        </Link>
      </div>
    </div>
  );
}

export default NewsArticle;