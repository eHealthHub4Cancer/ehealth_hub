// src/components/AdminCalendar.js
import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { getEvents, addEvent, updateEvent, deleteEvent, getCategoryColors } from '../services/eventService';
import './AdminCalendar.css';

const AdminCalendar = () => {
  const [events, setEvents] = useState([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Form state
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [category, setCategory] = useState('');
  const [addToCalendarEnabled, setAddToCalendarEnabled] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  // Category options with their colors
  const categoryColors = getCategoryColors();
  const categoryOptions = [
    { value: 'meeting', label: 'Meeting' },
    { value: 'conference', label: 'Conference' },
    { value: 'deadline', label: 'Deadline' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'other', label: 'Other' }
  ];

  // Load events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  // Fetch events from Firestore
  const fetchEvents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Admin sees all events, including hidden ones
      const fetchedEvents = await getEvents(true);
      setEvents(fetchedEvents);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to load events. Please refresh the page.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle user logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Handle date click to create new event
  const handleDateClick = (arg) => {
    // Set default times for new event (9am - 10am)
    const clickedDate = new Date(arg.date);
    const formattedDate = clickedDate.toISOString().substring(0, 10);
    
    // Default to current time if clicked on today, otherwise 9am
    let defaultStartTime;
    const today = new Date();
    if (
      clickedDate.getDate() === today.getDate() &&
      clickedDate.getMonth() === today.getMonth() &&
      clickedDate.getFullYear() === today.getFullYear()
    ) {
      const hours = today.getHours().toString().padStart(2, '0');
      const minutes = today.getMinutes().toString().padStart(2, '0');
      defaultStartTime = `${hours}:${minutes}`;
    } else {
      defaultStartTime = '09:00';
    }
    
    // Default end time is 1 hour after start time
    const endTimeHour = parseInt(defaultStartTime.split(':')[0]) + 1;
    const defaultEndTime = `${endTimeHour.toString().padStart(2, '0')}:${defaultStartTime.split(':')[1]}`;
    
    resetForm();
    setStartDate(formattedDate);
    setEndDate(formattedDate);
    setStartTime(defaultStartTime);
    setEndTime(defaultEndTime);
    setEditingEvent(null);
    setShowEventModal(true);
  };

  // Handle event click to edit existing event
  const handleEventClick = (arg) => {
    const event = arg.event;
    const eventStart = event.start;
    const eventEnd = event.end || new Date(eventStart.getTime() + 60 * 60 * 1000); // Default to 1 hour after start if no end time
    
    setEditingEvent({
      id: event.id,
      title: event.title,
      start: eventStart,
      end: eventEnd,
      description: event.extendedProps.description || '',
      location: event.extendedProps.location || '',
      meetingLink: event.extendedProps.meetingLink || '',
      category: event.extendedProps.category || 'other',
      addToCalendarEnabled: event.extendedProps.addToCalendarEnabled !== false,
      isVisible: event.extendedProps.isVisible !== false
    });
    
    setTitle(event.title);
    setStartDate(eventStart.toISOString().substring(0, 10));
    setStartTime(eventStart.toTimeString().substring(0, 5));
    setEndDate(eventEnd.toISOString().substring(0, 10));
    setEndTime(eventEnd.toTimeString().substring(0, 5));
    setDescription(event.extendedProps.description || '');
    setLocation(event.extendedProps.location || '');
    setMeetingLink(event.extendedProps.meetingLink || '');
    setCategory(event.extendedProps.category || 'other');
    setAddToCalendarEnabled(event.extendedProps.addToCalendarEnabled !== false);
    setIsVisible(event.extendedProps.isVisible !== false);
    
    setShowEventModal(true);
  };

  // Reset form fields
  const resetForm = () => {
    setTitle('');
    setStartDate('');
    setStartTime('');
    setEndDate('');
    setEndTime('');
    setDescription('');
    setLocation('');
    setMeetingLink('');
    setCategory('meeting');
    setAddToCalendarEnabled(true);
    setIsVisible(true);
  };

  // Close event modal and reset form
  const handleCloseModal = () => {
    setShowEventModal(false);
    resetForm();
    setEditingEvent(null);
  };

  // Handle form submission for creating/updating event
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!title || !startDate || !startTime || !endDate || !endTime) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Create start and end dates
    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);
    
    // Validate dates
    if (end <= start) {
      alert('End time must be after start time');
      return;
    }
    
    // Create event object
    const eventData = {
      title,
      start,
      end,
      description,
      location,
      meetingLink,
      category,
      color: categoryColors[category] || categoryColors.other,
      addToCalendarEnabled,
      isVisible
    };
    
    try {
      if (editingEvent) {
        // Update existing event
        await updateEvent(editingEvent.id, eventData);
      } else {
        // Create new event
        await addEvent(eventData);
      }
      
      // Refresh events
      await fetchEvents();
      handleCloseModal();
    } catch (err) {
      console.error("Error saving event:", err);
      alert(`Failed to ${editingEvent ? 'update' : 'create'} event. Please try again.`);
    }
  };

  // Handle event deletion
  const handleDeleteEvent = async () => {
    if (!editingEvent || !editingEvent.id) return;
    
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(editingEvent.id);
        await fetchEvents();
        handleCloseModal();
      } catch (err) {
        console.error("Error deleting event:", err);
        alert('Failed to delete event. Please try again.');
      }
    }
  };

  // Format events for FullCalendar
  const formattedEvents = events.map(event => ({
    id: event.id,
    title: event.title + (event.isVisible === false ? ' (Hidden)' : ''),
    start: event.start,
    end: event.end,
    backgroundColor: event.isVisible === false ? '#cccccc' : event.color,
    borderColor: event.isVisible === false ? '#aaaaaa' : event.color,
    textColor: event.isVisible === false ? '#666666' : undefined,
    classNames: event.isVisible === false ? ['hidden-event'] : [],
    extendedProps: {
      description: event.description,
      location: event.location,
      meetingLink: event.meetingLink,
      category: event.category,
      addToCalendarEnabled: event.addToCalendarEnabled,
      isVisible: event.isVisible
    }
  }));

  return (
    <div className="admin-calendar-container">
      <header className="admin-header">
        <h1>eHealth Hub Calendar Management</h1>
        <button className="logout-button" onClick={handleLogout}>
          Sign Out
        </button>
      </header>
      
      <div className="admin-content">
        <aside className="admin-sidebar">
          <div className="sidebar-section">
            <h3>Calendar Management</h3>
            <button 
              className="add-event-button"
              onClick={() => {
                resetForm();
                setEditingEvent(null);
                setShowEventModal(true);
              }}
            >
              + Add New Event
            </button>
          </div>
          
          <div className="sidebar-section">
            <h3>Event Categories</h3>
            <ul className="category-list">
              {categoryOptions.map(cat => (
                <li key={cat.value} className="category-item">
                  <span 
                    className="category-color" 
                    style={{backgroundColor: categoryColors[cat.value]}}
                  ></span>
                  <span className="category-label">{cat.label}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="sidebar-section">
            <h3>Instructions</h3>
            <ul className="instruction-list">
              <li>Click on a date to add a new event</li>
              <li>Click on an event to edit or delete it</li>
              <li>Events are immediately visible on the public calendar</li>
            </ul>
          </div>
        </aside>
        
        <main className="calendar-main">
          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading calendar events...</p>
            </div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
              }}
              events={formattedEvents}
              dateClick={handleDateClick}
              eventClick={handleEventClick}
              height="auto"
              eventTimeFormat={{
                hour: '2-digit',
                minute: '2-digit',
                meridiem: false,
                hour12: false
              }}
            />
          )}
        </main>
      </div>
      
      {/* Event Modal */}
      {showEventModal && (
        <div className="modal-backdrop">
          <div className="event-modal">
          <div className="modal-header">
              <h2>{editingEvent ? 'Edit Event' : 'Add New Event'}</h2>
              <button 
                className="close-button" 
                onClick={handleCloseModal}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="event-form">
              <div className="form-group">
                <label htmlFor="title">Event Title *</label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter event title"
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="startDate">Start Date *</label>
                  <input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="startTime">Start Time *</label>
                  <input
                    id="startTime"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="endDate">End Date *</label>
                  <input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="endTime">End Time *</label>
                  <input
                    id="endTime"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter event description"
                  rows="3"
                ></textarea>
              </div>
              
              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  id="location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter event location"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="meetingLink">Meeting Link</label>
                <input
                  id="meetingLink"
                  type="url"
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  placeholder="Enter Zoom, Teams, or other meeting link"
                />
                <small className="form-hint">This will be included in the calendar invitation</small>
              </div>
              
              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">Select a category</option>
                  {categoryOptions.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group checkbox-group">
                <input
                  id="addToCalendar"
                  type="checkbox"
                  checked={addToCalendarEnabled}
                  onChange={(e) => setAddToCalendarEnabled(e.target.checked)}
                />
                <label htmlFor="addToCalendar">
                  Enable "Add to Calendar" option for users
                </label>
              </div>
              
              <div className="form-group checkbox-group">
                <input
                  id="isVisible"
                  type="checkbox"
                  checked={isVisible}
                  onChange={(e) => setIsVisible(e.target.checked)}
                />
                <label htmlFor="isVisible">
                  Visible to public (uncheck to hide from public calendar)
                </label>
              </div>
              
              <div className="form-actions">
                <button type="submit" className="save-button">
                  {editingEvent ? 'Update Event' : 'Create Event'}
                </button>
                
                {editingEvent && (
                  <button 
                    type="button" 
                    className="delete-button"
                    onClick={handleDeleteEvent}
                  >
                    Delete Event
                  </button>
                )}
                
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCalendar;