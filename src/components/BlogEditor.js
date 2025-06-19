// src/components/Blog/BlogEditor.js

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createBlogPost, updateBlogPost, getBlogPost, uploadImage, publishBlogPost } from '../services/BlogService';
import { auth } from '../firebase';
import './BlogEditor.css';

const BlogEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [post, setPost] = useState({
    title: '',
    content: '',
    coverImage: '',
    authors: '',
    customPublishDate: new Date().toISOString().slice(0, 16) // Initialize with current date/time
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if current user is admin
    const currentUser = auth.currentUser;
    setIsAdmin(currentUser?.email === 'ehealth@ul.ie');
    
    if (id) {
      loadPost();
    }
  }, [id]);

  const loadPost = async () => {
    try {
      setLoading(true);
      const postData = await getBlogPost(id);
      
      // Allow editing if it's a draft OR if current user is admin
      if (postData.status === 'published') {
        const currentUser = auth.currentUser;
        const userRole = currentUser?.email === 'ehealth@ul.ie' ? 'admin' : 'user';
        
        if (userRole !== 'admin') {
          alert('Cannot edit published posts. Only admin can edit published content.');
          navigate('/blog-dashboard');
          return;
        }
      }
      
      // Set custom publish date from existing publishedAt or current date
      const customDate = postData.publishedAt ? 
        new Date(postData.publishedAt.toDate()).toISOString().slice(0, 16) : 
        new Date().toISOString().slice(0, 16);
      
      setPost({
        ...postData,
        customPublishDate: customDate
      });
    } catch (error) {
      console.error('Error loading post:', error);
      alert('Error loading post');
      navigate('/blog-dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPost(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (e) => {
    setPost(prev => ({
      ...prev,
      customPublishDate: e.target.value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    try {
      setImageUploading(true);
      const imageUrl = await uploadImage(file);
      setPost(prev => ({
        ...prev,
        coverImage: imageUrl
      }));
      alert('Cover image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image');
    } finally {
      setImageUploading(false);
    }
  };

  const insertImageInContent = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    try {
      setImageUploading(true);
      const imageUrl = await uploadImage(file);
      const imageMarkdown = `\n\n![Image](${imageUrl})\n\n`;
      
      setPost(prev => ({
        ...prev,
        content: prev.content + imageMarkdown
      }));
      alert('Image inserted into content!');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image');
    } finally {
      setImageUploading(false);
    }
  };

  const saveDraft = async () => {
    if (!post.title.trim()) {
      alert('Please add a title');
      return;
    }

    if (!post.authors.trim()) {
      alert('Please add author name(s)');
      return;
    }

    try {
      setSaving(true);
      const postData = {
        ...post,
        status: 'draft'
      };

      if (id) {
        await updateBlogPost(id, postData);
        alert('Draft updated successfully!');
      } else {
        const newId = await createBlogPost(postData);
        alert('Draft saved successfully!');
        navigate(`/blog-editor/${newId}`);
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      alert('Error saving draft. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const publishPost = async () => {
    if (!post.title.trim() || !post.content.trim() || !post.authors.trim()) {
      alert('Please add title, content, and author name(s) before publishing');
      return;
    }

    setShowPublishModal(true);
  };

  const confirmPublish = async () => {
    setShowPublishModal(false);
    
    try {
      setSaving(true);
      const postData = {
        ...post,
        status: 'published'
      };

      // If admin and custom date is set, use it; otherwise use current time
      const publishDate = isAdmin && post.customPublishDate ? 
        new Date(post.customPublishDate) : 
        new Date();

      if (id) {
        await updateBlogPost(id, postData);
        await publishBlogPost(id, publishDate); // Pass custom date
      } else {
        const newId = await createBlogPost(postData);
        await publishBlogPost(newId, publishDate); // Pass custom date
      }
      
      alert('Post published successfully!');
      navigate('/blog-dashboard');
    } catch (error) {
      console.error('Error publishing post:', error);
      alert('Error publishing post. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const formatText = (format) => {
    const textarea = document.getElementById('content-textarea');
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = post.content.substring(start, end);
    
    let formattedText = selectedText;

    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'heading':
        formattedText = `## ${selectedText}`;
        break;
      case 'link':
        const url = prompt('Enter URL:');
        if (url) formattedText = `[${selectedText || 'Link text'}](${url})`;
        break;
      default:
        return;
    }

    const newContent = post.content.substring(0, start) + formattedText + post.content.substring(end);
    setPost(prev => ({ ...prev, content: newContent }));

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + formattedText.length, start + formattedText.length);
    }, 0);
  };

  // FIXED: Improved renderPreview function with better image URL handling
  const renderPreview = (content) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/## (.*)/g, '<h2>$1</h2>')
      // FIXED: Better regex for image URLs that handles complex URLs with tokens and query parameters
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, altText, url) => {
        // Clean and validate the URL
        const cleanUrl = url.trim();
        // Simplified error handling without complex inline JavaScript
        return `<img src="${cleanUrl}" alt="${altText || 'Blog image'}" style="max-width: 100%; height: auto;" onerror="this.style.border='1px dashed #f00'; this.alt='❌ Image failed to load';" />`;
      })
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
      .replace(/\n/g, '<br />');
  };

  // ADDED: Simple error handler functions
  const handleImageError = (e) => {
    e.target.style.border = '1px dashed #f00';
    e.target.alt = '❌ Image failed to load';
    console.error('Image failed to load:', e.target.src);
  };

  const handleCoverImageError = (e) => {
    e.target.style.display = 'none';
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = 'padding: 20px; border: 1px dashed #f00; color: #f00; text-align: center;';
    errorDiv.textContent = 'Cover image failed to load';
    e.target.parentNode.appendChild(errorDiv);
  };

  if (loading) {
    return (
      <div className="blog-editor-loading">
        <div className="loading-spinner"></div>
        <p>Loading post...</p>
      </div>
    );
  }

  return (
    <div className="blog-editor">
      <div className="blog-editor-header">
        <h1>{id ? 'Edit Post' : 'Create New Post'}</h1>
        <div className="editor-actions">
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/blog-dashboard')}
          >
            Back to Dashboard
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? 'Edit' : 'Preview'}
          </button>
          <button 
            className="btn btn-primary"
            onClick={saveDraft}
            disabled={saving || imageUploading}
          >
            {saving ? 'Saving...' : 'Save Draft'}
          </button>
          <button 
            className="btn btn-success"
            onClick={publishPost}
            disabled={saving || imageUploading}
          >
            {saving ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>

      {!showPreview ? (
        <div className="editor-form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              name="title"
              type="text"
              value={post.title}
              onChange={handleInputChange}
              placeholder="Enter post title..."
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="authors">Author(s)</label>
            <input
              id="authors"
              name="authors"
              type="text"
              value={post.authors}
              onChange={handleInputChange}
              placeholder="e.g., Dr. Jane Smith, John Doe, Mary Johnson"
              className="form-input"
            />
            <p className="field-help">
              Enter all authors separated by commas. This will be displayed on the published post.
            </p>
          </div>

          {/* Admin-only publication date field */}
          {isAdmin && (
            <div className="form-group admin-only">
              <label htmlFor="customPublishDate">Publication Date (Admin Only)</label>
              <input
                id="customPublishDate"
                name="customPublishDate"
                type="datetime-local"
                value={post.customPublishDate}
                onChange={handleDateChange}
                className="form-input"
              />
              <p className="field-help admin-help">
                <strong>Admin Feature:</strong> Set a custom publication date for this post. 
                This allows backdating posts when republishing after edits.
              </p>
            </div>
          )}

          <div className="form-group">
            <label>Cover Image (Optional)</label>
            <div className="image-upload-section">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={imageUploading}
                className="file-input"
              />
              {imageUploading && <span className="uploading">Uploading cover image...</span>}
              {post.coverImage && (
                <div className="image-preview">
                  <img 
                    src={post.coverImage} 
                    alt="Cover" 
                    onError={handleImageError}
                  />
                  <button 
                    className="btn btn-danger btn-small"
                    onClick={() => setPost(prev => ({ ...prev, coverImage: '' }))}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="content">Content</label>
            <div className="content-toolbar">
              <button type="button" onClick={() => formatText('bold')} title="Bold">
                <strong>B</strong>
              </button>
              <button type="button" onClick={() => formatText('italic')} title="Italic">
                <em>I</em>
              </button>
              <button type="button" onClick={() => formatText('heading')} title="Heading">
                H2
              </button>
              <button type="button" onClick={() => formatText('link')} title="Link">
                🔗
              </button>
              <label className="image-insert-btn" title="Insert Image">
                📷 Insert Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={insertImageInContent}
                  disabled={imageUploading}
                  style={{ display: 'none' }}
                />
              </label>
              {imageUploading && <span className="uploading">Uploading image...</span>}
            </div>
            <textarea
              id="content-textarea"
              name="content"
              value={post.content}
              onChange={handleInputChange}
              placeholder="Write your blog post content here...

You can use:
- **bold text** 
- *italic text*
- ## Headings
- [link text](URL)
- Images (use the Insert Image button)"
              className="form-textarea"
              rows="20"
            />
            <p className="formatting-help">
              Tip: Select text and use the formatting buttons above, or use markdown syntax directly.
            </p>
          </div>
        </div>
      ) : (
        <div className="preview-mode">
          <div className="preview-header">
            <h2>Preview</h2>
          </div>
          <div className="preview-content">
            {post.coverImage && (
              <img 
                src={post.coverImage} 
                alt="Cover" 
                className="preview-cover-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentNode.innerHTML += '<div style="padding: 20px; border: 1px dashed #f00; color: #f00; text-align: center;">Cover image failed to load</div>';
                }}
              />
            )}
            <h1 className="preview-title">{post.title || 'Untitled Post'}</h1>
            {post.authors && (
              <p className="preview-authors">By {post.authors}</p>
            )}
            <div 
              className="preview-body"
              dangerouslySetInnerHTML={{ 
                __html: renderPreview(post.content || 'No content yet...') 
              }}
            />
          </div>
        </div>
      )}

      {/* Custom Publish Confirmation Modal */}
      {showPublishModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Publish Post</h3>
            </div>
            <div className="modal-body">
              <p><strong>Are you sure you want to publish "{post.title}"?</strong></p>
              {isAdmin && post.customPublishDate && (
                <p className="publish-date-info">
                  <strong>Publication Date:</strong> {new Date(post.customPublishDate).toLocaleString()}
                </p>
              )}
              <p>Once published, you won't be able to edit it. Only the admin can modify published posts.</p>
            </div>
            <div className="modal-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowPublishModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-success"
                onClick={confirmPublish}
                disabled={saving}
              >
                {saving ? 'Publishing...' : 'Yes, Publish'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogEditor;