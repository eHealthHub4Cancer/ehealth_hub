// src/components/PublicCalendar.js
import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { getEvents, generateCalendarLink, generateICalString } from '../services/eventService';
import './PublicCalendar.css';

const PublicCalendar = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  
  // Load events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);
  
  // Fetch events from Firestore
  const fetchEvents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Public view only gets visible events (pass false to not include hidden ones)
      const fetchedEvents = await getEvents(false);
      setEvents(fetchedEvents);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to load events. Please refresh the page.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle event click to show details
  const handleEventClick = (arg) => {
    const event = arg.event;
    
    setSelectedEvent({
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end || new Date(event.start.getTime() + 60 * 60 * 1000),
      description: event.extendedProps.description,
      location: event.extendedProps.location,
      meetingLink: event.extendedProps.meetingLink,
      category: event.extendedProps.category,
      color: event.backgroundColor,
      addToCalendarEnabled: event.extendedProps.addToCalendarEnabled,
      isPast: event.extendedProps.isPast
    });
    
    setShowEventDetails(true);
  };
  
  // Close event details modal
  const handleCloseDetails = () => {
    setShowEventDetails(false);
    setSelectedEvent(null);
  };
  
  // Format date for display
  const formatDate = (date) => {
    if (!date) return '';
    
    const options = { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    
    return new Date(date).toLocaleDateString(undefined, options);
  };
  
  // Check if an event is in the past
  const isPastEvent = (eventEnd) => {
    const now = new Date();
    return eventEnd < now;
  };
  
  // Format events for FullCalendar
  const formattedEvents = events.map(event => {
    // Determine if event is in the past
    const pastEvent = isPastEvent(event.end);
    
    // Apply styling based on past/future status
    return {
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      backgroundColor: pastEvent ? '#9e9e9e' : event.color, // Grey for past events
      borderColor: pastEvent ? '#757575' : event.color,
      textColor: pastEvent ? '#f5f5f5' : undefined, // Light text for past events
      classNames: pastEvent ? ['past-event'] : [],
      extendedProps: {
        description: event.description,
        location: event.location,
        meetingLink: event.meetingLink,
        category: event.category,
        addToCalendarEnabled: event.addToCalendarEnabled,
        isPast: pastEvent
      }
    };
  });
  
  // Add event to external calendar
  const addToCalendar = (type) => {
    if (!selectedEvent) return;
    
    const url = generateCalendarLink(selectedEvent, type);
    window.open(url, '_blank');
  };
  
  // Download as iCal file
  const downloadIcal = () => {
    if (!selectedEvent) return;
    
    try {
      // Generate the iCal content
      const icalContent = generateICalString(selectedEvent);
      
      // Create a Blob with the correct MIME type
      const blob = new Blob([icalContent], { type: 'text/calendar;charset=utf-8' });
      
      // Create a URL for the Blob
      const url = URL.createObjectURL(blob);
      
      // Create a link element
      const link = document.createElement('a');
      link.href = url;
      link.download = `${selectedEvent.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.ics`;
      
      // Append the link to the document, click it, and remove it
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Release the URL object
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (error) {
      console.error('Error generating iCal file:', error);
      alert('There was an error creating the calendar file. Please try again.');
    }
  };

  return (
    <div className="public-calendar-container">
      <header className="calendar-header">
        <h1>eHealth Hub Event Calendar</h1>
        <p>Stay up to date with our upcoming events, conferences, and deadlines</p>
      </header>
      
      <main className="calendar-main-public">
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
              right: 'dayGridMonth,timeGridWeek'
            }}
            events={formattedEvents}
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
      
      {/* Event Details Modal */}
      {showEventDetails && selectedEvent && (
        <div className="modal-backdrop" onClick={handleCloseDetails}>
          <div className="event-details-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header" style={{backgroundColor: selectedEvent.isPast ? '#9e9e9e' : selectedEvent.color}}>
              <h2>{selectedEvent.title}</h2>
              {selectedEvent.isPast && <span className="past-event-badge">Past Event</span>}
              <button 
                className="close-button" 
                onClick={handleCloseDetails}
                aria-label="Close"
                title="Close"
              >
                &times;
              </button>
            </div>
            
            <div className="modal-content">
              <div className="event-detail">
                <span className="detail-label">Start:</span>
                <span className="detail-value">{formatDate(selectedEvent.start)}</span>
              </div>
              
              <div className="event-detail">
                <span className="detail-label">End:</span>
                <span className="detail-value">{formatDate(selectedEvent.end)}</span>
              </div>
              
              {selectedEvent.location && (
                <div className="event-detail">
                  <span className="detail-label">Location:</span>
                  <span className="detail-value">{selectedEvent.location}</span>
                </div>
              )}
              
              {selectedEvent.meetingLink && (
                <div className="event-detail">
                  <span className="detail-label">Meeting:</span>
                  <span className="detail-value">
                    <a href={selectedEvent.meetingLink} target="_blank" rel="noopener noreferrer" className="meeting-link">
                      Join online meeting
                    </a>
                  </span>
                </div>
              )}
              
              {selectedEvent.description && (
                <div className="event-description">
                  <h3>Description</h3>
                  <p>{selectedEvent.description}</p>
                </div>
              )}
              
              {selectedEvent.addToCalendarEnabled && !selectedEvent.isPast && (
                <div className="calendar-actions">
                  <h3>Add to Your Calendar</h3>
                  <div className="calendar-buttons">
                    <button 
                      className="calendar-button google"
                      onClick={() => addToCalendar('google')}
                    >
                      Google Calendar
                    </button>
                    <button 
                      className="calendar-button outlook"
                      onClick={() => addToCalendar('outlook')}
                    >
                      Outlook
                    </button>
                    <button 
                      className="calendar-button ical"
                      onClick={downloadIcal}
                    >
                      iCal Download
                    </button>
                  </div>
                </div>
              )}
              
              {selectedEvent.isPast && (
                <div className="past-event-notice">
                  <p>This event has already taken place.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicCalendar;