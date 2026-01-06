// src/pages/AdminOHDSISeminars.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import {
  saveSeminarData,
  getAllSeminars,
  getSeminarById,
  deleteSeminar,
  uploadFlyerImage,
  getUserRole
} from '../services/ohdsiSeminarService';
import './AdminOHDSISeminars.css';

const AdminOHDSISeminars = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [seminars, setSeminars] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [uploadingFlyer, setUploadingFlyer] = useState(false);

  // Form data - ADDED slidesLink
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    speaker: '',
    description: '',
    teamsLink: '',
    recordingLink: '',
    slidesLink: '',
    flyerImage: '',
    status: 'upcoming'
  });

  useEffect(() => {
    checkAuth();
    loadSeminars();
  }, []);

  const checkAuth = () => {
    const currentUser = auth.currentUser;
    if (!currentUser || getUserRole(currentUser.email) !== 'admin') {
      navigate('/login');
    }
  };

  const loadSeminars = async () => {
    setLoading(true);
    try {
      const data = await getAllSeminars();
      setSeminars(data);
    } catch (error) {
      showMessage('error', 'Error loading seminars: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFlyerUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingFlyer(true);
    try {
      const imageUrl = await uploadFlyerImage(file, editingId || 'new');
      setFormData(prev => ({
        ...prev,
        flyerImage: imageUrl
      }));
      showMessage('success', 'Flyer image uploaded successfully!');
    } catch (error) {
      showMessage('error', 'Error uploading image: ' + error.message);
    } finally {
      setUploadingFlyer(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title || !formData.date || !formData.speaker) {
      showMessage('error', 'Please fill in title, date, and speaker');
      return;
    }

    if (formData.status === 'upcoming' && !formData.time) {
      showMessage('error', 'Please add time for upcoming seminars');
      return;
    }

    setSaving(true);
    try {
      await saveSeminarData(editingId, formData);
      showMessage('success', editingId ? 'Seminar updated!' : 'Seminar created!');
      resetForm();
      loadSeminars();
    } catch (error) {
      showMessage('error', 'Error saving seminar: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (seminarId) => {
    try {
      const seminar = await getSeminarById(seminarId);
      setFormData({
        title: seminar.title || '',
        date: seminar.date || '',
        time: seminar.time || '',
        speaker: seminar.speaker || '',
        description: seminar.description || '',
        teamsLink: seminar.teamsLink || '',
        recordingLink: seminar.recordingLink || '',
        slidesLink: seminar.slidesLink || '',
        flyerImage: seminar.flyerImage || '',
        status: seminar.status || 'upcoming'
      });
      setEditingId(seminarId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      showMessage('error', 'Error loading seminar: ' + error.message);
    }
  };

  const handleDelete = async (seminarId) => {
    try {
      await deleteSeminar(seminarId);
      showMessage('success', 'Seminar deleted successfully!');
      setShowDeleteConfirm(null);
      loadSeminars();
    } catch (error) {
      showMessage('error', 'Error deleting seminar: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      date: '',
      time: '',
      speaker: '',
      description: '',
      teamsLink: '',
      recordingLink: '',
      slidesLink: '',
      flyerImage: '',
      status: 'upcoming'
    });
    setEditingId(null);
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  if (loading) {
    return (
      <div className="admin-seminars-loading">
        <div className="loader"></div>
        <p>Loading seminars...</p>
      </div>
    );
  }

  return (
    <div className="admin-seminars-container">
      <div className="admin-seminars-header">
        <h1>OHDSI Seminars Management</h1>
        <p>Manage seminar series information and flyers</p>
      </div>

      {message.text && (
        <div className={`message-banner ${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Form Section */}
      <div className="seminar-form-card">
        <h2>{editingId ? 'Edit Seminar' : 'Add New Seminar'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Introduction to OMOP CDM"
                required
              />
            </div>

            <div className="form-group">
              <label>Status *</label>
              <select name="status" value={formData.status} onChange={handleInputChange}>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Time {formData.status === 'upcoming' && '*'}</label>
              <input
                type="text"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                placeholder="e.g., 10:00 AM GMT"
                required={formData.status === 'upcoming'}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Speaker *</label>
            <input
              type="text"
              name="speaker"
              value={formData.speaker}
              onChange={handleInputChange}
              placeholder="e.g., Dr. John Doe"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Brief description of the seminar..."
              rows="4"
            />
          </div>

          {formData.status === 'upcoming' && (
            <div className="form-group">
              <label>Teams Meeting Link</label>
              <input
                type="url"
                name="teamsLink"
                value={formData.teamsLink}
                onChange={handleInputChange}
                placeholder="https://teams.microsoft.com/..."
              />
            </div>
          )}

          {formData.status === 'past' && (
            <>
              <div className="form-group">
                <label>Recording Link (optional)</label>
                <input
                  type="url"
                  name="recordingLink"
                  value={formData.recordingLink}
                  onChange={handleInputChange}
                  placeholder="https://youtube.com/..."
                />
              </div>

              <div className="form-group">
                <label>Slides Link (optional)</label>
                <input
                  type="url"
                  name="slidesLink"
                  value={formData.slidesLink}
                  onChange={handleInputChange}
                  placeholder="https://drive.google.com/..."
                />
                <p className="field-hint">
                  💡 Tip: Share your Google Drive file and paste the link here
                </p>
              </div>
            </>
          )}

          <div className="form-group">
            <label>Flyer Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFlyerUpload}
              disabled={uploadingFlyer}
            />
            {uploadingFlyer && <p className="uploading-text">Uploading...</p>}
            {formData.flyerImage && (
              <div className="image-preview">
                <img src={formData.flyerImage} alt="Flyer preview" />
              </div>
            )}
          </div>

          <div className="form-actions">
            {editingId && (
              <button type="button" className="btn-cancel" onClick={resetForm}>
                Cancel Edit
              </button>
            )}
            <button type="submit" className="btn-save" disabled={saving}>
              {saving ? 'Saving...' : editingId ? 'Update Seminar' : 'Add Seminar'}
            </button>
          </div>
        </form>
      </div>

      {/* Seminars List */}
      <div className="seminars-list-card">
        <h2>All Seminars ({seminars.length})</h2>
        
        {seminars.length === 0 ? (
          <p className="no-seminars">No seminars added yet.</p>
        ) : (
          <div className="seminars-grid">
            {seminars.map((seminar) => (
              <div key={seminar.id} className="seminar-item">
                {seminar.flyerImage && (
                  <div className="seminar-flyer">
                    <img src={seminar.flyerImage} alt={seminar.title} />
                  </div>
                )}
                <div className="seminar-content">
                  <div className="seminar-status-badge" data-status={seminar.status}>
                    {seminar.status === 'upcoming' ? '🗓️ Upcoming' : '✅ Past'}
                  </div>
                  <h3>{seminar.title}</h3>
                  <p className="seminar-meta">
                    <strong>Date:</strong> {seminar.date}
                    {seminar.time && ` at ${seminar.time}`}
                  </p>
                  <p className="seminar-meta">
                    <strong>Speaker:</strong> {seminar.speaker}
                  </p>
                  {seminar.description && (
                    <p className="seminar-description">{seminar.description}</p>
                  )}
                  <div className="seminar-links">
                    {seminar.teamsLink && (
                      <a href={seminar.teamsLink} target="_blank" rel="noopener noreferrer" className="link-badge teams">
                        📹 Teams Link
                      </a>
                    )}
                    {seminar.recordingLink && (
                      <a href={seminar.recordingLink} target="_blank" rel="noopener noreferrer" className="link-badge recording">
                        ▶️ Recording
                      </a>
                    )}
                    {seminar.slidesLink && (
                      <a href={seminar.slidesLink} target="_blank" rel="noopener noreferrer" className="link-badge slides">
                        📄 Slides
                      </a>
                    )}
                  </div>
                </div>
                <div className="seminar-actions">
                  <button className="btn-edit" onClick={() => handleEdit(seminar.id)}>
                    Edit
                  </button>
                  <button className="btn-delete" onClick={() => setShowDeleteConfirm(seminar.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>⚠️ Delete Seminar</h3>
            <p>Are you sure you want to delete this seminar?</p>
            <p className="warning-text">This action cannot be undone!</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowDeleteConfirm(null)}>
                Cancel
              </button>
              <button className="btn-confirm-delete" onClick={() => handleDelete(showDeleteConfirm)}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOHDSISeminars;