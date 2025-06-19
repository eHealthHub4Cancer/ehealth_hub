// src/components/Blog/PublicBlogPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllBlogPosts } from '../services/BlogService';
import './PublicBlogPage.css';

const PublicBlogPage = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadPublishedPosts();
  }, []);

  const loadPublishedPosts = async () => {
    try {
      setLoading(true);
      const publishedPosts = await getAllBlogPosts('published');
      setPosts(publishedPosts);
    } catch (error) {
      console.error('Error loading published posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostClick = (postId) => {
    navigate(`/blog/${postId}`);
  };

  const formatDate = (date) => {
    if (!date) return 'Unknown date';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateContent = (content, maxLength = 120) => {
    if (!content) return 'No preview available';
    // Remove markdown formatting for clean preview
    const cleanContent = content
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/## (.*)/g, '$1')
      .replace(/!\[.*?\]\(.*?\)/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/\n/g, ' ')
      .trim();
    
    if (cleanContent.length <= maxLength) return cleanContent;
    return cleanContent.substring(0, maxLength) + '...';
  };

  const getDefaultImage = () => {
    // Beautiful default placeholder for medical/research content
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250" style="background: linear-gradient(135deg, #2B5A87 0%, #7FBADC 100%);">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)"/>
        <g transform="translate(200, 125)">
          <circle cx="0" cy="-20" r="25" fill="rgba(255,255,255,0.9)"/>
          <rect x="-30" y="10" width="60" height="40" rx="8" fill="rgba(255,255,255,0.9)"/>
          <circle cx="-15" cy="30" r="3" fill="#2B5A87"/>
          <circle cx="0" cy="30" r="3" fill="#2B5A87"/>
          <circle cx="15" cy="30" r="3" fill="#2B5A87"/>
          <text x="0" y="70" text-anchor="middle" fill="rgba(255,255,255,0.9)" font-family="Arial, sans-serif" font-size="14" font-weight="500">eHealth Hub</text>
        </g>
      </svg>
    `)}`;
  };

  // Filter posts based on search and category
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.authors.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    // For now, we'll just use search. Categories can be added later if needed
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="blog-loading">
        <div className="blog-loading-container">
          <div className="blog-loading-spinner"></div>
          <p>Loading latest articles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="public-blog-page">
      {/* Hero Section */}
      <div className="blog-hero-section">
        <div className="blog-hero-content">
          <div className="blog-hero-text">
            <h1>Blog Post</h1>
            <p>Explore the latest in technology, digital health innovations, and insights from our team. 
               Sharing knowledge, experiences, and discoveries.</p>
          </div>
          <div className="blog-hero-stats">
            <div className="blog-stat">
              <span className="blog-stat-number">{posts.length}</span>
              <span className="blog-stat-label">Articles</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="blog-controls-section">
        <div className="blog-controls-container">
          <div className="blog-search-section">
            <div className="blog-search-box">
              <svg className="blog-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input
                type="text"
                placeholder="Search articles, authors, or topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="blog-search-input"
              />
            </div>
          </div>
          
          {searchTerm && (
            <div className="blog-search-results-info">
              <span>Found {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''} matching "{searchTerm}"</span>
              {searchTerm && (
                <button 
                  className="blog-clear-search" 
                  onClick={() => setSearchTerm('')}
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="blog-content-section">
        <div className="blog-posts-container">
          {filteredPosts.length === 0 ? (
            <div className="blog-no-posts">
              <div className="blog-no-posts-icon">📚</div>
              <h3>No articles found</h3>
              <p>
                {searchTerm 
                  ? `No articles match your search for "${searchTerm}". Try different keywords.`
                  : 'No articles have been published yet. Check back soon for the latest tech insights!'
                }
              </p>
            </div>
          ) : (
            <div className="blog-posts-grid">
              {filteredPosts.map(post => (
                <article 
                  key={post.id} 
                  className="blog-post-card"
                  onClick={() => handlePostClick(post.id)}
                >
                  <div className="blog-card-image">
                    <img 
                      src={post.coverImage || getDefaultImage()} 
                      alt={post.title}
                      onError={(e) => {
                        e.target.src = getDefaultImage();
                      }}
                    />
                    <div className="blog-card-overlay">
                      <span className="blog-read-more">Read Article</span>
                    </div>
                  </div>
                  
                  <div className="blog-card-content">
                    <div className="blog-card-meta">
                      <span className="blog-publish-date">{formatDate(post.publishedAt)}</span>
                    </div>
                    
                    <h2 className="blog-card-title">{post.title}</h2>
                    
                    <p className="blog-card-excerpt">{truncateContent(post.content)}</p>
                    
                    <div className="blog-card-footer">
                      <div className="blog-author-info">
                        <div className="blog-author-avatar">
                          <span>{post.authors.charAt(0).toUpperCase()}</span>
                        </div>
                        <div className="blog-author-details">
                          <span className="blog-author-name">{post.authors}</span>
                          <span className="blog-author-role">Author</span>
                        </div>
                      </div>
                      
                      <div className="blog-read-time">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12,6 12,12 16,14"></polyline>
                        </svg>
                        <span>{Math.max(1, Math.ceil(post.content.length / 1000))} min read</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicBlogPage;