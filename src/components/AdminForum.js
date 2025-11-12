// src/pages/AdminForum.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import {
  saveForumData,
  getForumData,
  uploadForumImage,
  uploadSponsorLogo,
  getUserRole,
  addBlogLink,
  removeBlogLink,
  addNewsLink,
  removeNewsLink,
  addAgendaItem,
  removeAgendaItem,
  addSpeaker,
  removeSpeaker,
  addSponsor,
  removeSponsor,
  deleteForumData
} from '../services/forumService';
import './AdminForum.css';

const AdminForum = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [selectedYear, setSelectedYear] = useState('2025');
  const [activeTab, setActiveTab] = useState('basic');
  
  // Form data
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    date: '',
    venue: '',
    description: '',
    highlights: '',
    coverImage: '',
    heroImage: '',
    mediaGalleryUrl: '',
    registrationLink: '',
    submitAbstractLink: '',
    status: 'upcoming',
    posterSubmissionOpen: false,
    blogLinks: [],
    newsLinks: [],
    agendaItems: [],
    speakers: [],
    posters: [],
    sponsors: []
  });

  // Temporary form states for adding items
  const [newBlogLink, setNewBlogLink] = useState({ title: '', url: '' });
  const [newNewsLink, setNewNewsLink] = useState({ title: '', url: '' });
  const [newAgendaItem, setNewAgendaItem] = useState({ time: '', title: '', description: '', speaker: '' });
  const [newSpeaker, setNewSpeaker] = useState({ 
    name: '', 
    title: '', 
    organization: '', 
    bio: '', 
    linkedIn: '', 
    website: '' 
  });
  const [newPoster, setNewPoster] = useState({ title: '', author: '', affiliations: '', posterLink: '' });
  const [newSponsor, setNewSponsor] = useState({ 
    name: '', 
    logo: '', 
    website: '', 
    tier: 'standard' 
  });

  // Image upload states
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingSponsorLogo, setUploadingSponsorLogo] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    checkAuth();
    loadForumData();
  }, [selectedYear]);

  const checkAuth = () => {
    const currentUser = auth.currentUser;
    if (!currentUser || getUserRole(currentUser.email) !== 'admin') {
      navigate('/login');
    }
  };

  const loadForumData = async () => {
    setLoading(true);
    try {
      const data = await getForumData(selectedYear);
      if (data) {
        setFormData({
          title: data.title || '',
          subtitle: data.subtitle || '',
          date: data.date || '',
          venue: data.venue || '',
          description: data.description || '',
          highlights: data.highlights || '',
          coverImage: data.coverImage || '',
          heroImage: data.heroImage || '',
          mediaGalleryUrl: data.mediaGalleryUrl || '',
          registrationLink: data.registrationLink || '',
          submitAbstractLink: data.submitAbstractLink || '',
          status: data.status || 'upcoming',
          posterSubmissionOpen: data.posterSubmissionOpen || false,
          blogLinks: data.blogLinks || [],
          newsLinks: data.newsLinks || [],
          agendaItems: data.agendaItems || [],
          speakers: data.speakers || [],
          posters: data.posters || [],
          sponsors: data.sponsors || []
        });
      } else {
        // Reset form for new year
        setFormData({
          title: `All-Island Forum on Cancer ${selectedYear}`,
          subtitle: 'From Data to Impact: Roadmap for Cancer Data',
          date: '',
          venue: '',
          description: '',
          highlights: '',
          coverImage: '',
          heroImage: '',
          mediaGalleryUrl: '',
          registrationLink: '',
          submitAbstractLink: '',
          status: 'upcoming',
          posterSubmissionOpen: false,
          blogLinks: [],
          newsLinks: [],
          agendaItems: [],
          speakers: [],
          posters: [],
          sponsors: []
        });
      }
    } catch (error) {
      showMessage('error', 'Error loading forum data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = async (e, imageType) => {
    const file = e.target.files[0];
    if (!file) return;

    const setUploading = imageType === 'cover' ? setUploadingCover : setUploadingHero;
    
    setUploading(true);
    try {
      const imageUrl = await uploadForumImage(file, selectedYear, imageType);
      setFormData(prev => ({
        ...prev,
        [imageType === 'cover' ? 'coverImage' : 'heroImage']: imageUrl
      }));
      showMessage('success', `${imageType} image uploaded successfully!`);
    } catch (error) {
      showMessage('error', 'Error uploading image: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSponsorLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingSponsorLogo(true);
    try {
      const logoUrl = await uploadSponsorLogo(file, selectedYear);
      setNewSponsor(prev => ({ ...prev, logo: logoUrl }));
      showMessage('success', 'Sponsor logo uploaded successfully!');
    } catch (error) {
      showMessage('error', 'Error uploading logo: ' + error.message);
    } finally {
      setUploadingSponsorLogo(false);
    }
  };

  const handleSaveForm = async () => {
    setSaving(true);
    try {
      await saveForumData(selectedYear, formData);
      showMessage('success', 'Forum data saved successfully!');
    } catch (error) {
      showMessage('error', 'Error saving forum data: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  // Blog Link handlers
  const handleAddBlogLink = async () => {
    if (!newBlogLink.title || !newBlogLink.url) {
      showMessage('error', 'Please fill in both title and URL');
      return;
    }
    
    try {
      const link = await addBlogLink(selectedYear, newBlogLink);
      setFormData(prev => ({
        ...prev,
        blogLinks: [...prev.blogLinks, link]
      }));
      setNewBlogLink({ title: '', url: '' });
      showMessage('success', 'Blog link added!');
    } catch (error) {
      showMessage('error', 'Error adding blog link: ' + error.message);
    }
  };

  const handleRemoveBlogLink = async (linkId) => {
    try {
      await removeBlogLink(selectedYear, linkId);
      setFormData(prev => ({
        ...prev,
        blogLinks: prev.blogLinks.filter(link => link.id !== linkId)
      }));
      showMessage('success', 'Blog link removed!');
    } catch (error) {
      showMessage('error', 'Error removing blog link: ' + error.message);
    }
  };

  // News Link handlers
  const handleAddNewsLink = async () => {
    if (!newNewsLink.title || !newNewsLink.url) {
      showMessage('error', 'Please fill in both title and URL');
      return;
    }
    
    try {
      const link = await addNewsLink(selectedYear, newNewsLink);
      setFormData(prev => ({
        ...prev,
        newsLinks: [...prev.newsLinks, link]
      }));
      setNewNewsLink({ title: '', url: '' });
      showMessage('success', 'News link added!');
    } catch (error) {
      showMessage('error', 'Error adding news link: ' + error.message);
    }
  };

  const handleRemoveNewsLink = async (linkId) => {
    try {
      await removeNewsLink(selectedYear, linkId);
      setFormData(prev => ({
        ...prev,
        newsLinks: prev.newsLinks.filter(link => link.id !== linkId)
      }));
      showMessage('success', 'News link removed!');
    } catch (error) {
      showMessage('error', 'Error removing news link: ' + error.message);
    }
  };

  // Agenda handlers
  const handleAddAgendaItem = async () => {
    if (!newAgendaItem.time || !newAgendaItem.title) {
      showMessage('error', 'Please fill in time and title');
      return;
    }
    
    try {
      const item = await addAgendaItem(selectedYear, newAgendaItem);
      setFormData(prev => ({
        ...prev,
        agendaItems: [...prev.agendaItems, item]
      }));
      setNewAgendaItem({ time: '', title: '', description: '', speaker: '' });
      showMessage('success', 'Agenda item added!');
    } catch (error) {
      showMessage('error', 'Error adding agenda item: ' + error.message);
    }
  };

  const handleRemoveAgendaItem = async (itemId) => {
    try {
      await removeAgendaItem(selectedYear, itemId);
      setFormData(prev => ({
        ...prev,
        agendaItems: prev.agendaItems.filter(item => item.id !== itemId)
      }));
      showMessage('success', 'Agenda item removed!');
    } catch (error) {
      showMessage('error', 'Error removing agenda item: ' + error.message);
    }
  };

  // Speaker handlers
  const handleAddSpeaker = async () => {
    if (!newSpeaker.name) {
      showMessage('error', 'Please fill in speaker name');
      return;
    }
    
    try {
      const speaker = await addSpeaker(selectedYear, newSpeaker);
      setFormData(prev => ({
        ...prev,
        speakers: [...prev.speakers, speaker]
      }));
      setNewSpeaker({ name: '', title: '', organization: '', bio: '', linkedIn: '', website: '' });
      showMessage('success', 'Speaker added!');
    } catch (error) {
      showMessage('error', 'Error adding speaker: ' + error.message);
    }
  };

  const handleRemoveSpeaker = async (speakerId) => {
    try {
      await removeSpeaker(selectedYear, speakerId);
      setFormData(prev => ({
        ...prev,
        speakers: prev.speakers.filter(speaker => speaker.id !== speakerId)
      }));
      showMessage('success', 'Speaker removed!');
    } catch (error) {
      showMessage('error', 'Error removing speaker: ' + error.message);
    }
  };

  // Poster handlers
  const handleAddPoster = async () => {
    if (!newPoster.title || !newPoster.author) {
      showMessage('error', 'Please fill in poster title and author');
      return;
    }
    
    const poster = {
      id: Date.now().toString(),
      ...newPoster
    };
    
    const updatedPosters = [...formData.posters, poster];
    
    // Update local state
    setFormData(prev => ({
      ...prev,
      posters: updatedPosters
    }));
    
    // Save to Firebase immediately
    try {
      await saveForumData(selectedYear, {
        ...formData,
        posters: updatedPosters
      });
      setNewPoster({ title: '', author: '', affiliations: '', posterLink: '' });
      showMessage('success', 'Poster added and saved!');
    } catch (error) {
      showMessage('error', 'Error saving poster: ' + error.message);
    }
  };

  const handleRemovePoster = async (posterId) => {
    const updatedPosters = formData.posters.filter(poster => poster.id !== posterId);
    
    // Update local state
    setFormData(prev => ({
      ...prev,
      posters: updatedPosters
    }));
    
    // Save to Firebase immediately
    try {
      await saveForumData(selectedYear, {
        ...formData,
        posters: updatedPosters
      });
      showMessage('success', 'Poster removed and saved!');
    } catch (error) {
      showMessage('error', 'Error removing poster: ' + error.message);
    }
  };

  // Sponsor handlers
  const handleAddSponsor = async () => {
    if (!newSponsor.name) {
      showMessage('error', 'Please fill in sponsor name');
      return;
    }
    
    try {
      const sponsor = await addSponsor(selectedYear, newSponsor);
      setFormData(prev => ({
        ...prev,
        sponsors: [...prev.sponsors, sponsor]
      }));
      setNewSponsor({ name: '', logo: '', website: '', tier: 'standard' });
      showMessage('success', 'Sponsor added!');
    } catch (error) {
      showMessage('error', 'Error adding sponsor: ' + error.message);
    }
  };

  const handleRemoveSponsor = async (sponsorId) => {
    try {
      await removeSponsor(selectedYear, sponsorId);
      setFormData(prev => ({
        ...prev,
        sponsors: prev.sponsors.filter(sponsor => sponsor.id !== sponsorId)
      }));
      showMessage('success', 'Sponsor removed!');
    } catch (error) {
      showMessage('error', 'Error removing sponsor: ' + error.message);
    }
  };

  const handleDeleteForum = async () => {
    try {
      await deleteForumData(selectedYear);
      showMessage('success', `Forum data for ${selectedYear} deleted successfully!`);
      setShowDeleteConfirm(false);
      // Reset form
      loadForumData();
    } catch (error) {
      showMessage('error', 'Error deleting forum: ' + error.message);
    }
  };

  const handleClearAll = async () => {
    try {
      // Clear all form data but don't delete from Firebase
      setFormData({
        title: `All-Island Forum on Cancer ${selectedYear}`,
        subtitle: 'From Data to Impact: Roadmap for Cancer Data',
        date: '',
        venue: '',
        description: '',
        highlights: '',
        coverImage: '',
        heroImage: '',
        mediaGalleryUrl: '',
        registrationLink: '',
        submitAbstractLink: '',
        status: 'upcoming',
        posterSubmissionOpen: false,
        blogLinks: [],
        newsLinks: [],
        agendaItems: [],
        speakers: [],
        posters: [],
        sponsors: []
      });
      
      // Save the empty data to Firebase (effectively clearing it)
      await saveForumData(selectedYear, {
        title: `All-Island Forum on Cancer ${selectedYear}`,
        subtitle: 'From Data to Impact: Roadmap for Cancer Data',
        date: '',
        venue: '',
        description: '',
        highlights: '',
        coverImage: '',
        heroImage: '',
        mediaGalleryUrl: '',
        registrationLink: '',
        submitAbstractLink: '',
        status: 'upcoming',
        posterSubmissionOpen: false,
        blogLinks: [],
        newsLinks: [],
        agendaItems: [],
        speakers: [],
        posters: [],
        sponsors: []
      });
      
      setShowClearConfirm(false);
      showMessage('success', `All data for ${selectedYear} cleared successfully!`);
    } catch (error) {
      showMessage('error', 'Error clearing data: ' + error.message);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  if (loading) {
    return (
      <div className="admin-forum-loading">
        <div className="loader"></div>
        <p>Loading forum data...</p>
      </div>
    );
  }

  return (
    <div className="admin-forum-container">
      <div className="admin-forum-header">
        <div className="header-content">
          <h1>All-Island Forum Management</h1>
          <p>Manage forum information, links, and content</p>
        </div>
        
        <div className="year-selector">
          <label>Select Year:</label>
          <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
            <option value="2027">2027</option>
          </select>
        </div>
      </div>

      {message.text && (
        <div className={`message-banner ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="admin-forum-tabs">
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
          Content & Links
        </button>
        <button 
          className={activeTab === 'agenda' ? 'active' : ''} 
          onClick={() => setActiveTab('agenda')}
        >
          Agenda
        </button>
        <button 
          className={activeTab === 'speakers' ? 'active' : ''} 
          onClick={() => setActiveTab('speakers')}
        >
          Speakers
        </button>
        <button 
          className={activeTab === 'posters' ? 'active' : ''} 
          onClick={() => setActiveTab('posters')}
        >
          Posters
        </button>
        <button 
          className={activeTab === 'sponsors' ? 'active' : ''} 
          onClick={() => setActiveTab('sponsors')}
        >
          Sponsors
        </button>
      </div>

      <div className="admin-forum-content">
        {/* BASIC INFO TAB */}
        {activeTab === 'basic' && (
          <div className="tab-content">
            <div className="form-section">
              <h2>Basic Information</h2>
              
              <div className="form-group">
                <label>Forum Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., All-Island Forum on Cancer 2025"
                  required
                />
              </div>

              <div className="form-group">
                <label>Subtitle</label>
                <input
                  type="text"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleInputChange}
                  placeholder="e.g., From Data to Impact: Roadmap for Cancer Data"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Date *</label>
                  <input
                    type="text"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    placeholder="e.g., June 4, 2025"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Venue *</label>
                  <input
                    type="text"
                    name="venue"
                    value={formData.venue}
                    onChange={handleInputChange}
                    placeholder="e.g., Dublin Conference Center"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Status</label>
                <select name="status" value={formData.status} onChange={handleInputChange}>
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="past">Past</option>
                </select>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Brief description of the forum. Press Enter twice for new paragraphs..."
                  rows="6"
                />
                <small style={{color: '#666', fontSize: '13px', marginTop: '4px', display: 'block'}}>
                  Tip: Press Enter twice to create new paragraphs that will display on the public page
                </small>
              </div>

              <div className="form-group">
                <label>Highlights / Key Takeaways</label>
                <textarea
                  name="highlights"
                  value={formData.highlights}
                  onChange={handleInputChange}
                  placeholder="Key highlights from the forum. Press Enter twice for new paragraphs..."
                  rows="6"
                />
                <small style={{color: '#666', fontSize: '13px', marginTop: '4px', display: 'block'}}>
                  Tip: Press Enter twice to create new paragraphs that will display on the public page
                </small>
              </div>
            </div>

            <div className="form-section">
              <h2>Images</h2>
              
              <div className="image-upload-group">
                <div className="image-upload-item">
                  <label>Cover Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'cover')}
                    disabled={uploadingCover}
                  />
                  {uploadingCover && <p className="uploading-text">Uploading...</p>}
                  {formData.coverImage && (
                    <div className="image-preview">
                      <img src={formData.coverImage} alt="Cover preview" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2>Links & Settings</h2>
              
              <div className="form-group">
                <label>Media Gallery URL</label>
                <input
                  type="url"
                  name="mediaGalleryUrl"
                  value={formData.mediaGalleryUrl}
                  onChange={handleInputChange}
                  placeholder="https://photos.google.com/..."
                />
              </div>

              <div className="form-group">
                <label>Registration Link</label>
                <input
                  type="url"
                  name="registrationLink"
                  value={formData.registrationLink}
                  onChange={handleInputChange}
                  placeholder="https://eventbrite.com/..."
                />
              </div>

              <div className="form-group">
                <label>Submit Abstract Link</label>
                <input
                  type="url"
                  name="submitAbstractLink"
                  value={formData.submitAbstractLink}
                  onChange={handleInputChange}
                  placeholder="https://forms.gle/..."
                />
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="posterSubmissionOpen"
                    checked={formData.posterSubmissionOpen}
                    onChange={handleInputChange}
                  />
                  <span>Enable Poster Abstract Submissions</span>
                </label>
                <small style={{color: '#666', fontSize: '13px', marginTop: '4px', display: 'block'}}>
                  When enabled, shows "Submit Abstract" button for upcoming events
                </small>
              </div>
            </div>
          </div>
        )}

        {/* Content & Links, Agenda, Speakers tabs remain the same... */}
        {/* Adding the new Sponsors tab */}

        {activeTab === 'content' && (
          <div className="tab-content">
            {/* Same content as before */}
            <div className="form-section">
              <h2>Blog Links</h2>
              
              <div className="add-item-form">
                <input
                  type="text"
                  placeholder="Blog post title"
                  value={newBlogLink.title}
                  onChange={(e) => setNewBlogLink({ ...newBlogLink, title: e.target.value })}
                />
                <input
                  type="url"
                  placeholder="Blog post URL"
                  value={newBlogLink.url}
                  onChange={(e) => setNewBlogLink({ ...newBlogLink, url: e.target.value })}
                />
                <button className="btn-add" onClick={handleAddBlogLink}>Add Blog Link</button>
              </div>

              <div className="links-list">
                {formData.blogLinks.map((link) => (
                  <div key={link.id} className="link-item">
                    <div className="link-info">
                      <strong>{link.title}</strong>
                      <a href={link.url} target="_blank" rel="noopener noreferrer">{link.url}</a>
                    </div>
                    <button className="btn-remove" onClick={() => handleRemoveBlogLink(link.id)}>Remove</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-section">
              <h2>News Links</h2>
              
              <div className="add-item-form">
                <input
                  type="text"
                  placeholder="News article title"
                  value={newNewsLink.title}
                  onChange={(e) => setNewNewsLink({ ...newNewsLink, title: e.target.value })}
                />
                <input
                  type="url"
                  placeholder="News article URL"
                  value={newNewsLink.url}
                  onChange={(e) => setNewNewsLink({ ...newNewsLink, url: e.target.value })}
                />
                <button className="btn-add" onClick={handleAddNewsLink}>Add News Link</button>
              </div>

              <div className="links-list">
                {formData.newsLinks.map((link) => (
                  <div key={link.id} className="link-item">
                    <div className="link-info">
                      <strong>{link.title}</strong>
                      <a href={link.url} target="_blank" rel="noopener noreferrer">{link.url}</a>
                    </div>
                    <button className="btn-remove" onClick={() => handleRemoveNewsLink(link.id)}>Remove</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'agenda' && (
          <div className="tab-content">
            <div className="form-section">
              <h2>Agenda Items</h2>
              
              <div className="add-item-form agenda-form">
                <input
                  type="text"
                  placeholder="Time (e.g., 9:00 AM)"
                  value={newAgendaItem.time}
                  onChange={(e) => setNewAgendaItem({ ...newAgendaItem, time: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Session title"
                  value={newAgendaItem.title}
                  onChange={(e) => setNewAgendaItem({ ...newAgendaItem, title: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Speaker name"
                  value={newAgendaItem.speaker}
                  onChange={(e) => setNewAgendaItem({ ...newAgendaItem, speaker: e.target.value })}
                />
                <textarea
                  placeholder="Description (optional)"
                  value={newAgendaItem.description}
                  onChange={(e) => setNewAgendaItem({ ...newAgendaItem, description: e.target.value })}
                  rows="2"
                />
                <button className="btn-add" onClick={handleAddAgendaItem}>Add Agenda Item</button>
              </div>

              <div className="agenda-list">
                {formData.agendaItems.map((item) => (
                  <div key={item.id} className="agenda-item">
                    <div className="agenda-time">{item.time}</div>
                    <div className="agenda-details">
                      <strong>{item.title}</strong>
                      {item.speaker && <p className="agenda-speaker">Speaker: {item.speaker}</p>}
                      {item.description && <p className="agenda-description">{item.description}</p>}
                    </div>
                    <button className="btn-remove" onClick={() => handleRemoveAgendaItem(item.id)}>Remove</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'speakers' && (
          <div className="tab-content">
            <div className="form-section">
              <h2>Speakers</h2>
              <p style={{color: '#666', marginBottom: '20px'}}>
                Add confirmed speakers for the forum. Shows as "Confirmed Speakers" for upcoming events and "Featured Speakers" for past events.
              </p>
              
              <div className="add-item-form speaker-form">
                <input
                  type="text"
                  placeholder="Speaker name *"
                  value={newSpeaker.name}
                  onChange={(e) => setNewSpeaker({ ...newSpeaker, name: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Title/Position"
                  value={newSpeaker.title}
                  onChange={(e) => setNewSpeaker({ ...newSpeaker, title: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Organization"
                  value={newSpeaker.organization}
                  onChange={(e) => setNewSpeaker({ ...newSpeaker, organization: e.target.value })}
                />
                <input
                  type="url"
                  placeholder="LinkedIn URL (optional)"
                  value={newSpeaker.linkedIn}
                  onChange={(e) => setNewSpeaker({ ...newSpeaker, linkedIn: e.target.value })}
                />
                <input
                  type="url"
                  placeholder="Personal Website (optional)"
                  value={newSpeaker.website}
                  onChange={(e) => setNewSpeaker({ ...newSpeaker, website: e.target.value })}
                />
                <textarea
                  placeholder="Bio (optional)"
                  value={newSpeaker.bio}
                  onChange={(e) => setNewSpeaker({ ...newSpeaker, bio: e.target.value })}
                  rows="3"
                />
                <button className="btn-add" onClick={handleAddSpeaker}>Add Speaker</button>
              </div>

              <div className="links-list">
                {formData.speakers.map((speaker) => (
                  <div key={speaker.id} className="link-item">
                    <div className="link-info">
                      <strong>{speaker.name}</strong>
                      {speaker.title && <p style={{margin: '4px 0', color: '#666'}}>{speaker.title}</p>}
                      {speaker.organization && <p style={{margin: '4px 0', color: '#666'}}>{speaker.organization}</p>}
                      {speaker.bio && <p style={{margin: '4px 0', fontSize: '14px', color: '#777'}}>{speaker.bio}</p>}
                      <div style={{marginTop: '8px', display: 'flex', gap: '12px'}}>
                        {speaker.linkedIn && (
                          <a href={speaker.linkedIn} target="_blank" rel="noopener noreferrer" style={{fontSize: '14px', color: '#0077B5'}}>
                            LinkedIn →
                          </a>
                        )}
                        {speaker.website && (
                          <a href={speaker.website} target="_blank" rel="noopener noreferrer" style={{fontSize: '14px', color: '#3B6B8F'}}>
                            Website →
                          </a>
                        )}
                      </div>
                    </div>
                    <button className="btn-remove" onClick={() => handleRemoveSpeaker(speaker.id)}>Remove</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'posters' && (
          <div className="tab-content">
            <div className="form-section">
              <h2>Poster Presentations</h2>
              <p style={{color: '#666', marginBottom: '20px'}}>
                For past events: Add presented posters with download links.<br />
                For upcoming events: Enable submission button in Basic Info tab.
              </p>
              
              <div className="add-item-form">
                <input
                  type="text"
                  placeholder="Poster title *"
                  value={newPoster.title}
                  onChange={(e) => setNewPoster({ ...newPoster, title: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Author *"
                  value={newPoster.author}
                  onChange={(e) => setNewPoster({ ...newPoster, author: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Affiliations"
                  value={newPoster.affiliations}
                  onChange={(e) => setNewPoster({ ...newPoster, affiliations: e.target.value })}
                />
                <input
                  type="url"
                  placeholder="Poster PDF Link (optional) - e.g., Google Drive link"
                  value={newPoster.posterLink}
                  onChange={(e) => setNewPoster({ ...newPoster, posterLink: e.target.value })}
                />
                <button className="btn-add" onClick={handleAddPoster}>Add Poster</button>
              </div>

              <div className="links-list">
                {formData.posters.map((poster) => (
                  <div key={poster.id} className="link-item">
                    <div className="link-info">
                      <strong>{poster.title}</strong>
                      <p style={{margin: '4px 0', color: '#666'}}>Author: {poster.author}</p>
                      {poster.affiliations && <p style={{margin: '4px 0', fontSize: '14px', color: '#777'}}>{poster.affiliations}</p>}
                      {poster.posterLink && (
                        <a href={poster.posterLink} target="_blank" rel="noopener noreferrer" style={{margin: '4px 0', fontSize: '14px', color: '#3B6B8F'}}>
                          View Poster PDF →
                        </a>
                      )}
                    </div>
                    <button className="btn-remove" onClick={() => handleRemovePoster(poster.id)}>Remove</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sponsors' && (
          <div className="tab-content">
            <div className="form-section">
              <h2>Event Sponsors</h2>
              <p style={{color: '#666', marginBottom: '20px'}}>
                Add sponsors and their logos. They will appear at the bottom of the forum page.
              </p>
              
              <div className="add-item-form sponsor-form">
                <input
                  type="text"
                  placeholder="Sponsor name *"
                  value={newSponsor.name}
                  onChange={(e) => setNewSponsor({ ...newSponsor, name: e.target.value })}
                />
                <input
                  type="url"
                  placeholder="Sponsor website (optional)"
                  value={newSponsor.website}
                  onChange={(e) => setNewSponsor({ ...newSponsor, website: e.target.value })}
                />
                <select
                  value={newSponsor.tier}
                  onChange={(e) => setNewSponsor({ ...newSponsor, tier: e.target.value })}
                >
                  <option value="platinum">Platinum</option>
                  <option value="gold">Gold</option>
                  <option value="silver">Silver</option>
                  <option value="bronze">Bronze</option>
                  <option value="standard">Standard</option>
                </select>
                <div className="sponsor-logo-upload">
                  <label>Sponsor Logo:</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSponsorLogoUpload}
                    disabled={uploadingSponsorLogo}
                  />
                  {uploadingSponsorLogo && <span className="uploading-text">Uploading...</span>}
                  {newSponsor.logo && (
                    <img src={newSponsor.logo} alt="Logo preview" className="sponsor-logo-preview" />
                  )}
                </div>
                <button className="btn-add" onClick={handleAddSponsor}>Add Sponsor</button>
              </div>

              <div className="sponsors-list">
                {formData.sponsors.map((sponsor) => (
                  <div key={sponsor.id} className="sponsor-item">
                    {sponsor.logo && (
                      <img src={sponsor.logo} alt={sponsor.name} className="sponsor-logo-thumb" />
                    )}
                    <div className="sponsor-info">
                      <strong>{sponsor.name}</strong>
                      <span className={`tier-badge ${sponsor.tier}`}>{sponsor.tier}</span>
                      {sponsor.website && (
                        <a href={sponsor.website} target="_blank" rel="noopener noreferrer">
                          Visit Website →
                        </a>
                      )}
                    </div>
                    <button className="btn-remove" onClick={() => handleRemoveSponsor(sponsor.id)}>Remove</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="admin-forum-actions">
        <div className="actions-left">
          <button className="btn-clear" onClick={() => setShowClearConfirm(true)}>
            Clear All Data
          </button>
          <button className="btn-delete" onClick={() => setShowDeleteConfirm(true)}>
            Delete Forum
          </button>
        </div>
        <button className="btn-save" onClick={handleSaveForm} disabled={saving}>
          {saving ? 'Saving...' : 'Save Forum Data'}
        </button>
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="modal-overlay" onClick={() => setShowClearConfirm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>🗑️ Clear All Data</h3>
            <p>This will remove all content for <strong>{selectedYear}</strong>:</p>
            <ul className="clear-list">
              <li>All text content (title, description, highlights)</li>
              <li>All images (hero and cover)</li>
              <li>All blog and news links</li>
              <li>All agenda items</li>
              <li>All speakers</li>
              <li>All sponsors</li>
            </ul>
            <p className="warning-text">You can add new data after clearing.</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowClearConfirm(false)}>
                Cancel
              </button>
              <button className="btn-confirm-clear" onClick={handleClearAll}>
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>⚠️ Delete Forum</h3>
            <p>Are you sure you want to <strong>permanently delete</strong> the forum for <strong>{selectedYear}</strong>?</p>
            <p className="warning-text">This action cannot be undone! The forum will be completely removed from the database.</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </button>
              <button className="btn-confirm-delete" onClick={handleDeleteForum}>
                Yes, Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminForum;