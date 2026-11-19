// src/components/AdminResearchOutputs.js
// Publications & Outputs management, shown inside the News admin page
import React, { useState, useEffect, useMemo } from 'react';
import {
  getAllOutputs,
  createOutput,
  updateOutput,
  deleteOutput,
  toggleOutputPublished,
  validateOutput,
  formatOutputDate,
  OUTPUT_TYPES,
  MONTHS
} from '../services/researchOutputsService';
import './AdminNews.css';

const emptyForm = (type = 'publication') => ({
  type,
  year: String(new Date().getFullYear()),
  month: '',
  authors: '',
  title: '',
  source: '',
  citation: '',
  doi: '',
  pmid: '',
  link: '',
  pdfUrl: '',
  url: '',
  description: '',
  imageUrl: '',
  imageCaption: '',
  order: 0,
  published: true
});

const getTypeLabel = (type) => OUTPUT_TYPES.find(t => t.value === type)?.label || type;

const AdminResearchOutputs = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [outputs, setOutputs] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeView, setActiveView] = useState('list'); // 'list' or 'edit'
  const [editingOutput, setEditingOutput] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState(emptyForm());

  // List filters
  const [typeFilter, setTypeFilter] = useState('publication');
  const [yearFilter, setYearFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadOutputs();
  }, []);

  const loadOutputs = async () => {
    setLoading(true);
    try {
      setOutputs(await getAllOutputs(false));
    } catch (error) {
      showMessage('error', 'Error loading outputs: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const yearsForType = useMemo(() =>
    [...new Set(outputs.filter(o => o.type === typeFilter).map(o => String(o.year)))].sort((a, b) => b.localeCompare(a)),
  [outputs, typeFilter]);

  const filteredOutputs = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    return outputs.filter(output =>
      output.type === typeFilter &&
      (!yearFilter || String(output.year) === yearFilter) &&
      (!search || [output.title, output.authors, output.source, output.citation, output.doi]
        .some(value => (value || '').toLowerCase().includes(search)))
    );
  }, [outputs, typeFilter, yearFilter, searchTerm]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleNewOutput = () => {
    setEditingOutput(null);
    setFormData(emptyForm(typeFilter));
    setActiveView('edit');
  };

  const handleEditOutput = (output) => {
    setEditingOutput(output);
    setFormData({ ...emptyForm(output.type), ...output, month: output.month ? String(output.month) : '' });
    setActiveView('edit');
  };

  const handleBackToList = () => {
    setActiveView('list');
    setEditingOutput(null);
  };

  const handleSaveOutput = async () => {
    const errors = validateOutput(formData);
    if (errors.length > 0) {
      showMessage('error', errors.join('. '));
      return;
    }
    setSaving(true);
    try {
      if (editingOutput) {
        await updateOutput(editingOutput.id, formData);
        showMessage('success', `${getTypeLabel(formData.type)} updated`);
      } else {
        await createOutput(formData);
        showMessage('success', `${getTypeLabel(formData.type)} added`);
      }
      setTypeFilter(formData.type);
      await loadOutputs();
      handleBackToList();
    } catch (error) {
      showMessage('error', 'Error saving: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async (output) => {
    try {
      await toggleOutputPublished(output.id, !output.published);
      await loadOutputs();
      showMessage('success', output.published ? 'Hidden from the website' : 'Published');
    } catch (error) {
      showMessage('error', 'Error updating: ' + error.message);
    }
  };

  const handleDeleteOutput = async (outputId) => {
    try {
      await deleteOutput(outputId);
      await loadOutputs();
      showMessage('success', 'Deleted');
    } catch (error) {
      showMessage('error', 'Error deleting: ' + error.message);
    } finally {
      setShowDeleteConfirm(null);
    }
  };

  const isPublication = formData.type === 'publication';

  if (loading) {
    return (
      <div className="admin-news-loading">
        <div className="loader"></div>
        <p>Loading publications & outputs...</p>
      </div>
    );
  }

  return (
    <>
      <div className="admin-news-header">
        <div className="header-content">
          <h1>Publications & Outputs</h1>
          <p>Publications, reports, posters and presentations shown on the Research Outputs page</p>
        </div>
        {activeView === 'list' && (
          <button className="btn-new-article" onClick={handleNewOutput}>
            + New {getTypeLabel(typeFilter)}
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
        <>
          <div className="outputs-filter-bar">
            <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setYearFilter(''); }}>
              {OUTPUT_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.plural} ({outputs.filter(o => o.type === type.value).length})
                </option>
              ))}
            </select>
            <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)}>
              <option value="">All years</option>
              {yearsForType.map(year => <option key={year} value={year}>{year}</option>)}
            </select>
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search title, authors, journal or DOI..."
            />
          </div>

          <div className="articles-list">
            {filteredOutputs.length === 0 ? (
              <div className="no-articles">
                <p>No {OUTPUT_TYPES.find(t => t.value === typeFilter)?.plural.toLowerCase()} found. Click "New {getTypeLabel(typeFilter)}" to add one.</p>
              </div>
            ) : (
              filteredOutputs.map(output => (
                <div key={output.id} className={`article-card ${output.published ? 'published' : 'draft'}`}>
                  {output.imageUrl && (
                    <div className="article-card-image">
                      <img src={output.imageUrl} alt={output.title} />
                    </div>
                  )}
                  <div className="article-card-content">
                    <div className="article-card-header">
                      <span className={`type-badge ${output.type}`}>{getTypeLabel(output.type)}</span>
                      <span className={`status-badge ${output.published ? 'published' : 'draft'}`}>
                        {output.published ? 'Published' : 'Hidden'}
                      </span>
                    </div>
                    <h3>{output.title || output.citation}</h3>
                    {output.authors && <p className="article-excerpt">{output.authors}</p>}
                    <div className="article-meta">
                      <span>{output.type === 'publication' ? (output.source || output.year) : formatOutputDate(output)}</span>
                      {output.doi && <span>DOI {output.doi}</span>}
                      {output.pmid && <span>PMID {output.pmid}</span>}
                    </div>
                  </div>
                  <div className="article-card-actions">
                    <button className="btn-edit" onClick={() => handleEditOutput(output)}>
                      Edit
                    </button>
                    <button
                      className={`btn-publish ${output.published ? 'unpublish' : ''}`}
                      onClick={() => handleTogglePublish(output)}
                    >
                      {output.published ? 'Hide' : 'Publish'}
                    </button>
                    <button className="btn-delete" onClick={() => setShowDeleteConfirm(output.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* EDIT VIEW */}
      {activeView === 'edit' && (
        <div className="article-editor">
          <div className="editor-content">
            <div className="tab-content">
              <div className="form-section">
                <h2>{editingOutput ? `Edit ${getTypeLabel(formData.type)}` : `New ${getTypeLabel(formData.type)}`}</h2>

                <div className="form-group">
                  <label>Type *</label>
                  <select name="type" value={formData.type} onChange={handleInputChange}>
                    {OUTPUT_TYPES.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Title *</label>
                  <textarea
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder={isPublication ? 'Paper title, without quotation marks' : 'Title'}
                    rows="2"
                  />
                  {formData.citation && !formData.title && (
                    <small>This older entry is stored as one citation: {formData.citation}</small>
                  )}
                </div>

                <div className="form-group">
                  <label>Authors{isPublication ? ' *' : ''}</label>
                  <textarea
                    name="authors"
                    value={formData.authors}
                    onChange={handleInputChange}
                    placeholder="e.g., Lawler M, Culhane AC, Smith J"
                    rows="2"
                  />
                </div>

                {isPublication && (
                  <div className="form-group">
                    <label>Journal / source *</label>
                    <input
                      type="text"
                      name="source"
                      value={formData.source}
                      onChange={handleInputChange}
                      placeholder="e.g., Lancet Oncol. 27.10 (Oct. 2026), pp. 1201–1210"
                    />
                    <small>Shown after the title, exactly as typed</small>
                  </div>
                )}

                <div className="form-row">
                  <div className="form-group">
                    <label>Year *</label>
                    <input
                      type="text"
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      placeholder="e.g., 2026"
                      inputMode="numeric"
                      maxLength="4"
                    />
                  </div>
                  <div className="form-group">
                    <label>Month</label>
                    <select name="month" value={formData.month} onChange={handleInputChange}>
                      <option value="">Not specified</option>
                      {MONTHS.map((month, index) => (
                        <option key={month} value={String(index + 1)}>{month}</option>
                      ))}
                    </select>
                    <small>Used to sort newest first within the year</small>
                  </div>
                </div>

                {isPublication ? (
                  <>
                    <div className="form-row">
                      <div className="form-group">
                        <label>DOI</label>
                        <input
                          type="text"
                          name="doi"
                          value={formData.doi}
                          onChange={handleInputChange}
                          placeholder="e.g., 10.1016/S1470-2045(26)00302-5"
                        />
                        <small>A pasted doi.org link also works</small>
                      </div>
                      <div className="form-group">
                        <label>PubMed ID</label>
                        <input
                          type="text"
                          name="pmid"
                          value={formData.pmid}
                          onChange={handleInputChange}
                          placeholder="e.g., 42790448"
                        />
                        <small>A pasted PubMed link also works</small>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Article link</label>
                      <input
                        type="url"
                        name="link"
                        value={formData.link}
                        onChange={handleInputChange}
                        placeholder="Only needed when there is no DOI or PubMed ID"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Short summary"
                        rows="3"
                      />
                    </div>
                    {formData.type !== 'report' && (
                      <div className="form-group">
                        <label>Link</label>
                        <input
                          type="url"
                          name="url"
                          value={formData.url}
                          onChange={handleInputChange}
                          placeholder="https://..."
                        />
                      </div>
                    )}
                  </>
                )}

                <div className="form-group">
                  <label>PDF link{formData.type === 'report' ? ' *' : ''}</label>
                  <input
                    type="url"
                    name="pdfUrl"
                    value={formData.pdfUrl}
                    onChange={handleInputChange}
                    placeholder="https://..."
                  />
                </div>

                {formData.type === 'report' && (
                  <>
                    <div className="form-group">
                      <label>Cover image URL (imgbb)</label>
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
                      <label>Image caption</label>
                      <input
                        type="text"
                        name="imageCaption"
                        value={formData.imageCaption}
                        onChange={handleInputChange}
                      />
                    </div>
                  </>
                )}

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
                  <small>Only published entries are shown on the website</small>
                </div>
              </div>
            </div>
          </div>

          <div className="editor-actions">
            <button className="btn-cancel" onClick={handleBackToList}>
              Cancel
            </button>
            <button className="btn-save" onClick={handleSaveOutput} disabled={saving}>
              {saving ? 'Saving...' : (editingOutput ? 'Update' : 'Add')}
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Delete</h3>
            <p>Are you sure you want to delete this entry? This action cannot be undone. To take it off the website without deleting it, use Hide instead.</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowDeleteConfirm(null)}>
                Cancel
              </button>
              <button className="btn-confirm-delete" onClick={() => handleDeleteOutput(showDeleteConfirm)}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminResearchOutputs;
