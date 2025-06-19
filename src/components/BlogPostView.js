// src/components/Blog/BlogPostView.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBlogPost } from '../services/BlogService';
import './BlogPostView.css';

const BlogPostView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    loadPost();
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      const article = document.querySelector('.blog-post-article');
      if (article) {
        const totalHeight = article.scrollHeight - window.innerHeight;
        const progress = Math.min((window.scrollY / totalHeight) * 100, 100);
        setReadingProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [post]);

  const loadPost = async () => {
    try {
      setLoading(true);
      const postData = await getBlogPost(id);
      
      // Only show published posts to public
      if (postData.status !== 'published') {
        navigate('/blog');
        return;
      }
      
      setPost(postData);
      
      // Set page title
      document.title = `${postData.title} | eHealth Hub Blog`;
    } catch (error) {
      console.error('Error loading post:', error);
      navigate('/blog');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Unknown date';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getReadingTime = (content) => {
    if (!content) return 1;
    return Math.max(1, Math.ceil(content.length / 1000));
  };

  const getDefaultImage = () => {
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400" style="background: linear-gradient(135deg, #2B5A87 0%, #7FBADC 100%);">
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)"/>
        <g transform="translate(600, 200)">
          <circle cx="0" cy="-30" r="40" fill="rgba(255,255,255,0.15)"/>
          <rect x="-50" y="20" width="100" height="60" rx="12" fill="rgba(255,255,255,0.15)"/>
          <circle cx="-25" cy="50" r="5" fill="rgba(255,255,255,0.9)"/>
          <circle cx="0" cy="50" r="5" fill="rgba(255,255,255,0.9)"/>
          <circle cx="25" cy="50" r="5" fill="rgba(255,255,255,0.9)"/>
          <text x="0" y="120" text-anchor="middle" fill="rgba(255,255,255,0.9)" font-family="Arial, sans-serif" font-size="18" font-weight="600">eHealth Hub Tech Blog</text>
        </g>
      </svg>
    `)}`;
  };

  const renderContent = (content) => {
    if (!content) return '';
    
    // Enhanced markdown rendering
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/### (.*)/g, '<h3>$1</h3>')
      .replace(/## (.*)/g, '<h2>$1</h2>')
      .replace(/# (.*)/g, '<h1>$1</h1>')
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="blog-post-content-image" />')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^\s*/, '<p>')
      .replace(/\s*$/, '</p>')
      .replace(/\n/g, '<br />');
  };

  const handleBackToBlog = () => {
    navigate('/blog');
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = post?.title || 'Check out this article';
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url).then(() => {
          alert('Link copied to clipboard!');
        });
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <div className="blog-post-loading">
        <div className="blog-post-loading-container">
          <div className="blog-post-loading-spinner"></div>
          <p>Loading article...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="blog-post-error">
        <div className="blog-post-error-container">
          <h2>Article not found</h2>
          <p>The article you're looking for doesn't exist or has been removed.</p>
          <button className="blog-post-back-btn" onClick={handleBackToBlog}>
            Back to Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-post-view">
      {/* Reading Progress Bar */}
      <div className="blog-post-progress-bar">
        <div 
          className="blog-post-progress-fill" 
          style={{ width: `${readingProgress}%` }}
        ></div>
      </div>

      {/* Navigation */}
      <div className="blog-post-nav">
        <div className="blog-post-nav-container">
          <button className="blog-post-back-button" onClick={handleBackToBlog}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m12 19-7-7 7-7"/>
              <path d="M19 12H5"/>
            </svg>
            Back to Blog
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="blog-post-hero">
        <div className="blog-post-hero-image">
          <img 
            src={post.coverImage || getDefaultImage()} 
            alt={post.title}
            onError={(e) => {
              e.target.src = getDefaultImage();
            }}
          />
          <div className="blog-post-hero-overlay"></div>
        </div>
        
        <div className="blog-post-hero-content">
          <div className="blog-post-hero-container">
            <div className="blog-post-meta">
              <span className="blog-post-date">{formatDate(post.publishedAt)}</span>
              <span className="blog-post-reading-time">
                {getReadingTime(post.content)} min read
              </span>
            </div>
            
            <h1 className="blog-post-title">{post.title}</h1>
            
            <div className="blog-post-author-section">
              <div className="blog-post-author-avatar">
                <span>{post.authors.charAt(0).toUpperCase()}</span>
              </div>
              <div className="blog-post-author-info">
                <span className="blog-post-author-name">{post.authors}</span>
                <span className="blog-post-author-role">Author</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="blog-post-article">
        <div className="blog-post-container">
          <div className="blog-post-content">
            <div 
              className="blog-post-body"
              dangerouslySetInnerHTML={{ 
                __html: renderContent(post.content) 
              }}
            />
          </div>

          {/* Sidebar */}
          <aside className="blog-post-sidebar">
            <div className="blog-post-share">
              <h3>Share this article</h3>
              <div className="blog-post-share-buttons">
                <button 
                  className="blog-post-share-btn twitter"
                  onClick={() => handleShare('twitter')}
                  title="Share on Twitter"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </button>
                
                <button 
                  className="blog-post-share-btn linkedin"
                  onClick={() => handleShare('linkedin')}
                  title="Share on LinkedIn"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </button>
                
                <button 
                  className="blog-post-share-btn facebook"
                  onClick={() => handleShare('facebook')}
                  title="Share on Facebook"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>
                
                <button 
                  className="blog-post-share-btn copy"
                  onClick={() => handleShare('copy')}
                  title="Copy link"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                  </svg>
                </button>
              </div>
            </div>

            <div className="blog-post-author-card">
              <div className="blog-post-author-card-avatar">
                <span>{post.authors.charAt(0).toUpperCase()}</span>
              </div>
              <div className="blog-post-author-card-info">
                <h4>{post.authors}</h4>
                <p>Contributing author at eHealth Hub, sharing insights on technology and digital health innovations.</p>
              </div>
            </div>
          </aside>
        </div>
      </article>

      {/* Call to Action */}
      <div className="blog-post-cta">
        <div className="blog-post-cta-container">
          <h3>Explore More Articles</h3>
          <p>Discover more insights and innovations from our tech blog.</p>
          <button className="blog-post-cta-button" onClick={handleBackToBlog}>
            View All Articles
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogPostView;