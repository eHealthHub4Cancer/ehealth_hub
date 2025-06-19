// src/components/Blog/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllBlogPosts, deleteBlogPost, sendBackToDraft } from '../services/BlogService';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  
  const POSTS_PER_PAGE = 6;

  useEffect(() => {
    loadAllPosts();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchTerm]);

  const loadAllPosts = async () => {
    try {
      setLoading(true);
      const posts = await getAllBlogPosts('all');
      setAllPosts(posts);
    } catch (error) {
      console.error('Error loading posts:', error);
      alert('Error loading posts');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = () => navigate('/blog-editor');
  const handleDeletePost = async (postId, postTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${postTitle}"?\nThis action cannot be undone.`)) return;
    try {
      setActionLoading(postId);
      await deleteBlogPost(postId);
      setAllPosts(allPosts.filter(post => post.id !== postId));
      alert('Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Error deleting post');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSendBackToDraft = async (postId, postTitle) => {
    if (!window.confirm(`Send "${postTitle}" back to draft?\nThis will unpublish the post.`)) return;
    try {
      setActionLoading(postId);
      await sendBackToDraft(postId);
      setAllPosts(allPosts.map(post => 
        post.id === postId ? { ...post, status: 'draft', publishedAt: null, updatedAt: new Date() } : post
      ));
      alert('Post sent back to draft successfully!');
    } catch (error) {
      console.error('Error sending post back to draft:', error);
      alert('Error updating post status.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewPost = (postId) => navigate(`/blog/${postId}`);
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const formatDate = (date) => date ? new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Unknown date';
  const truncateContent = (content, maxLength = 100) => {
    if (!content) return 'No content';
    const cleanContent = content.replace(/(\*\*|!?\[.*?\]\(.*?\)|\n)/g, '$1' === '**' ? '' : '[Image]').trim();
    return cleanContent.length <= maxLength ? cleanContent : cleanContent.substring(0, maxLength) + '...';
  };

  const filteredPosts = allPosts.filter(post => 
    (filter === 'all' || post.status === filter) &&
    (!searchTerm || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.authors.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  const draftCount = allPosts.filter(post => post.status === 'draft').length;
  const publishedCount = allPosts.filter(post => post.status === 'published').length;

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) startPage = Math.max(1, endPage - maxVisiblePages + 1);

    if (currentPage > 1) pages.push(
      <button key="prev" onClick={() => setCurrentPage(currentPage - 1)} className="pagination-btn">← Previous</button>
    );

    for (let i = startPage; i <= endPage; i++) pages.push(
      <button key={i} onClick={() => setCurrentPage(i)} className={`pagination-btn ${i === currentPage ? 'active' : ''}`}>{i}</button>
    );

    if (currentPage < totalPages) pages.push(
      <button key="next" onClick={() => setCurrentPage(currentPage + 1)} className="pagination-btn">Next →</button>
    );

    return (
      <div className="pagination">
        <div className="pagination-info">Showing {startIndex + 1}-{Math.min(endIndex, filteredPosts.length)} of {filteredPosts.length} posts</div>
        <div className="pagination-controls">{pages}</div>
      </div>
    );
  };

  if (loading) return (
    <div className="admin-loading">
      <div className="loading-spinner"></div>
      <p>Loading all posts...</p>
    </div>
  );

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="header-content">
          <div className="admin-welcome">
            <h1>🛡️ Admin Dashboard</h1>
            <p className="admin-subtitle">Manage all blog posts across the platform</p>
          </div>
          <div className="header-actions">
            <button className="btn btn-primary" onClick={handleCreatePost}>✏️ Create New Post</button>
            <button className="btn btn-secondary" onClick={() => navigate('/admin/calendar')}>📅 Calendar Admin</button>
            <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </div>

      <div className="admin-content">
        <div className="dashboard-container">
          <div className="stats-section">
            <div className="stat-card">
              <div className="stat-number">{allPosts.length}</div>
              <div className="stat-label">Total Posts</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{draftCount}</div>
              <div className="stat-label">Drafts</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{publishedCount}</div>
              <div className="stat-label">Published</div>
            </div>
            <div className="search-box">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <button className="clear-search" onClick={() => setSearchTerm('')} title="Clear search">✕</button>
              )}
            </div>
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-select">
              <option value="all">All Posts ({allPosts.length})</option>
              <option value="draft">Drafts ({draftCount})</option>
              <option value="published">Published ({publishedCount})</option>
            </select>
          </div>
          <div className="posts-content">
            <div className="posts-grid">
              {filteredPosts.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📄</div>
                  <h3>No posts found</h3>
                  <p>{searchTerm ? `No posts match "${searchTerm}"` : filter === 'all' ? 'No blog posts yet.' : `No ${filter} posts.`}</p>
                  <button className="btn btn-primary" onClick={handleCreatePost}>Create First Post</button>
                </div>
              ) : currentPosts.map(post => (
                <div key={post.id} className={`post-card ${post.status}`}>
                  <div className="post-header">
                    <div className="post-title">{post.title || 'Untitled'}</div>
                    <span className={`status-badge ${post.status}`}>
                      {post.status === 'draft' ? '📝 Draft' : '📰 Published'}
                    </span>
                  </div>
                  <div className="post-meta">
                    <div className="author-info">
                      <strong>{post.authors || 'No author'}</strong>
                      <span className="author-email">{post.authorEmail}</span>
                    </div>
                    <div className="date-info">
                      <span>Created: {formatDate(post.createdAt)}</span>
                      {post.publishedAt && <span>Published: {formatDate(post.publishedAt)}</span>}
                    </div>
                  </div>
                  <div className="post-excerpt">{truncateContent(post.content)}</div>
                  {post.coverImage && <div className="has-image">📸 Has cover image</div>}
                  <div className="post-actions">
                    {post.status === 'published' && (
                      <button className="btn btn-small btn-warning" onClick={() => handleSendBackToDraft(post.id, post.title)} disabled={actionLoading === post.id}>
                        {actionLoading === post.id ? 'Processing...' : '📝 Back to Draft'}
                      </button>
                    )}
                    {post.status === 'published' && (
                      <button className="btn btn-small btn-secondary" onClick={() => handleViewPost(post.id)}>👁️ View</button>
                    )}
                    <button className="btn btn-small btn-danger" onClick={() => handleDeletePost(post.id, post.title)} disabled={actionLoading === post.id}>
                      {actionLoading === post.id ? 'Deleting...' : '🗑️ Delete'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {renderPagination()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;