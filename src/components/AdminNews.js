// src/components/AdminNews.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  getAllArticles,
  createArticle,
  updateArticle,
  deleteArticle,
  togglePublishStatus,
  generateSlug,
  validateArticle,
  getEventDetailFields,
  getUserRole,
  ARTICLE_TYPES
} from '../services/newsService';
import './AdminNews.css';

const AdminNews = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [articles, setArticles] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeView, setActiveView] = useState('list'); // 'list' or 'edit'
  const [editingArticle, setEditingArticle] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [activeTab, setActiveTab] = useState('basic');

  // Form data
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    date: '',
    author: '',
    categories: '',
    imageUrl: '',
    slug: '',
    type: 'research',
    content: '',
    eventDetails: {},
    keyPoints: [],
    relatedLinks: [],
    published: false
  });

  // Temporary states for adding items
  const [newKeyPoint, setNewKeyPoint] = useState('');
  const [newLink, setNewLink] = useState({ title: '', url: '' });

  // Rich text editor configuration
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      ['link'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['clean']
    ]
  };

  const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent',
    'link',
    'color', 'background',
    'align'
  ];

  useEffect(() => {
    const init = async () => {
      const isAuthed = checkAuth();
      if (isAuthed) {
        await loadArticles();
      }
    };
    init();
  }, []);

  const checkAuth = () => {
    const currentUser = auth.currentUser;
    if (!currentUser || getUserRole(currentUser.email) !== 'admin') {
      navigate('/login');
      return false;
    }
    return true;
  };

  const loadArticles = async () => {
    setLoading(true);
    try {
      const data = await getAllArticles(false);
      setArticles(data);
    } catch (error) {
      showMessage('error', 'Error loading articles: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      date: '',
      author: '',
      categories: '',
      imageUrl: '',
      slug: '',
      type: 'research',
      content: '',
      eventDetails: {},
      keyPoints: [],
      relatedLinks: [],
      published: false
    });
    setNewKeyPoint('');
    setNewLink({ title: '', url: '' });
    setActiveTab('basic');
  };

  const handleNewArticle = () => {
    resetForm();
    setEditingArticle(null);
    setActiveView('edit');
  };

  const handleEditArticle = (article) => {
    setFormData({
      title: article.title || '',
      excerpt: article.excerpt || '',
      date: article.date || '',
      author: article.author || '',
      categories: Array.isArray(article.categories) ? article.categories.join(', ') : '',
      imageUrl: article.imageUrl || '',
      slug: article.slug || '',
      type: article.type || 'research',
      content: article.content || '',
      eventDetails: article.eventDetails || {},
      keyPoints: article.keyPoints || [],
      relatedLinks: article.relatedLinks || [],
      published: article.published || false
    });
    setEditingArticle(article);
    setActiveView('edit');
    setActiveTab('basic');
  };

  const handleBackToList = () => {
    setActiveView('list');
    setEditingArticle(null);
    resetForm();
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Auto-generate slug from title
    if (name === 'title' && !editingArticle) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(value)
      }));
    }
  };

  const handleEventDetailChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      eventDetails: {
        ...prev.eventDetails,
        [key]: value
      }
    }));
  };

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setFormData(prev => ({
      ...prev,
      type: newType,
      eventDetails: {} // Reset event details when type changes
    }));
  };

  // Key Points handlers
  const handleAddKeyPoint = () => {
    if (!newKeyPoint.trim()) return;
    setFormData(prev => ({
      ...prev,
      keyPoints: [...prev.keyPoints, newKeyPoint.trim()]
    }));
    setNewKeyPoint('');
  };

  const handleRemoveKeyPoint = (index) => {
    setFormData(prev => ({
      ...prev,
      keyPoints: prev.keyPoints.filter((_, i) => i !== index)
    }));
  };

  // Related Links handlers
  const handleAddLink = () => {
    if (!newLink.title.trim() || !newLink.url.trim()) {
      showMessage('error', 'Please fill in both title and URL');
      return;
    }
    setFormData(prev => ({
      ...prev,
      relatedLinks: [...prev.relatedLinks, { ...newLink }]
    }));
    setNewLink({ title: '', url: '' });
  };

  const handleRemoveLink = (index) => {
    setFormData(prev => ({
      ...prev,
      relatedLinks: prev.relatedLinks.filter((_, i) => i !== index)
    }));
  };

  const handleSaveArticle = async () => {
    // Validate
    const articleData = {
      ...formData,
      categories: formData.categories.split(',').map(c => c.trim()).filter(c => c)
    };

    const validation = validateArticle(articleData);
    if (!validation.isValid) {
      showMessage('error', validation.errors.join(', '));
      return;
    }

    setSaving(true);
    try {
      if (editingArticle) {
        await updateArticle(editingArticle.id, articleData);
        showMessage('success', 'Article updated successfully!');
      } else {
        await createArticle(articleData);
        showMessage('success', 'Article created successfully!');
      }
      await loadArticles();
      handleBackToList();
    } catch (error) {
      showMessage('error', 'Error saving article: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteArticle = async (articleId) => {
    try {
      await deleteArticle(articleId);
      showMessage('success', 'Article deleted successfully!');
      setShowDeleteConfirm(null);
      await loadArticles();
    } catch (error) {
      showMessage('error', 'Error deleting article: ' + error.message);
    }
  };

  const handleTogglePublish = async (article) => {
    try {
      await togglePublishStatus(article.id, !article.published);
      showMessage('success', `Article ${article.published ? 'unpublished' : 'published'}!`);
      await loadArticles();
    } catch (error) {
      showMessage('error', 'Error updating publish status: ' + error.message);
    }
  };

  const getTypeLabel = (type) => {
    const found = ARTICLE_TYPES.find(t => t.value === type);
    return found ? found.label : type;
  };

  if (loading) {
    return (
      <div className="admin-news-loading">
        <div className="loader"></div>
        <p>Loading articles...</p>
      </div>
    );
  }

  return (
    <div className="admin-news-container">
      <div className="admin-news-header">
        <div className="header-content">
          <h1>News Management</h1>
          <p>Create and manage news articles</p>
        </div>
        {activeView === 'list' && (
          <button className="btn-new-article" onClick={handleNewArticle}>
            + New Article
          </button>
        )}
        {activeView === 'edit' && (
          <button className="btn-back" onClick={handleBackToList}>
            &larr; Back to List
          </button>
        )}
      </div>

      {message.text && (
        <div className={`message-banner ${message.type}`}>
          {message.text}
        </div>
      )}

      {/* LIST VIEW */}
      {activeView === 'list' && (
        <div className="articles-list">
          {articles.length === 0 ? (
            <div className="no-articles">
              <p>No articles yet. Click "New Article" to create one.</p>
            </div>
          ) : (
            articles.map(article => (
              <div key={article.id} className={`article-card ${article.published ? 'published' : 'draft'}`}>
                <div className="article-card-image">
                  {article.imageUrl ? (
                    <img src={article.imageUrl} alt={article.title} />
                  ) : (
                    <div className="no-image">No Image</div>
                  )}
                </div>
                <div className="article-card-content">
                  <div className="article-card-header">
                    <span className={`type-badge ${article.type}`}>{getTypeLabel(article.type)}</span>
                    <span className={`status-badge ${article.published ? 'published' : 'draft'}`}>
                      {article.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <h3>{article.title}</h3>
                  <p className="article-excerpt">{article.excerpt}</p>
                  <div className="article-meta">
                    <span>{article.date}</span>
                    <span>{article.author}</span>
                  </div>
                </div>
                <div className="article-card-actions">
                  <button className="btn-edit" onClick={() => handleEditArticle(article)}>
                    Edit
                  </button>
                  <button
                    className={`btn-publish ${article.published ? 'unpublish' : ''}`}
                    onClick={() => handleTogglePublish(article)}
                  >
                    {article.published ? 'Unpublish' : 'Publish'}
                  </button>
                  <button className="btn-delete" onClick={() => setShowDeleteConfirm(article.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* EDIT VIEW */}
      {activeView === 'edit' && (
        <div className="article-editor">
          <div className="editor-tabs">
            <button
              className={activeTab === 'basic' ? 'active' : ''}
              onClick={() => setActiveTab('basic')}
            >
              Basic Info
            </button>
            <button
              className={activeTab === 'content' ? 'active' : ''}
              onClick={() => setActiveTab('content')}
            >
              Content
            </button>
            <button
              className={activeTab === 'details' ? 'active' : ''}
              onClick={() => setActiveTab('details')}
            >
              Type Details
            </button>
            <button
              className={activeTab === 'links' ? 'active' : ''}
              onClick={() => setActiveTab('links')}
            >
              Key Points & Links
            </button>
          </div>

          <div className="editor-content">
            {/* BASIC INFO TAB */}
            {activeTab === 'basic' && (
              <div className="tab-content">
                <div className="form-section">
                  <h2>Basic Information</h2>

                  <div className="form-group">
                    <label>Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Article title"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Slug *</label>
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      placeholder="url-friendly-slug"
                      required
                    />
                    <small>This will be used in the URL: /news/{formData.slug || 'your-slug'}</small>
                  </div>

                  <div className="form-group">
                    <label>Article Type *</label>
                    <select name="type" value={formData.type} onChange={handleTypeChange}>
                      {ARTICLE_TYPES.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Date</label>
                      <input
                        type="text"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        placeholder="e.g., April 10, 2026"
                      />
                    </div>

                    <div className="form-group">
                      <label>Author</label>
                      <input
                        type="text"
                        name="author"
                        value={formData.author}
                        onChange={handleInputChange}
                        placeholder="Author name"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Categories</label>
                    <input
                      type="text"
                      name="categories"
                      value={formData.categories}
                      onChange={handleInputChange}
                      placeholder="Comma-separated, e.g., Research, EHDS, Cancer Data"
                    />
                  </div>

                  <div className="form-group">
                    <label>Image URL (imgbb)</label>
                    <input
                      type="url"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleInputChange}
                      placeholder="https://i.ibb.co/..."
                    />
                    {formData.imageUrl && (
                      <div className="image-preview">
                        <img src={formData.imageUrl} alt="Preview" />
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Excerpt / Summary</label>
                    <textarea
                      name="excerpt"
                      value={formData.excerpt}
                      onChange={handleInputChange}
                      placeholder="Brief summary of the article"
                      rows="3"
                    />
                  </div>

                  <div className="form-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        name="published"
                        checked={formData.published}
                        onChange={handleInputChange}
                      />
                      <span>Published</span>
                    </label>
                    <small>Only published articles will be visible on the website</small>
                  </div>
                </div>
              </div>
            )}

            {/* CONTENT TAB */}
            {activeTab === 'content' && (
              <div className="tab-content">
                <div className="form-section">
                  <h2>Article Content</h2>
                  <p className="section-description">
                    Write the main content of your article. Use the toolbar to format text, add links, create lists, and more.
                  </p>

                  <div className="form-group rich-editor">
                    <ReactQuill
                      theme="snow"
                      value={formData.content}
                      onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                      modules={quillModules}
                      formats={quillFormats}
                      placeholder="Write your article content here..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TYPE DETAILS TAB */}
            {activeTab === 'details' && (
              <div className="tab-content">
                <div className="form-section">
                  <h2>{getTypeLabel(formData.type)} Details</h2>
                  <p className="section-description">
                    Fill in the specific details for this {getTypeLabel(formData.type).toLowerCase()} article.
                  </p>

                  {getEventDetailFields(formData.type).map(field => (
                    <div className="form-group" key={field.key}>
                      <label>{field.label}</label>
                      <input
                        type="text"
                        value={formData.eventDetails[field.key] || ''}
                        onChange={(e) => handleEventDetailChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                      />
                    </div>
                  ))}

                  {getEventDetailFields(formData.type).length === 0 && (
                    <p className="no-fields">No specific fields for this article type.</p>
                  )}
                </div>
              </div>
            )}

            {/* KEY POINTS & LINKS TAB */}
            {activeTab === 'links' && (
              <div className="tab-content">
                <div className="form-section">
                  <h2>Key Points / Findings</h2>
                  <p className="section-description">
                    Add key points or findings that will be displayed as a list.
                  </p>

                  <div className="add-item-form">
                    <input
                      type="text"
                      value={newKeyPoint}
                      onChange={(e) => setNewKeyPoint(e.target.value)}
                      placeholder="Enter a key point"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddKeyPoint()}
                    />
                    <button className="btn-add" onClick={handleAddKeyPoint}>Add</button>
                  </div>

                  <div className="items-list">
                    {formData.keyPoints.map((point, index) => (
                      <div key={index} className="item">
                        <span>{point}</span>
                        <button className="btn-remove" onClick={() => handleRemoveKeyPoint(index)}>
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-section">
                  <h2>Related Links</h2>
                  <p className="section-description">
                    Add external links related to this article.
                  </p>

                  <div className="add-item-form link-form">
                    <input
                      type="text"
                      value={newLink.title}
                      onChange={(e) => setNewLink(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Link title"
                    />
                    <input
                      type="url"
                      value={newLink.url}
                      onChange={(e) => setNewLink(prev => ({ ...prev, url: e.target.value }))}
                      placeholder="https://..."
                    />
                    <button className="btn-add" onClick={handleAddLink}>Add Link</button>
                  </div>

                  <div className="items-list">
                    {formData.relatedLinks.map((link, index) => (
                      <div key={index} className="item link-item">
                        <div className="link-info">
                          <strong>{link.title}</strong>
                          <a href={link.url} target="_blank" rel="noopener noreferrer">{link.url}</a>
                        </div>
                        <button className="btn-remove" onClick={() => handleRemoveLink(index)}>
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="editor-actions">
            <button className="btn-cancel" onClick={handleBackToList}>
              Cancel
            </button>
            <button className="btn-save" onClick={handleSaveArticle} disabled={saving}>
              {saving ? 'Saving...' : (editingArticle ? 'Update Article' : 'Create Article')}
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Article</h3>
            <p>Are you sure you want to delete this article? This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowDeleteConfirm(null)}>
                Cancel
              </button>
              <button className="btn-confirm-delete" onClick={() => handleDeleteArticle(showDeleteConfirm)}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNews;
