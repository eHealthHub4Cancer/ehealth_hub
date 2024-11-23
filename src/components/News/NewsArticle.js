import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
    ChevronLeft, 
    Calendar, 
    User, 
    ExternalLink, 
    MapPin, 
    Briefcase, 
    GraduationCap, 
    Clock, 
    Building,
    Users,
    MonitorPlay,
    UserCheck, 
    Microscope 
} from 'lucide-react';
import { ClipLoader } from 'react-spinners';
import './NewsArticle.css';

function NewsArticle() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Loading spinner styles
  const override = {
    display: "block",
    margin: "100px auto",
    borderColor: "#1a3e5a",
  };

  // Handle URLs properly
  const ensureValidUrl = (url) => {
    if (!url) return '#';
    try {
      new URL(url);
      return url;
    } catch {
      return url.startsWith('http') ? url : `https://${url}`;
    }
  };

  // Handle external link clicks
  const handleExternalLink = (e, url) => {
    e.preventDefault();
    e.stopPropagation();
    const validUrl = ensureValidUrl(url);
    window.open(validUrl, '_blank', 'noopener,noreferrer');
  };

  const parseCSVLine = (line) => {
    const result = [];
    let cell = '';
    let insideQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        result.push(cell.trim().replace(/^"|"$/g, ''));
        cell = '';
      } else {
        cell += char;
      }
    }
    result.push(cell.trim().replace(/^"|"$/g, ''));
    return result;
  };

  const parseLinks = (linksString) => {
    if (!linksString) return [];
    return linksString.split('|').map(link => {
      const [title, ...urlParts] = link.split(':');
      return {
        title: title.trim(),
        url: urlParts.join(':').trim()
      };
    });
  };

  const fetchArticle = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vSTKMvqBJMCJPvUPIyk1M-l03Yyd57wmo_0pevGrZoHuRIS0qv0r5mwo4WK97gEQWVLXadmrCK5TXVK/pub?gid=226797145&single=true&output=csv');
      
      if (!response.ok) throw new Error('Failed to fetch');
      
      const text = await response.text();
      const rows = text.split('\n').map(parseCSVLine);
      
      const articleRow = rows.slice(1).find(row => row[6]?.trim() === slug);

      if (!articleRow) {
        throw new Error('Article not found');
      }

      setArticle({
        title: articleRow[0],
        excerpt: articleRow[1],
        date: articleRow[2],
        author: articleRow[3],
        categories: articleRow[4].split(',').map(cat => cat.trim()),
        image: articleRow[5],
        slug: articleRow[6],
        type: articleRow[7],
        content: articleRow[8] ? articleRow[8].split('|') : [],
        eventDetails: articleRow[9] ? Object.fromEntries(
          articleRow[9].split('|').map(detail => {
            const [key, ...values] = detail.split(':');
            return [key.trim(), values.join(':').trim()];
          })
        ) : {},
        keyPoints: articleRow[10] ? articleRow[10].split('|') : [],
        relatedLinks: parseLinks(articleRow[11]),
        additionalResources: articleRow[12] ? Object.fromEntries(
          articleRow[12].split('|').map(resource => {
            const [key, ...values] = resource.split(':');
            return [key.trim(), values.join(':').trim()];
          })
        ) : {}
      });
    } catch (err) {
      console.error('Error fetching article:', err);
      setError(err.message);
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
                  <span>{article.eventDetails.Institution || article.author}</span>
                </div>
                <div className="meta-item">
                  <MapPin size={18} />
                  <span>{article.eventDetails.Location}</span>
                </div>
                <div className="meta-item">
                  <Clock size={18} />
                  <span>Closing: {article.eventDetails['Closing Date']}</span>
                </div>
              </div>
            </div>

            <div className="campus-showcase">
              <img 
                src={article.image} 
                alt={article.title} 
                className="campus-image"
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
                    <p>{article.eventDetails['Position Level']}</p>
                  </div>
                </div>
                <div className="detail-card">
                  <GraduationCap size={24} />
                  <div>
                    <h3>Department</h3>
                    <p>{article.eventDetails.Department}</p>
                  </div>
                </div>
                <div className="detail-card">
                  <Calendar size={24} />
                  <div>
                    <h3>Contract Type</h3>
                    <p>{article.eventDetails['Contract Type']}</p>
                  </div>
                </div>
              </div>

              <div className="salary-info">
                <h2>Salary Scales</h2>
                <div className="salary-grid">
                  {article.additionalResources['Salary PD1'] && (
                    <div className="salary-card pd1">
                      <h3>PD1</h3>
                      <p>{article.additionalResources['Salary PD1']}</p>
                    </div>
                  )}
                  {article.additionalResources['Salary PD2'] && (
                    <div className="salary-card pd2">
                      <h3>PD2</h3>
                      <p>{article.additionalResources['Salary PD2']}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="project-areas">
                <h2>Key Project Areas</h2>
                <div className="areas-grid">
                  {article.keyPoints.map((point, index) => {
                    const [title, description] = point.split(': ');
                    return (
                      <div key={index} className="area-card">
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
                  <p key={index}>{paragraph}</p>
                ))}
                {article.relatedLinks.map((link, index) => (
                  <a
                    key={index}
                    href={ensureValidUrl(link.url)}
                    className="apply-button"
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
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/placeholder-image.jpg';
                }}
              />
            </div>

            <div className="article-content">
              <div className="article-summary">
                {article.excerpt}
              </div>

              <div className="article-body">
                {article.content.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}

                {article.keyPoints.length > 0 && (
                  <div className="key-findings">
                    <h2>Key Findings</h2>
                    <ul>
                      {article.keyPoints.map((point, index) => (
                        <li key={index}>{point}</li>
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
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/placeholder-image.jpg';
                }}
              />
              {article.eventDetails['Image Caption'] && (
                <div className="image-caption">
                  {article.eventDetails['Image Caption']}
                </div>
              )}
            </div>

            <div className="article-content">
              <div className="event-banner">
                <div className="event-banner-content">
                  <Users size={24} />
                  <div>
                    <h2>{article.eventDetails['Event Title']}</h2>
                    <p>{article.eventDetails['Description']}</p>
                  </div>
                </div>
              </div>

              <div className="article-body">
                <div className="event-description">
                  <h2>About the Event</h2>
                  {article.content.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>

                {article.additionalResources && Object.entries(article.additionalResources).some(([key]) => key.startsWith('Leader')) && (
                  <div className="event-leaders">
                    <h2>Event Leaders</h2>
                    <div className="leaders-grid">
                      {Object.entries(article.additionalResources)
                        .filter(([key]) => key.startsWith('Leader'))
                        .map(([key, value]) => {
                          const [name, role] = value.split(' - ');
                          return (
                            <div key={key} className="leader-card">
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
                        className="learn-more-button"
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
                                    <p>{`${article.eventDetails.Speaker}, ${article.eventDetails.Role}`}</p>
                                </div>
                            </div>
                        )}

                        {article.keyPoints && article.keyPoints.length > 0 && (
                            <div className="talk-highlights">
                                <h2>Key Topics Covered</h2>
                                <div className="highlights-grid">
                                    {article.keyPoints.map((point, index) => {
                                        const [title, description] = point.split(':');
                                        return (
                                            <div key={index} className="highlight-card">
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
                                    <p key={index}>{paragraph}</p>
                                ))}
                            </div>
                        )}

                        {article.relatedLinks && article.relatedLinks.length > 0 && (
                            <div className="program-link">
                                <h2>{article.eventDetails['Event Title'] || 'Learn More'}</h2>
                                {article.relatedLinks.map((link, index) => (
                                    <a
                                        key={index}
                                        href={ensureValidUrl(link.url)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="program-button"
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