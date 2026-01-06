// src/pages/AdminForum.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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

// Sortable Item Component for Agenda
const SortableAgendaItem = ({ item, index, totalItems, isEditing, onEdit, onRemove, onMove, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`agenda-item ${isEditing ? 'editing' : ''} ${isDragging ? 'dragging' : ''}`}
    >
      <div className="drag-handle" {...attributes} {...listeners}>
        <span className="drag-icon">⋮⋮</span>
      </div>
      <div className="agenda-time">{item.time}</div>
      <div className="agenda-details">
        <strong>{item.title}</strong>
        {item.speaker && <p className="agenda-speaker">Speaker: {item.speaker}</p>}
        {item.description && <p className="agenda-description">{item.description}</p>}
      </div>
      <div className="item-actions">
        <div className="move-buttons">
          <button
            className="btn-move"
            onClick={() => onMove(item.id, 'up')}
            disabled={index === 0}
            title="Move up"
          >
            ↑
          </button>
          <button
            className="btn-move"
            onClick={() => onMove(item.id, 'down')}
            disabled={index === totalItems - 1}
            title="Move down"
          >
            ↓
          </button>
        </div>
        <button className="btn-edit" onClick={() => onEdit(item)}>Edit</button>
        <button className="btn-remove" onClick={() => onRemove(item.id)}>Remove</button>
      </div>
    </div>
  );
};

// Sortable Item Component for Speakers
const SortableSpeakerItem = ({ speaker, index, totalItems, isEditing, onEdit, onRemove, onMove }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: speaker.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`link-item ${isEditing ? 'editing' : ''} ${isDragging ? 'dragging' : ''}`}
    >
      <div className="drag-handle" {...attributes} {...listeners}>
        <span className="drag-icon">⋮⋮</span>
      </div>
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
      <div className="item-actions">
        <div className="move-buttons">
          <button
            className="btn-move"
            onClick={() => onMove(speaker.id, 'up')}
            disabled={index === 0}
            title="Move up"
          >
            ↑
          </button>
          <button
            className="btn-move"
            onClick={() => onMove(speaker.id, 'down')}
            disabled={index === totalItems - 1}
            title="Move down"
          >
            ↓
          </button>
        </div>
        <button className="btn-edit" onClick={() => onEdit(speaker)}>Edit</button>
        <button className="btn-remove" onClick={() => onRemove(speaker.id)}>Remove</button>
      </div>
    </div>
  );
};

// Sortable Item Component for Posters
const SortablePosterItem = ({ poster, index, totalItems, isEditing, onEdit, onRemove, onMove }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: poster.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`link-item ${isEditing ? 'editing' : ''} ${isDragging ? 'dragging' : ''}`}
    >
      <div className="drag-handle" {...attributes} {...listeners}>
        <span className="drag-icon">⋮⋮</span>
      </div>
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
      <div className="item-actions">
        <div className="move-buttons">
          <button
            className="btn-move"
            onClick={() => onMove(poster.id, 'up')}
            disabled={index === 0}
            title="Move up"
          >
            ↑
          </button>
          <button
            className="btn-move"
            onClick={() => onMove(poster.id, 'down')}
            disabled={index === totalItems - 1}
            title="Move down"
          >
            ↓
          </button>
        </div>
        <button className="btn-edit" onClick={() => onEdit(poster)}>Edit</button>
        <button className="btn-remove" onClick={() => onRemove(poster.id)}>Remove</button>
      </div>
    </div>
  );
};

// Sortable Item Component for Sponsors
const SortableSponsorItem = ({ sponsor, index, totalItems, isEditing, onEdit, onRemove, onMove }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: sponsor.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`sponsor-item ${isEditing ? 'editing' : ''} ${isDragging ? 'dragging' : ''}`}
    >
      <div className="drag-handle" {...attributes} {...listeners}>
        <span className="drag-icon">⋮⋮</span>
      </div>
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
      <div className="item-actions">
        <div className="move-buttons">
          <button
            className="btn-move"
            onClick={() => onMove(sponsor.id, 'up')}
            disabled={index === 0}
            title="Move up"
          >
            ↑
          </button>
          <button
            className="btn-move"
            onClick={() => onMove(sponsor.id, 'down')}
            disabled={index === totalItems - 1}
            title="Move down"
          >
            ↓
          </button>
        </div>
        <button className="btn-edit" onClick={() => onEdit(sponsor)}>Edit</button>
        <button className="btn-remove" onClick={() => onRemove(sponsor.id)}>Remove</button>
      </div>
    </div>
  );
};

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

  // Edit mode states - track which item is being edited
  const [editingBlogLink, setEditingBlogLink] = useState(null);
  const [editingNewsLink, setEditingNewsLink] = useState(null);
  const [editingAgendaItem, setEditingAgendaItem] = useState(null);
  const [editingSpeaker, setEditingSpeaker] = useState(null);
  const [editingPoster, setEditingPoster] = useState(null);
  const [editingSponsor, setEditingSponsor] = useState(null);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Rich text editor configuration
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
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

  const handleEditBlogLink = (link) => {
    setEditingBlogLink(link.id);
    setNewBlogLink({ title: link.title, url: link.url });
  };

  const handleSaveBlogLink = async () => {
    if (!newBlogLink.title || !newBlogLink.url) {
      showMessage('error', 'Please fill in both title and URL');
      return;
    }

    try {
      const updatedLinks = formData.blogLinks.map(link =>
        link.id === editingBlogLink
          ? { ...link, title: newBlogLink.title, url: newBlogLink.url }
          : link
      );

      await saveForumData(selectedYear, { ...formData, blogLinks: updatedLinks });
      setFormData(prev => ({ ...prev, blogLinks: updatedLinks }));
      setEditingBlogLink(null);
      setNewBlogLink({ title: '', url: '' });
      showMessage('success', 'Blog link updated!');
    } catch (error) {
      showMessage('error', 'Error updating blog link: ' + error.message);
    }
  };

  const handleCancelEditBlogLink = () => {
    setEditingBlogLink(null);
    setNewBlogLink({ title: '', url: '' });
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

  const handleEditNewsLink = (link) => {
    setEditingNewsLink(link.id);
    setNewNewsLink({ title: link.title, url: link.url });
  };

  const handleSaveNewsLink = async () => {
    if (!newNewsLink.title || !newNewsLink.url) {
      showMessage('error', 'Please fill in both title and URL');
      return;
    }

    try {
      const updatedLinks = formData.newsLinks.map(link =>
        link.id === editingNewsLink
          ? { ...link, title: newNewsLink.title, url: newNewsLink.url }
          : link
      );

      await saveForumData(selectedYear, { ...formData, newsLinks: updatedLinks });
      setFormData(prev => ({ ...prev, newsLinks: updatedLinks }));
      setEditingNewsLink(null);
      setNewNewsLink({ title: '', url: '' });
      showMessage('success', 'News link updated!');
    } catch (error) {
      showMessage('error', 'Error updating news link: ' + error.message);
    }
  };

  const handleCancelEditNewsLink = () => {
    setEditingNewsLink(null);
    setNewNewsLink({ title: '', url: '' });
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

  const handleEditAgendaItem = (item) => {
    setEditingAgendaItem(item.id);
    setNewAgendaItem({
      time: item.time,
      title: item.title,
      description: item.description || '',
      speaker: item.speaker || ''
    });
  };

  const handleSaveAgendaItem = async () => {
    if (!newAgendaItem.time || !newAgendaItem.title) {
      showMessage('error', 'Please fill in time and title');
      return;
    }

    try {
      const updatedItems = formData.agendaItems.map(item =>
        item.id === editingAgendaItem
          ? { ...item, ...newAgendaItem }
          : item
      );

      await saveForumData(selectedYear, { ...formData, agendaItems: updatedItems });
      setFormData(prev => ({ ...prev, agendaItems: updatedItems }));
      setEditingAgendaItem(null);
      setNewAgendaItem({ time: '', title: '', description: '', speaker: '' });
      showMessage('success', 'Agenda item updated!');
    } catch (error) {
      showMessage('error', 'Error updating agenda item: ' + error.message);
    }
  };

  const handleCancelEditAgendaItem = () => {
    setEditingAgendaItem(null);
    setNewAgendaItem({ time: '', title: '', description: '', speaker: '' });
  };

  const handleMoveAgendaItem = async (itemId, direction) => {
    const currentIndex = formData.agendaItems.findIndex(item => item.id === itemId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= formData.agendaItems.length) return;

    const updatedItems = [...formData.agendaItems];
    [updatedItems[currentIndex], updatedItems[newIndex]] = [updatedItems[newIndex], updatedItems[currentIndex]];

    try {
      await saveForumData(selectedYear, { ...formData, agendaItems: updatedItems });
      setFormData(prev => ({ ...prev, agendaItems: updatedItems }));
      showMessage('success', 'Agenda item moved!');
    } catch (error) {
      showMessage('error', 'Error moving agenda item: ' + error.message);
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

  const handleEditSpeaker = (speaker) => {
    setEditingSpeaker(speaker.id);
    setNewSpeaker({
      name: speaker.name,
      title: speaker.title || '',
      organization: speaker.organization || '',
      bio: speaker.bio || '',
      linkedIn: speaker.linkedIn || '',
      website: speaker.website || ''
    });
  };

  const handleSaveSpeaker = async () => {
    if (!newSpeaker.name) {
      showMessage('error', 'Please fill in speaker name');
      return;
    }

    try {
      const updatedSpeakers = formData.speakers.map(speaker =>
        speaker.id === editingSpeaker
          ? { ...speaker, ...newSpeaker }
          : speaker
      );

      await saveForumData(selectedYear, { ...formData, speakers: updatedSpeakers });
      setFormData(prev => ({ ...prev, speakers: updatedSpeakers }));
      setEditingSpeaker(null);
      setNewSpeaker({ name: '', title: '', organization: '', bio: '', linkedIn: '', website: '' });
      showMessage('success', 'Speaker updated!');
    } catch (error) {
      showMessage('error', 'Error updating speaker: ' + error.message);
    }
  };

  const handleCancelEditSpeaker = () => {
    setEditingSpeaker(null);
    setNewSpeaker({ name: '', title: '', organization: '', bio: '', linkedIn: '', website: '' });
  };

  const handleMoveSpeaker = async (speakerId, direction) => {
    const currentIndex = formData.speakers.findIndex(speaker => speaker.id === speakerId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= formData.speakers.length) return;

    const updatedSpeakers = [...formData.speakers];
    [updatedSpeakers[currentIndex], updatedSpeakers[newIndex]] = [updatedSpeakers[newIndex], updatedSpeakers[currentIndex]];

    try {
      await saveForumData(selectedYear, { ...formData, speakers: updatedSpeakers });
      setFormData(prev => ({ ...prev, speakers: updatedSpeakers }));
      showMessage('success', 'Speaker moved!');
    } catch (error) {
      showMessage('error', 'Error moving speaker: ' + error.message);
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

  const handleEditPoster = (poster) => {
    setEditingPoster(poster.id);
    setNewPoster({
      title: poster.title,
      author: poster.author,
      affiliations: poster.affiliations || '',
      posterLink: poster.posterLink || ''
    });
  };

  const handleSavePoster = async () => {
    if (!newPoster.title || !newPoster.author) {
      showMessage('error', 'Please fill in poster title and author');
      return;
    }

    try {
      const updatedPosters = formData.posters.map(poster =>
        poster.id === editingPoster
          ? { ...poster, ...newPoster }
          : poster
      );

      await saveForumData(selectedYear, { ...formData, posters: updatedPosters });
      setFormData(prev => ({ ...prev, posters: updatedPosters }));
      setEditingPoster(null);
      setNewPoster({ title: '', author: '', affiliations: '', posterLink: '' });
      showMessage('success', 'Poster updated!');
    } catch (error) {
      showMessage('error', 'Error updating poster: ' + error.message);
    }
  };

  const handleCancelEditPoster = () => {
    setEditingPoster(null);
    setNewPoster({ title: '', author: '', affiliations: '', posterLink: '' });
  };

  const handleMovePoster = async (posterId, direction) => {
    const currentIndex = formData.posters.findIndex(poster => poster.id === posterId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= formData.posters.length) return;

    const updatedPosters = [...formData.posters];
    [updatedPosters[currentIndex], updatedPosters[newIndex]] = [updatedPosters[newIndex], updatedPosters[currentIndex]];

    try {
      await saveForumData(selectedYear, { ...formData, posters: updatedPosters });
      setFormData(prev => ({ ...prev, posters: updatedPosters }));
      showMessage('success', 'Poster moved!');
    } catch (error) {
      showMessage('error', 'Error moving poster: ' + error.message);
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

  const handleEditSponsor = (sponsor) => {
    setEditingSponsor(sponsor.id);
    setNewSponsor({
      name: sponsor.name,
      logo: sponsor.logo || '',
      website: sponsor.website || '',
      tier: sponsor.tier || 'standard'
    });
  };

  const handleSaveSponsor = async () => {
    if (!newSponsor.name) {
      showMessage('error', 'Please fill in sponsor name');
      return;
    }

    try {
      const updatedSponsors = formData.sponsors.map(sponsor =>
        sponsor.id === editingSponsor
          ? { ...sponsor, ...newSponsor }
          : sponsor
      );

      await saveForumData(selectedYear, { ...formData, sponsors: updatedSponsors });
      setFormData(prev => ({ ...prev, sponsors: updatedSponsors }));
      setEditingSponsor(null);
      setNewSponsor({ name: '', logo: '', website: '', tier: 'standard' });
      showMessage('success', 'Sponsor updated!');
    } catch (error) {
      showMessage('error', 'Error updating sponsor: ' + error.message);
    }
  };

  const handleCancelEditSponsor = () => {
    setEditingSponsor(null);
    setNewSponsor({ name: '', logo: '', website: '', tier: 'standard' });
  };

  const handleMoveSponsor = async (sponsorId, direction) => {
    const currentIndex = formData.sponsors.findIndex(sponsor => sponsor.id === sponsorId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= formData.sponsors.length) return;

    const updatedSponsors = [...formData.sponsors];
    [updatedSponsors[currentIndex], updatedSponsors[newIndex]] = [updatedSponsors[newIndex], updatedSponsors[currentIndex]];

    try {
      await saveForumData(selectedYear, { ...formData, sponsors: updatedSponsors });
      setFormData(prev => ({ ...prev, sponsors: updatedSponsors }));
      showMessage('success', 'Sponsor moved!');
    } catch (error) {
      showMessage('error', 'Error moving sponsor: ' + error.message);
    }
  };

  // Drag and drop handlers
  const handleDragEndAgenda = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = formData.agendaItems.findIndex(item => item.id === active.id);
    const newIndex = formData.agendaItems.findIndex(item => item.id === over.id);

    const updatedItems = arrayMove(formData.agendaItems, oldIndex, newIndex);

    try {
      setFormData(prev => ({ ...prev, agendaItems: updatedItems }));
      await saveForumData(selectedYear, { ...formData, agendaItems: updatedItems });
      showMessage('success', 'Agenda item moved!');
    } catch (error) {
      showMessage('error', 'Error moving agenda item: ' + error.message);
    }
  };

  const handleDragEndSpeakers = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = formData.speakers.findIndex(speaker => speaker.id === active.id);
    const newIndex = formData.speakers.findIndex(speaker => speaker.id === over.id);

    const updatedSpeakers = arrayMove(formData.speakers, oldIndex, newIndex);

    try {
      setFormData(prev => ({ ...prev, speakers: updatedSpeakers }));
      await saveForumData(selectedYear, { ...formData, speakers: updatedSpeakers });
      showMessage('success', 'Speaker moved!');
    } catch (error) {
      showMessage('error', 'Error moving speaker: ' + error.message);
    }
  };

  const handleDragEndPosters = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = formData.posters.findIndex(poster => poster.id === active.id);
    const newIndex = formData.posters.findIndex(poster => poster.id === over.id);

    const updatedPosters = arrayMove(formData.posters, oldIndex, newIndex);

    try {
      setFormData(prev => ({ ...prev, posters: updatedPosters }));
      await saveForumData(selectedYear, { ...formData, posters: updatedPosters });
      showMessage('success', 'Poster moved!');
    } catch (error) {
      showMessage('error', 'Error moving poster: ' + error.message);
    }
  };

  const handleDragEndSponsors = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = formData.sponsors.findIndex(sponsor => sponsor.id === active.id);
    const newIndex = formData.sponsors.findIndex(sponsor => sponsor.id === over.id);

    const updatedSponsors = arrayMove(formData.sponsors, oldIndex, newIndex);

    try {
      setFormData(prev => ({ ...prev, sponsors: updatedSponsors }));
      await saveForumData(selectedYear, { ...formData, sponsors: updatedSponsors });
      showMessage('success', 'Sponsor moved!');
    } catch (error) {
      showMessage('error', 'Error moving sponsor: ' + error.message);
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
            <option value="2028">2028</option>
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
                <ReactQuill
                  theme="snow"
                  value={formData.description}
                  onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
                  modules={quillModules}
                  formats={quillFormats}
                  placeholder="Write a description of the forum..."
                />
                <small style={{color: '#666', fontSize: '13px', marginTop: '4px', display: 'block'}}>
                  Use the toolbar to format text, add links, create lists, and more
                </small>
              </div>

              <div className="form-group">
                <label>Highlights / Key Takeaways</label>
                <ReactQuill
                  theme="snow"
                  value={formData.highlights}
                  onChange={(value) => setFormData(prev => ({ ...prev, highlights: value }))}
                  modules={quillModules}
                  formats={quillFormats}
                  placeholder="Write key highlights from the forum..."
                />
                <small style={{color: '#666', fontSize: '13px', marginTop: '4px', display: 'block'}}>
                  Use the toolbar to format text, add links, create lists, and more
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

        {activeTab === 'content' && (
          <div className="tab-content">
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
                {editingBlogLink ? (
                  <div className="edit-buttons">
                    <button className="btn-save-edit" onClick={handleSaveBlogLink}>Save Changes</button>
                    <button className="btn-cancel-edit" onClick={handleCancelEditBlogLink}>Cancel</button>
                  </div>
                ) : (
                  <button className="btn-add" onClick={handleAddBlogLink}>Add Blog Link</button>
                )}
              </div>

              <div className="links-list">
                {formData.blogLinks.map((link) => (
                  <div key={link.id} className={`link-item ${editingBlogLink === link.id ? 'editing' : ''}`}>
                    <div className="link-info">
                      <strong>{link.title}</strong>
                      <a href={link.url} target="_blank" rel="noopener noreferrer">{link.url}</a>
                    </div>
                    <div className="item-actions">
                      <button className="btn-edit" onClick={() => handleEditBlogLink(link)}>Edit</button>
                      <button className="btn-remove" onClick={() => handleRemoveBlogLink(link.id)}>Remove</button>
                    </div>
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
                {editingNewsLink ? (
                  <div className="edit-buttons">
                    <button className="btn-save-edit" onClick={handleSaveNewsLink}>Save Changes</button>
                    <button className="btn-cancel-edit" onClick={handleCancelEditNewsLink}>Cancel</button>
                  </div>
                ) : (
                  <button className="btn-add" onClick={handleAddNewsLink}>Add News Link</button>
                )}
              </div>

              <div className="links-list">
                {formData.newsLinks.map((link) => (
                  <div key={link.id} className={`link-item ${editingNewsLink === link.id ? 'editing' : ''}`}>
                    <div className="link-info">
                      <strong>{link.title}</strong>
                      <a href={link.url} target="_blank" rel="noopener noreferrer">{link.url}</a>
                    </div>
                    <div className="item-actions">
                      <button className="btn-edit" onClick={() => handleEditNewsLink(link)}>Edit</button>
                      <button className="btn-remove" onClick={() => handleRemoveNewsLink(link.id)}>Remove</button>
                    </div>
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
              <p style={{color: '#666', marginBottom: '20px'}}>
                Drag items using the handle (⋮⋮) to reorder, or use the arrow buttons.
              </p>

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
                {editingAgendaItem ? (
                  <div className="edit-buttons">
                    <button className="btn-save-edit" onClick={handleSaveAgendaItem}>Save Changes</button>
                    <button className="btn-cancel-edit" onClick={handleCancelEditAgendaItem}>Cancel</button>
                  </div>
                ) : (
                  <button className="btn-add" onClick={handleAddAgendaItem}>Add Agenda Item</button>
                )}
              </div>

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEndAgenda}
              >
                <SortableContext
                  items={formData.agendaItems.map(item => item.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="agenda-list">
                    {formData.agendaItems.map((item, index) => (
                      <SortableAgendaItem
                        key={item.id}
                        item={item}
                        index={index}
                        totalItems={formData.agendaItems.length}
                        isEditing={editingAgendaItem === item.id}
                        onEdit={handleEditAgendaItem}
                        onRemove={handleRemoveAgendaItem}
                        onMove={handleMoveAgendaItem}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          </div>
        )}

        {activeTab === 'speakers' && (
          <div className="tab-content">
            <div className="form-section">
              <h2>Speakers</h2>
              <p style={{color: '#666', marginBottom: '20px'}}>
                Add confirmed speakers for the forum. Drag items using the handle (⋮⋮) to reorder.
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
                {editingSpeaker ? (
                  <div className="edit-buttons">
                    <button className="btn-save-edit" onClick={handleSaveSpeaker}>Save Changes</button>
                    <button className="btn-cancel-edit" onClick={handleCancelEditSpeaker}>Cancel</button>
                  </div>
                ) : (
                  <button className="btn-add" onClick={handleAddSpeaker}>Add Speaker</button>
                )}
              </div>

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEndSpeakers}
              >
                <SortableContext
                  items={formData.speakers.map(speaker => speaker.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="links-list">
                    {formData.speakers.map((speaker, index) => (
                      <SortableSpeakerItem
                        key={speaker.id}
                        speaker={speaker}
                        index={index}
                        totalItems={formData.speakers.length}
                        isEditing={editingSpeaker === speaker.id}
                        onEdit={handleEditSpeaker}
                        onRemove={handleRemoveSpeaker}
                        onMove={handleMoveSpeaker}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          </div>
        )}

        {activeTab === 'posters' && (
          <div className="tab-content">
            <div className="form-section">
              <h2>Poster Presentations</h2>
              <p style={{color: '#666', marginBottom: '20px'}}>
                For past events: Add presented posters with download links. Drag items using the handle (⋮⋮) to reorder.
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
                {editingPoster ? (
                  <div className="edit-buttons">
                    <button className="btn-save-edit" onClick={handleSavePoster}>Save Changes</button>
                    <button className="btn-cancel-edit" onClick={handleCancelEditPoster}>Cancel</button>
                  </div>
                ) : (
                  <button className="btn-add" onClick={handleAddPoster}>Add Poster</button>
                )}
              </div>

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEndPosters}
              >
                <SortableContext
                  items={formData.posters.map(poster => poster.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="links-list">
                    {formData.posters.map((poster, index) => (
                      <SortablePosterItem
                        key={poster.id}
                        poster={poster}
                        index={index}
                        totalItems={formData.posters.length}
                        isEditing={editingPoster === poster.id}
                        onEdit={handleEditPoster}
                        onRemove={handleRemovePoster}
                        onMove={handleMovePoster}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          </div>
        )}

        {activeTab === 'sponsors' && (
          <div className="tab-content">
            <div className="form-section">
              <h2>Event Sponsors</h2>
              <p style={{color: '#666', marginBottom: '20px'}}>
                Add sponsors and their logos. Drag items using the handle (⋮⋮) to reorder.
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
                {editingSponsor ? (
                  <div className="edit-buttons">
                    <button className="btn-save-edit" onClick={handleSaveSponsor}>Save Changes</button>
                    <button className="btn-cancel-edit" onClick={handleCancelEditSponsor}>Cancel</button>
                  </div>
                ) : (
                  <button className="btn-add" onClick={handleAddSponsor}>Add Sponsor</button>
                )}
              </div>

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEndSponsors}
              >
                <SortableContext
                  items={formData.sponsors.map(sponsor => sponsor.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="sponsors-list">
                    {formData.sponsors.map((sponsor, index) => (
                      <SortableSponsorItem
                        key={sponsor.id}
                        sponsor={sponsor}
                        index={index}
                        totalItems={formData.sponsors.length}
                        isEditing={editingSponsor === sponsor.id}
                        onEdit={handleEditSponsor}
                        onRemove={handleRemoveSponsor}
                        onMove={handleMoveSponsor}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
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