// src/components/Blog/UserDashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserBlogPosts, deleteBlogPost } from '../services/BlogService';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import './UserDashboard.css';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    loadUserPosts();
  }, []);

  const loadUserPosts = async () => {
    try {
      setLoading(true);
      const userPosts = await getUserBlogPosts();
      setPosts(userPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
      alert('Error loading your posts');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = () => {
    navigate('/blog-editor');
  };

  const handleEditPost = (postId) => {
    navigate(`/blog-editor/${postId}`);
  };

  const handleDeletePost = async (postId, postTitle) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${postTitle}"?\n\nThis action cannot be undone.`
    );

    if (!confirmDelete) return;

    try {
      setDeleting(postId);
      await deleteBlogPost(postId);
      
      // Remove from local state
      setPosts(posts.filter(post => post.id !== postId));
      alert('Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Error deleting post');
    } finally {
      setDeleting(null);
    }
  };

  const handleViewPost = (postId) => {
    // Navigate to public view of the post
    navigate(`/blog/${postId}`);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Unknown date';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateContent = (content, maxLength = 150) => {
    if (!content) return 'No content';
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  // Separate drafts and published posts
  const draftPosts = posts.filter(post => post.status === 'draft');
  const publishedPosts = posts.filter(post => post.status === 'published');

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your posts...</p>
      </div>
    );
  }

  return (
    <div className="user-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <div className="welcome-section">
            <h1>Blog Dashboard</h1>
            <p className="welcome-message">
              Welcome back! Manage your blog posts and create new content.
            </p>
          </div>
          <div className="header-actions">
            <button 
              className="btn btn-primary"
              onClick={handleCreatePost}
            >
              ✏️ Create New Post
            </button>
            <button 
              className="btn btn-secondary"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Stats Overview */}
        <div className="stats-overview">
          <div className="stat-card">
            <div className="stat-number">{draftPosts.length}</div>
            <div className="stat-label">Draft Posts</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{publishedPosts.length}</div>
            <div className="stat-label">Published Posts</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{posts.length}</div>
            <div className="stat-label">Total Posts</div>
          </div>
        </div>

        {/* Drafts Section */}
        <div className="posts-section">
          <div className="section-header">
            <h2>📝 My Drafts ({draftPosts.length})</h2>
            <p>Posts you can edit and publish</p>
          </div>
          
          {draftPosts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📄</div>
              <h3>No drafts yet</h3>
              <p>Create your first blog post to get started!</p>
              <button 
                className="btn btn-primary"
                onClick={handleCreatePost}
              >
                Create Your First Post
              </button>
            </div>
          ) : (
            <div className="posts-grid">
              {draftPosts.map(post => (
                <div key={post.id} className="post-card draft-card">
                  <div className="post-header">
                    <h3 className="post-title">{post.title || 'Untitled'}</h3>
                    <span className="post-status draft">Draft</span>
                  </div>
                  
                  {post.authors && (
                    <p className="post-authors">By {post.authors}</p>
                  )}
                  
                  <p className="post-excerpt">
                    {truncateContent(post.content)}
                  </p>
                  
                  <div className="post-meta">
                    <span className="post-date">
                      Last edited: {formatDate(post.updatedAt)}
                    </span>
                  </div>
                  
                  <div className="post-actions">
                    <button 
                      className="btn btn-primary btn-small"
                      onClick={() => handleEditPost(post.id)}
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      className="btn btn-danger btn-small"
                      onClick={() => handleDeletePost(post.id, post.title)}
                      disabled={deleting === post.id}
                    >
                      {deleting === post.id ? 'Deleting...' : '🗑️ Delete'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Published Posts Section */}
        <div className="posts-section">
          <div className="section-header">
            <h2>📰 My Published Posts ({publishedPosts.length})</h2>
            <p>Posts that are live and visible to the public</p>
          </div>
          
          {publishedPosts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📰</div>
              <h3>No published posts yet</h3>
              <p>Publish a draft to see it here!</p>
            </div>
          ) : (
            <div className="posts-grid">
              {publishedPosts.map(post => (
                <div key={post.id} className="post-card published-card">
                  <div className="post-header">
                    <h3 className="post-title">{post.title}</h3>
                    <span className="post-status published">Published</span>
                  </div>
                  
                  {post.authors && (
                    <p className="post-authors">By {post.authors}</p>
                  )}
                  
                  {post.coverImage && (
                    <div className="post-image">
                      <img src={post.coverImage} alt="Post cover" />
                    </div>
                  )}
                  
                  <p className="post-excerpt">
                    {truncateContent(post.content)}
                  </p>
                  
                  <div className="post-meta">
                    <span className="post-date">
                      Published: {formatDate(post.publishedAt)}
                    </span>
                  </div>
                  
                  <div className="post-actions">
                    <button 
                      className="btn btn-secondary btn-small"
                      onClick={() => handleViewPost(post.id)}
                    >
                      👁️ View Public Post
                    </button>
                    <div className="locked-notice">
                      🔒 Locked - Only admin can edit published posts
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;