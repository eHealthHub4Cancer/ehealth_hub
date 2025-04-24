import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { getEvents, generateCalendarLink, generateICalString } from '../services/eventService';
import { RRule } from 'rrule';
import './PublicCalendar.css';

const PublicCalendar = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('');

  const dayOptions = [
    { value: 'MO', label: 'Monday' },
    { value: 'TU', label: 'Tuesday' },
    { value: 'WE', label: 'Wednesday' },
    { value: 'TH', label: 'Thursday' },
    { value: 'FR', label: 'Friday' },
    { value: 'SA', label: 'Saturday' },
    { value: 'SU', label: 'Sunday' }
  ];

  const setPosOptions = [
    { value: 1, label: 'First' },
    { value: 2, label: 'Second' },
    { value: 3, label: 'Third' },
    { value: 4, label: 'Fourth' },
    { value: -1, label: 'Last' }
  ];

  const monthOptions = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (!selectedEvent || !showEventDetails) {
      setTimeRemaining('');
      return;
    }

    const updateTimer = () => {
      const now = new Date();
      const start = new Date(selectedEvent.start);
      const end = new Date(selectedEvent.end || new Date(start.getTime() + 60 * 60 * 1000));

      if (now >= end) {
        setTimeRemaining('Event Ended');
        return;
      }
      if (now >= start) {
        setTimeRemaining('Event In Progress');
        return;
      }

      const diffMs = start - now;
      if (diffMs <= 0) {
        setTimeRemaining('Event Started');
        return;
      }

      if (selectedEvent.isStartAllDay) {
        const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        setTimeRemaining(`${days} day${days !== 1 ? 's' : ''} remaining`);
      } else {
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
        setTimeRemaining(
          `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      }
    };

    updateTimer();
    const intervalId = setInterval(updateTimer, 1000);

    return () => clearInterval(intervalId);
  }, [selectedEvent, showEventDetails]);

  const fetchEvents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedEvents = await getEvents(false);
      const formattedEvents = fetchedEvents.flatMap(event => {
        const eventExtendedProps = {
          description: event.description,
          location: event.location,
          meetingLink: event.meetingLink,
          category: event.category,
          addToCalendarEnabled: event.addToCalendarEnabled,
          originalId: event.id,
          isStartAllDay: event.isStartAllDay || false,
          isEndAllDay: event.isEndAllDay || false
        };

        if (event.recurrence && event.recurrence.rrule) {
          const rule = RRule.fromString(event.recurrence.rrule);
          const start = new Date(event.start);
          const end = new Date(event.end);
          const duration = end.getTime() - start.getTime();
          const instances = rule.between(
            new Date(),
            new Date(new Date().setFullYear(new Date().getFullYear() + 1))
          );
          const exceptions = event.exceptions || [];
          return instances.map(instance => {
            const instanceDate = instance.toISOString().substring(0, 10);
            const exception = exceptions.find(ex => ex.date === instanceDate);
            if (exception && exception.deleted) return [];
            return {
              ...event,
              id: `${event.id}_${instance.getTime()}`,
              start: exception ? new Date(exception.start) : instance,
              end: exception ? new Date(exception.end) : new Date(instance.getTime() + duration),
              title: exception?.title || event.title,
              description: exception?.description || event.description,
              location: exception?.location || event.location,
              meetingLink: exception?.meetingLink || event.meetingLink,
              extendedProps: {
                ...eventExtendedProps,
                isStartAllDay: exception ? exception.isStartAllDay : event.isStartAllDay,
                isEndAllDay: exception ? exception.isEndAllDay : event.isEndAllDay,
                isException: !!exception,
                instanceDate: instanceDate
              },
              allDay: exception ? exception.isStartAllDay && exception.isEndAllDay : event.isStartAllDay && event.isEndAllDay
            };
          }).filter(Boolean);
        }
        return [{
          ...event,
          extendedProps: {
            ...eventExtendedProps,
            isException: false
          },
          allDay: event.isStartAllDay && event.isEndAllDay
        }];
      });
      setEvents(formattedEvents);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to load events. Please refresh the page.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEventClick = (arg) => {
    const event = arg.event;
    setSelectedEvent({
      id: event.extendedProps.originalId || event.id,
      title: event.title,
      start: event.start,
      end: event.end || new Date(event.start.getTime() + 60 * 60 * 1000),
      description: event.extendedProps.description,
      location: event.extendedProps.location,
      meetingLink: event.extendedProps.meetingLink,
      category: event.extendedProps.category,
      color: event.backgroundColor,
      addToCalendarEnabled: event.extendedProps.addToCalendarEnabled,
      isPast: event.extendedProps.isPast,
      isStartAllDay: event.extendedProps.isStartAllDay || false,
      isEndAllDay: event.extendedProps.isEndAllDay || false,
      recurrence: event.extendedProps.recurrence,
      isException: event.extendedProps.isException || false
    });
    setShowEventDetails(true);
  };

  const handleCloseDetails = () => {
    setShowEventDetails(false);
    setSelectedEvent(null);
  };

  const formatDate = (date, isAllDay) => {
    if (!date) return '';
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...(isAllDay ? {} : { hour: '2-digit', minute: '2-digit' })
    };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const isPastEvent = (eventEnd) => {
    const now = new Date();
    return eventEnd < now;
  };

  const formattedEvents = events.map(event => {
    const isPast = isPastEvent(event.end);
    const startDate = new Date(event.start).toISOString().substring(0, 10);
    const endDate = new Date(event.end).toISOString().substring(0, 10);
    const isMultiDay = startDate !== endDate;

    return {
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      allDay: event.isStartAllDay && event.isEndAllDay,
      backgroundColor: isPast ? '#9e9e9e' : event.color,
      borderColor: isPast ? '#757575' : event.color,
      textColor: isPast ? '#f5f5f5' : undefined,
      classNames: [
        isPast ? 'past-event' : '',
        (event.isStartAllDay && event.isEndAllDay && isMultiDay) ? 'multi-day-event' : '',
        event.extendedProps.isException ? 'exception-event' : ''
      ].filter(Boolean),
      extendedProps: {
        description: event.extendedProps.description,
        location: event.extendedProps.location,
        meetingLink: event.extendedProps.meetingLink,
        category: event.extendedProps.category,
        addToCalendarEnabled: event.extendedProps.addToCalendarEnabled,
        isPast: isPast,
        originalId: event.extendedProps.originalId,
        isStartAllDay: event.extendedProps.isStartAllDay,
        isEndAllDay: event.extendedProps.isEndAllDay,
        recurrence: event.recurrence,
        isException: event.extendedProps.isException,
        instanceDate: event.extendedProps.instanceDate
      }
    };
  });

  const addToCalendar = (type) => {
    if (!selectedEvent) return;
    const url = generateCalendarLink(selectedEvent, type);
    window.open(url, '_blank');
  };

  const downloadIcal = () => {
    if (!selectedEvent) return;
    try {
      const icalContent = generateICalString(selectedEvent);
      const blob = new Blob([icalContent], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${selectedEvent.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.ics`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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

      {showEventDetails && selectedEvent && (
        <div className="modal-backdrop" onClick={handleCloseDetails}>
          <div className="event-details-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header" style={{ backgroundColor: selectedEvent.isPast ? '#9e9e9e' : selectedEvent.color }}>
              <h2>{selectedEvent.title}</h2>
              {selectedEvent.isPast && <span className="past-event-badge">Past Event</span>}
              <button
                className="close-button"
                onClick={handleCloseDetails}
                aria-label="Close"
                title="Close"
              >
                ×
              </button>
            </div>

            <div className="modal-content">
              <div className="event-detail">
                <span className="detail-label">Start:</span>
                <span className="detail-value">{formatDate(selectedEvent.start, selectedEvent.isStartAllDay)}</span>
              </div>

              <div className="event-detail">
                <span className="detail-label">End:</span>
                <span className="detail-value">{formatDate(selectedEvent.end, selectedEvent.isEndAllDay)}</span>
              </div>

              <div className="event-detail">
                <span className="detail-label">Time Remaining:</span>
                <span className="detail-value">{timeRemaining}</span>
              </div>

              {selectedEvent.recurrence && (
                <div className="event-detail">
                  <span className="detail-label">Repeats:</span>
                  <span className="detail-value">
                    {(() => {
                      const rule = RRule.fromString(selectedEvent.recurrence.rrule);
                      const interval = rule.options.interval;
                      if (rule.options.freq === RRule.DAILY) {
                        return `Every ${interval} day${interval !== 1 ? 's' : ''}`;
                      }
                      if (rule.options.freq === RRule.YEARLY) {
                        return `Every ${interval} year${interval !== 1 ? 's' : ''} on ${monthOptions.find(m => m.value === rule.options.bymonth)?.label} ${rule.options.bymonthday}`;
                      }
                      if (selectedEvent.recurrence.isMonthly && rule.options.byday && rule.options.bysetpos) {
                        return `Every ${interval} month${interval !== 1 ? 's' : ''} on the ${setPosOptions.find(p => p.value === rule.options.bysetpos[0])?.label} ${dayOptions.find(d => d.value === rule.options.byday[0])?.label}`;
                      }
                      return selectedEvent.recurrence.isMonthly
                        ? `Every ${interval / 4} month${interval / 4 !== 1 ? 's' : ''} on day ${rule.options.bymonthday}`
                        : `Every ${interval} week${interval !== 1 ? 's' : ''}`;
                    })()}
                    {selectedEvent.isException && ' (Modified instance)'}
                  </span>
                </div>
              )}

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