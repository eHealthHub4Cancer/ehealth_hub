import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { getEvents, generateCalendarLink, generateICalString, getCategoryColors } from '../services/eventService';
import { RRule } from 'rrule';
import './PublicCalendar.css';

const PublicCalendar = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  const [eventFilters, setEventFilters] = useState({
    meeting: true,
    conference: true,
    deadline: true,
    workshop: true,
    other: true
  });
  const [allFiltersChecked, setAllFiltersChecked] = useState(true);

  // Get category colors from service (same as AdminCalendar)
  const categoryColors = getCategoryColors();
  
  const categoryOptions = [
    { value: 'meeting', label: 'Meeting' },
    { value: 'conference', label: 'Conference' },
    { value: 'deadline', label: 'Deadline' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'other', label: 'Other' }
  ];

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
      setTimeLeft('');
      return;
    }

    const updateTimer = () => {
      const now = new Date();
      const start = new Date(selectedEvent.start);
      const end = new Date(selectedEvent.end || new Date(start.getTime() + 60 * 60 * 1000));

      if (now >= end) {
        setTimeLeft('Event Ended');
        return;
      }
      if (now >= start) {
        setTimeLeft('Event In Progress');
        return;
      }

      const diffMs = start - now;
      if (diffMs <= 0) {
        setTimeLeft('Event Started');
        return;
      }

      // Calculate time components
      const totalSeconds = Math.floor(diffMs / 1000);
      const totalMinutes = Math.floor(totalSeconds / 60);
      const totalHours = Math.floor(totalMinutes / 60);
      const totalDays = Math.floor(totalHours / 24);

      // Calculate years, months, and remaining days
      const startDate = new Date(now);
      const endDate = new Date(start);
      const years = endDate.getFullYear() - startDate.getFullYear();
      let months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());
      let days = endDate.getDate() - startDate.getDate();

      if (days < 0) {
        months -= 1;
        const prevMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0);
        days += prevMonth.getDate();
      }

      if (months < 0) {
        months += 12;
      }

      // Adjust days for months and years
      const remainingDaysAfterYears = totalDays - (years * 365); // Approximate year as 365 days
      const remainingDaysAfterMonths = remainingDaysAfterYears - (months * 30); // Approximate month as 30 days
      const weeks = Math.floor(remainingDaysAfterMonths / 7);
      const daysAfterWeeks = remainingDaysAfterMonths % 7;
      const hours = totalHours % 24;
      const minutes = totalMinutes % 60;
      const seconds = totalSeconds % 60;

      if (selectedEvent.isStartAllDay) {
        // For all-day events, show only years, months, weeks, and days
        setTimeLeft(
          `YR: ${years.toString().padStart(2, '0')}, MN: ${months.toString().padStart(2, '0')}, WK: ${weeks.toString().padStart(2, '0')}, DD: ${daysAfterWeeks.toString().padStart(2, '0')}`
        );
      } else {
        // For non-all-day events, show full format
        setTimeLeft(
          `YR: ${years.toString().padStart(2, '0')}, MN: ${months.toString().padStart(2, '0')}, WK: ${weeks.toString().padStart(2, '0')}, DD: ${daysAfterWeeks.toString().padStart(2, '0')}, HR: ${hours.toString().padStart(2, '0')}, MIN: ${minutes.toString().padStart(2, '0')}, SEC: ${seconds.toString().padStart(2, '0')}`
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
          meetingInfoLink: event.meetingInfoLink, // New field
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
              meetingInfoLink: exception?.meetingInfoLink || event.meetingInfoLink, // New field
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
      meetingInfoLink: event.extendedProps.meetingInfoLink, // New field
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

  const handleFilterChange = (category) => {
    setEventFilters(prevFilters => {
      const newFilters = { ...prevFilters, [category]: !prevFilters[category] };
      // Update "check all" state based on whether all filters are checked
      const allChecked = Object.values(newFilters).every(value => value);
      setAllFiltersChecked(allChecked);
      return newFilters;
    });
  };

  const handleCheckAll = () => {
    const newCheckedState = !allFiltersChecked;
    setAllFiltersChecked(newCheckedState);
    setEventFilters({
      meeting: newCheckedState,
      conference: newCheckedState,
      deadline: newCheckedState,
      workshop: newCheckedState,
      other: newCheckedState
    });
  };

  const formattedEvents = events
    .filter(event => {
      const activeFilters = Object.keys(eventFilters).filter(key => eventFilters[key]);
      // If no filters are selected, show all events
      return activeFilters.length === 0 || activeFilters.includes(event.extendedProps.category);
    })
    .map(event => {
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
        backgroundColor: isPast ? '#9e9e9e' : (categoryColors[event.extendedProps.category] || categoryColors.other),
        borderColor: isPast ? '#757575' : (categoryColors[event.extendedProps.category] || categoryColors.other),
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
          meetingInfoLink: event.extendedProps.meetingInfoLink, // New field
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
        <p>Stay up to date with upcoming events, conferences, and deadlines</p>
      </header>

      <div className="calendar-content-wrapper">
        {/* Sidebar with Legend and Filters */}
        <aside className="calendar-sidebar">
          {/* Event Categories Legend */}
          <div className="sidebar-section">
            <h3>📅 Event Categories</h3>
            <ul className="category-legend">
              {categoryOptions.map(cat => (
                <li key={cat.value} className="legend-item">
                  <span 
                    className="legend-color" 
                    style={{backgroundColor: categoryColors[cat.value]}}
                  ></span>
                  <span className="legend-label">{cat.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Filter Controls */}
          <div className="sidebar-section">
            <h3>🔍 Filter Events</h3>
            <div className="filter-controls">
              <label className="filter-item check-all">
                <input
                  type="checkbox"
                  checked={allFiltersChecked}
                  onChange={handleCheckAll}
                />
                <span className="filter-label">Show All Categories</span>
              </label>
              
              {categoryOptions.map(cat => (
                <label key={cat.value} className="filter-item">
                  <input
                    type="checkbox"
                    checked={eventFilters[cat.value]}
                    onChange={() => handleFilterChange(cat.value)}
                  />
                  <span 
                    className="filter-color" 
                    style={{backgroundColor: categoryColors[cat.value]}}
                  ></span>
                  <span className="filter-label">{cat.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Event Stats */}
          <div className="sidebar-section">
            <h3>📊 Event Summary</h3>
            <div className="event-stats">
              <div className="stat-item">
                <span className="stat-number">{formattedEvents.length}</span>
                <span className="stat-label">Visible Events</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">
                  {formattedEvents.filter(e => !e.extendedProps.isPast).length}
                </span>
                <span className="stat-label">Upcoming</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Calendar */}
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
      </div>

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
                <span className="detail-label">Time Left:</span>
                <span className="event-time-left">{timeLeft}</span>
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
                      if (selectedEvent.recurrence.isMonthly && rule.options.byweekday && rule.options.bysetpos) {
                        return `Every ${interval} month${interval !== 1 ? 's' : ''} on the ${setPosOptions.find(p => p.value === rule.options.bysetpos[0])?.label} ${dayOptions.find(d => d.value === rule.options.byweekday[0])?.label}`;
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

              {selectedEvent.meetingInfoLink && (
                <div className="event-detail">
                  <span className="detail-label">More Info:</span>
                  <span className="detail-value">
                    <a href={selectedEvent.meetingInfoLink} target="_blank" rel="noopener noreferrer" className="meeting-link">
                      Conference details & registration
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