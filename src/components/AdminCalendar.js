import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { getEvents, addEvent, updateEvent, deleteEvent, getCategoryColors } from '../services/eventService';
import { RRule } from 'rrule';
import './AdminCalendar.css';

const AdminCalendar = () => {
  const [events, setEvents] = useState([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState('series');

  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [meetingInfoLink, setMeetingInfoLink] = useState(''); // New field
  const [category, setCategory] = useState('');
  const [addToCalendarEnabled, setAddToCalendarEnabled] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [isStartAllDay, setIsStartAllDay] = useState(false);
  const [isEndAllDay, setIsEndAllDay] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceFrequency, setRecurrenceFrequency] = useState('weekly');
  const [recurrenceInterval, setRecurrenceInterval] = useState(1);
  const [recurrenceEndType, setRecurrenceEndType] = useState('noEnd');
  const [recurrenceEndDate, setRecurrenceEndDate] = useState('');
  const [numberOfOccurrences, setNumberOfOccurrences] = useState('');
  const [weeklyDays, setWeeklyDays] = useState({
    MO: false,
    TU: false,
    WE: false,
    TH: false,
    FR: false,
    SA: false,
    SU: false
  });
  const [monthlyType, setMonthlyType] = useState('absolute');
  const [monthlyDay, setMonthlyDay] = useState(1);
  const [monthlyByDay, setMonthlyByDay] = useState('MO');
  const [monthlyBySetPos, setMonthlyBySetPos] = useState(1);
  const [yearlyType, setYearlyType] = useState('absolute');
  const [yearlyMonth, setYearlyMonth] = useState(1);
  const [yearlyDay, setYearlyDay] = useState(1);
  const [yearlyByDay, setYearlyByDay] = useState('MO');
  const [yearlyBySetPos, setYearlyBySetPos] = useState(1);

  const categoryColors = getCategoryColors();
  const categoryOptions = [
    { value: 'meeting', label: 'Meeting' },
    { value: 'conference', label: 'Conference' },
    { value: 'deadline', label: 'Deadline' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'other', label: 'Other' }
  ];

  const recurrenceOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' }
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

  // Map day strings to RRule weekday objects (for all recurrences)
  const dayToRRule = {
    MO: RRule.MO,
    TU: RRule.TU,
    WE: RRule.WE,
    TH: RRule.TH,
    FR: RRule.FR,
    SA: RRule.SA,
    SU: RRule.SU
  };

  // Validate day value against dayOptions
  const validateDayValue = (day) => {
    return dayOptions.some(opt => opt.value === day) ? day : 'MO';
  };

  // Validate set position value against setPosOptions
  const validateSetPosValue = (setPos) => {
    const parsedSetPos = parseInt(setPos);
    return setPosOptions.some(opt => opt.value === parsedSetPos) ? parsedSetPos : 1;
  };

  // Validate month value against monthOptions
  const validateMonthValue = (month) => {
    const parsedMonth = parseInt(month);
    return monthOptions.some(opt => opt.value === parsedMonth) ? parsedMonth : 1;
  };

  // Validate date string and return a Date object or null if invalid
  const validateDate = (dateStr, timeStr = '00:00', allDay = false) => {
    if (!dateStr) return null;
    const dateTimeStr = allDay ? `${dateStr}T00:00:00` : `${dateStr}T${timeStr || '00:00'}`;
    const date = new Date(dateTimeStr);
    return isNaN(date.getTime()) ? null : date;
  };

  // Validate numeric input (e.g., interval, count)
  const validatePositiveInteger = (value, defaultValue = 1) => {
    const parsed = parseInt(value);
    return isNaN(parsed) || parsed < 1 ? defaultValue : parsed;
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedEvents = await getEvents(true);
      const formattedEvents = fetchedEvents.flatMap(event => {
        if (event.recurrence) {
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
              allDay: exception ? exception.isStartAllDay && exception.isEndAllDay : event.isStartAllDay && event.isEndAllDay,
              extendedProps: {
                ...event.extendedProps,
                isStartAllDay: exception ? exception.isStartAllDay : event.isStartAllDay,
                isEndAllDay: exception ? exception.isEndAllDay : event.isEndAllDay,
                isException: !!exception,
                instanceDate: instanceDate
              }
            };
          }).filter(Boolean);
        }
        return [{
          ...event,
          allDay: event.isStartAllDay && event.isEndAllDay,
          extendedProps: {
            ...event.extendedProps,
            isException: false
          }
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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleDateClick = (arg) => {
    const clickedDate = new Date(arg.date);
    const formattedDate = clickedDate.toISOString().substring(0, 10);
    let defaultStartTime = '';
    let defaultEndTime = '';
    if (!isStartAllDay) {
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
    }
    if (!isEndAllDay) {
      const endTimeHour = parseInt(defaultStartTime.split(':')[0] || 9) + 1;
      defaultEndTime = `${endTimeHour.toString().padStart(2, '0')}:${defaultStartTime.split(':')[1] || '00'}`;
    }
    
    resetForm();
    setStartDate(formattedDate);
    setEndDate(formattedDate);
    setStartTime(defaultStartTime);
    setEndTime(defaultEndTime);
    setEditingEvent(null);
    setEditMode('series');
    setShowEventModal(true);
  };

  const handleEventClick = (arg) => {
    const event = arg.event;
    const eventStart = event.start;
    const eventEnd = event.end || new Date(eventStart.getTime() + 60 * 60 * 1000);
    
    setEditingEvent({
      id: event.id.split('_')[0],
      title: event.title,
      start: eventStart,
      end: eventEnd,
      description: event.extendedProps.description || '',
      location: event.extendedProps.location || '',
      meetingLink: event.extendedProps.meetingLink || '',
      meetingInfoLink: event.extendedProps.meetingInfoLink || '', // New field
      category: event.extendedProps.category || 'other',
      addToCalendarEnabled: event.extendedProps.addToCalendarEnabled !== false,
      isVisible: event.extendedProps.isVisible !== false,
      isStartAllDay: event.extendedProps.isStartAllDay || false,
      isEndAllDay: event.extendedProps.isEndAllDay || false,
      recurrence: event.extendedProps.recurrence,
      instanceDate: event.extendedProps.instanceDate,
      exceptions: event.exceptions || []
    });
    
    setTitle(event.title);
    setStartDate(eventStart.toISOString().substring(0, 10));
    setStartTime(event.extendedProps.isStartAllDay ? '' : eventStart.toTimeString().substring(0, 5));
    setEndDate(eventEnd.toISOString().substring(0, 10));
    setEndTime(event.extendedProps.isEndAllDay ? '' : eventEnd.toTimeString().substring(0, 5));
    setDescription(event.extendedProps.description || '');
    setLocation(event.extendedProps.location || '');
    setMeetingLink(event.extendedProps.meetingLink || '');
    setMeetingInfoLink(event.extendedProps.meetingInfoLink || ''); // New field
    setCategory(event.extendedProps.category || 'other');
    setAddToCalendarEnabled(event.extendedProps.addToCalendarEnabled !== false);
    setIsVisible(event.extendedProps.isVisible !== false);
    setIsStartAllDay(event.extendedProps.isStartAllDay || false);
    setIsEndAllDay(event.extendedProps.isEndAllDay || false);
    setIsRecurring(!!event.extendedProps.recurrence);
    if (event.extendedProps.recurrence) {
      const rule = RRule.fromString(event.extendedProps.recurrence.rrule);
      const isMonthly = event.extendedProps.recurrence.isMonthly;
      console.log('Parsed RRule options:', rule.options);
      setRecurrenceFrequency(
        rule.options.freq === RRule.DAILY ? 'daily' :
        rule.options.freq === RRule.YEARLY ? 'yearly' :
        rule.options.freq === RRule.WEEKLY && rule.options.byweekday ? 'weekly' :
        isMonthly ? 'monthly' : 'weekly'
      );
      setRecurrenceInterval(
        rule.options.freq === RRule.DAILY ? rule.options.interval || 1 :
        rule.options.freq === RRule.YEARLY ? rule.options.interval || 1 :
        isMonthly ? (rule.options.interval || 1) : rule.options.interval || 1
      );
      setRecurrenceEndType(
        rule.options.count ? 'count' :
        rule.options.until ? 'endDate' : 'noEnd'
      );
      setRecurrenceEndDate(rule.options.until ? rule.options.until.toISOString().substring(0, 10) : '');
      setNumberOfOccurrences(rule.options.count ? rule.options.count.toString() : '');
      setMonthlyType(rule.options.byweekday && rule.options.bysetpos ? 'relative' : 'absolute');
      setMonthlyDay(rule.options.bymonthday?.length ? rule.options.bymonthday[0] : 1);
      const parsedMonthlyByDay = rule.options.byweekday && rule.options.byweekday.length ? 
        validateDayValue(rule.options.byweekday[0].toString().substring(0, 2)) : 'MO';
      setMonthlyByDay(parsedMonthlyByDay);
      setMonthlyBySetPos(rule.options.bysetpos?.length ? rule.options.bysetpos[0] : 1);
      setYearlyType(rule.options.byweekday && rule.options.bysetpos ? 'relative' : 'absolute');
      setYearlyMonth(rule.options.bymonth?.length ? rule.options.bymonth[0] : 1);
      setYearlyDay(rule.options.bymonthday?.length ? rule.options.bymonthday[0] : 1);
      const parsedYearlyByDay = rule.options.byweekday && rule.options.byweekday.length ? 
        validateDayValue(rule.options.byweekday[0].toString().substring(0, 2)) : 'MO';
      setYearlyByDay(parsedYearlyByDay);
      setYearlyBySetPos(rule.options.bysetpos?.length ? rule.options.bysetpos[0] : 1);
      setWeeklyDays({
        MO: rule.options.byweekday?.some(day => day.toString().includes('MO')) || false,
        TU: rule.options.byweekday?.some(day => day.toString().includes('TU')) || false,
        WE: rule.options.byweekday?.some(day => day.toString().includes('WE')) || false,
        TH: rule.options.byweekday?.some(day => day.toString().includes('TH')) || false,
        FR: rule.options.byweekday?.some(day => day.toString().includes('FR')) || false,
        SA: rule.options.byweekday?.some(day => day.toString().includes('SA')) || false,
        SU: rule.options.byweekday?.some(day => day.toString().includes('SU')) || false
      });
      setEditMode(event.extendedProps.isException ? 'instance' : 'series');
    } else {
      setRecurrenceFrequency('weekly');
      setRecurrenceInterval(1);
      setRecurrenceEndType('noEnd');
      setRecurrenceEndDate('');
      setNumberOfOccurrences('');
      setMonthlyType('absolute');
      setMonthlyDay(1);
      setMonthlyByDay('MO');
      setMonthlyBySetPos(1);
      setYearlyType('absolute');
      setYearlyMonth(1);
      setYearlyDay(1);
      setYearlyByDay('MO');
      setYearlyBySetPos(1);
      setWeeklyDays({
        MO: false,
        TU: false,
        WE: false,
        TH: false,
        FR: false,
        SA: false,
        SU: false
      });
      setEditMode('series');
    }
    
    setShowEventModal(true);
  };

  const resetForm = () => {
    setTitle('');
    setStartDate('');
    setStartTime('');
    setEndDate('');
    setEndTime('');
    setDescription('');
    setLocation('');
    setMeetingLink('');
    setMeetingInfoLink(''); // New field
    setCategory('meeting');
    setAddToCalendarEnabled(true);
    setIsVisible(true);
    setIsStartAllDay(false);
    setIsEndAllDay(false);
    setIsRecurring(false);
    setRecurrenceFrequency('weekly');
    setRecurrenceInterval(1);
    setRecurrenceEndType('noEnd');
    setRecurrenceEndDate('');
    setNumberOfOccurrences('');
    setMonthlyType('absolute');
    setMonthlyDay(1);
    setMonthlyByDay('MO');
    setMonthlyBySetPos(1);
    setYearlyType('absolute');
    setYearlyMonth(1);
    setYearlyDay(1);
    setYearlyByDay('MO');
    setYearlyBySetPos(1);
    setWeeklyDays({
      MO: false,
      TU: false,
      WE: false,
      TH: false,
      FR: false,
      SA: false,
      SU: false
    });
    setEditMode('series');
  };

  const handleCloseModal = () => {
    setShowEventModal(false);
    resetForm();
    setEditingEvent(null);
  };

  const validateDayForMonth = (day, month) => {
    const daysInMonth = new Date(2025, month, 0).getDate();
    return day <= daysInMonth;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title || !startDate || !endDate) {
      alert('Please fill in all required fields');
      return;
    }
    
    if (!isStartAllDay && !startTime) {
      alert('Please fill in start time for timed start');
      return;
    }
    
    if (!isEndAllDay && !endTime) {
      alert('Please fill in end time for timed end');
      return;
    }

    // Validate start and end dates
    const start = validateDate(startDate, startTime, isStartAllDay);
    if (!start) {
      alert('Invalid start date or time. Please check your input.');
      return;
    }

    const end = validateDate(endDate, endTime, isEndAllDay);
    if (!end) {
      alert('Invalid end date or time. Please check your input.');
      return;
    }
    
    if (end <= start) {
      alert('End date/time must be after start date/time');
      return;
    }
    
    if (isRecurring) {
      const interval = validatePositiveInteger(recurrenceInterval);
      if (interval < 1) {
        alert('Recurrence interval must be a positive integer');
        return;
      }

      if (recurrenceEndType === 'count') {
        const count = validatePositiveInteger(numberOfOccurrences);
        if (count < 1) {
          alert('Number of occurrences must be a positive integer');
          return;
        }
      }

      if (recurrenceFrequency === 'weekly' && !Object.values(weeklyDays).some(day => day)) {
        alert('Please select at least one day of the week for weekly recurrence');
        return;
      }
      
      if (recurrenceFrequency === 'monthly' && monthlyType === 'absolute' && !validateDayForMonth(monthlyDay, 1)) {
        alert('The selected day is not valid for all months (e.g., February has 28 or 29 days).');
        return;
      }
      
      if (recurrenceFrequency === 'yearly' && yearlyType === 'absolute' && !validateDayForMonth(yearlyDay, yearlyMonth)) {
        alert(`The selected day (${yearlyDay}) is not valid for ${monthOptions.find(m => m.value === yearlyMonth)?.label}.`);
        return;
      }
    }
    
    let recurrence = null;
    if (isRecurring && editMode === 'series') {
      const isMonthly = recurrenceFrequency === 'monthly';
      const interval = validatePositiveInteger(recurrenceInterval);
      const until = recurrenceEndType === 'endDate' && recurrenceEndDate ? validateDate(recurrenceEndDate) : null;
      const count = recurrenceEndType === 'count' && numberOfOccurrences ? validatePositiveInteger(numberOfOccurrences) : null;

      if (recurrenceEndType === 'endDate' && !until) {
        alert('Invalid recurrence end date. Please check your input.');
        return;
      }

      const rruleOptions = {
        freq: 
          recurrenceFrequency === 'daily' ? RRule.DAILY :
          recurrenceFrequency === 'weekly' ? RRule.WEEKLY :
          recurrenceFrequency === 'monthly' ? RRule.MONTHLY :
          RRule.YEARLY,
        dtstart: start,
        interval,
        until,
        count
      };
      
      // Log state values for debugging
      console.log('State values:', {
        recurrenceFrequency,
        weeklyDays,
        monthlyType,
        monthlyByDay,
        monthlyBySetPos,
        yearlyType,
        yearlyByDay,
        yearlyBySetPos,
        yearlyMonth,
        interval,
        until,
        count
      });

      // Explicitly unset recurrence-related fields to avoid residual values
      delete rruleOptions.byweekday;
      delete rruleOptions.bysetpos;
      delete rruleOptions.bymonthday;
      delete rruleOptions.bymonth;

      if (recurrenceFrequency === 'weekly') {
        const selectedDays = Object.entries(weeklyDays)
          .filter(([_, selected]) => selected)
          .map(([day]) => dayToRRule[day]);
        if (selectedDays.length > 0) {
          rruleOptions.byweekday = selectedDays; // Array of RRule weekday objects for weekly
        } else {
          alert('At least one day must be selected for weekly recurrence.');
          return;
        }
      }
      
      if (recurrenceFrequency === 'monthly') {
        if (monthlyType === 'relative') {
          const validMonthlyByDay = validateDayValue(monthlyByDay);
          const validSetPos = validateSetPosValue(monthlyBySetPos);
          console.log('monthlyByDay (validated):', validMonthlyByDay);
          console.log('monthlyBySetPos (validated):', validSetPos);
          rruleOptions.byweekday = [dayToRRule[validMonthlyByDay]]; // Array of RRule weekday objects
          rruleOptions.bysetpos = [validSetPos];
        } else {
          rruleOptions.bymonthday = [parseInt(monthlyDay)];
        }
      }
      
      if (recurrenceFrequency === 'yearly') {
        const validMonth = validateMonthValue(yearlyMonth);
        rruleOptions.bymonth = [validMonth];
        if (yearlyType === 'relative') {
          const validYearlyByDay = validateDayValue(yearlyByDay);
          const validSetPos = validateSetPosValue(yearlyBySetPos);
          console.log('yearlyByDay (validated):', validYearlyByDay);
          console.log('yearlyBySetPos (validated):', validSetPos);
          rruleOptions.byweekday = [dayToRRule[validYearlyByDay]]; // Array of RRule weekday objects
          rruleOptions.bysetpos = [validSetPos];
        } else {
          rruleOptions.bymonthday = [parseInt(yearlyDay)];
        }
      }
      
      // Debug the rruleOptions before creating the RRule
      console.log('rruleOptions:', rruleOptions);
      
      try {
        const rule = new RRule(rruleOptions);
        recurrence = {
          rrule: rule.toString(),
          isMonthly
        };
      } catch (err) {
        console.error('Error creating RRule:', err);
        alert(`Failed to create recurrence rule: ${err.message || 'Invalid configuration'}. Please check your settings.`);
        return;
      }
    } else if (editingEvent && editingEvent.recurrence) {
      recurrence = editingEvent.recurrence;
    }
    
    const eventData = {
      title,
      start,
      end,
      description,
      location,
      meetingLink,
      meetingInfoLink, // New field
      category,
      color: categoryColors[category] || categoryColors.other,
      addToCalendarEnabled,
      isVisible,
      isStartAllDay,
      isEndAllDay,
      recurrence,
      exceptions: editingEvent && editingEvent.exceptions ? editingEvent.exceptions : []
    };
    
    try {
      if (editingEvent) {
        if (editMode === 'instance' && editingEvent.recurrence && editingEvent.instanceDate) {
          const existingExceptions = Array.isArray(editingEvent.exceptions) ? editingEvent.exceptions : [];
          const instanceDate = editingEvent.instanceDate;
          const updatedExceptions = existingExceptions.filter(ex => ex.date !== instanceDate).concat([{
            date: instanceDate,
            start: start.toISOString(),
            end: end.toISOString(),
            isStartAllDay,
            isEndAllDay
          }]);
          eventData.exceptions = updatedExceptions;
          await updateEvent(editingEvent.id, eventData);
        } else {
          await updateEvent(editingEvent.id, eventData);
        }
      } else {
        await addEvent(eventData);
      }
      
      await fetchEvents();
      handleCloseModal();
    } catch (err) {
      console.error("Error saving event:", err);
      alert(`Failed to ${editingEvent ? 'update' : 'create'} event. Please try again.`);
    }
  };

  const handleEditModeSelect = (mode) => {
    setEditMode(mode);
  };

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

  const handleDeleteOccurrence = async () => {
    if (!editingEvent || !editingEvent.instanceDate) return;
    if (window.confirm('Are you sure you want to delete this occurrence?')) {
      try {
        const existingExceptions = Array.isArray(editingEvent.exceptions) ? editingEvent.exceptions : [];
        const updatedExceptions = existingExceptions.concat([{
          date: editingEvent.instanceDate,
          deleted: true
        }]);
        const eventData = { ...editingEvent, exceptions: updatedExceptions };
        await updateEvent(editingEvent.id, eventData);
        await fetchEvents();
        handleCloseModal();
      } catch (err) {
        console.error("Error deleting occurrence:", err);
        alert('Failed to delete occurrence. Please try again.');
      }
    }
  };

  const handleWeeklyDayToggle = (day) => {
    setWeeklyDays(prev => ({
      ...prev,
      [day]: !prev[day]
    }));
  };

  const handleWeeklyDayKeyDown = (day, e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleWeeklyDayToggle(day);
    }
  };

  const formattedEvents = events.map(event => {
    const startDate = new Date(event.start).toISOString().substring(0, 10);
    const endDate = new Date(event.end).toISOString().substring(0, 10);
    const isMultiDay = startDate !== endDate;

    return {
      id: event.id,
      title: event.title + (event.isVisible === false ? ' (Hidden)' : ''),
      start: event.start,
      end: event.end,
      allDay: event.isStartAllDay && event.isEndAllDay,
      backgroundColor: event.isVisible === false ? '#cccccc' : event.color,
      borderColor: event.isVisible === false ? '#aaaaaa' : event.color,
      textColor: event.isVisible === false ? '#666666' : undefined,
      classNames: [
        event.isVisible === false ? 'hidden-event' : '',
        (event.isStartAllDay && event.isEndAllDay && isMultiDay) ? 'multi-day-event' : '',
        event.extendedProps?.isException ? 'exception-event' : ''
      ].filter(Boolean),
      extendedProps: {
        description: event.description,
        location: event.location,
        meetingLink: event.meetingLink,
        meetingInfoLink: event.meetingInfoLink, // New field
        category: event.category,
        addToCalendarEnabled: event.addToCalendarEnabled,
        isVisible: event.isVisible,
        isStartAllDay: event.isStartAllDay,
        isEndAllDay: event.isEndAllDay,
        recurrence: event.recurrence,
        instanceDate: event.extendedProps?.instanceDate,
        isException: event.extendedProps?.isException || false
      }
    };
  });

  return (
    <div className="admin-calendar-container">
      <header className="cal-admin-header">
        <h1>eHealth Hub Calendar Management</h1>
        <div className="admin-nav-buttons">
          <button 
            className="nav-button blog-admin-btn"
            onClick={() => navigate('/blog-admin')}
          >
            📝 Blog Admin
          </button>
          <button className="logout-button" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
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
              {editingEvent && editingEvent.recurrence && (
                <div className="form-group">
                  <label>Edit:</label>
                  <div className="edit-mode-buttons">
                    <button
                      type="button"
                      className={editMode === 'instance' ? 'active' : ''}
                      onClick={() => handleEditModeSelect('instance')}
                    >
                      This event only
                    </button>
                    <button
                      type="button"
                      className={editMode === 'series' ? 'active' : ''}
                      onClick={() => handleEditModeSelect('series')}
                    >
                      All events in the series
                    </button>
                  </div>
                </div>
              )}
              
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
              
              <div className="form-group checkbox-group">
                <input
                  id="isStartAllDay"
                  type="checkbox"
                  checked={isStartAllDay}
                  onChange={(e) => setIsStartAllDay(e.target.checked)}
                />
                <label htmlFor="isStartAllDay">
                  All-day start
                </label>
              </div>
              
              <div className="form-group checkbox-group">
                <input
                  id="isEndAllDay"
                  type="checkbox"
                  checked={isEndAllDay}
                  onChange={(e) => setIsEndAllDay(e.target.checked)}
                />
                <label htmlFor="isEndAllDay">
                  All-day end
                </label>
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
                
                {!isStartAllDay && (
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
                )}
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
                
                {!isEndAllDay && (
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
                )}
              </div>
              
              <div className="form-group checkbox-group">
                <input
                  id="isRecurring"
                  type="checkbox"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  disabled={editMode === 'instance'}
                />
                <label htmlFor="isRecurring">
                  This is a recurring event
                </label>
              </div>
              
              {isRecurring && editMode === 'series' && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="recurrenceFrequency">Recurrence Frequency *</label>
                      <select
                        id="recurrenceFrequency"
                        value={recurrenceFrequency}
                        onChange={(e) => setRecurrenceFrequency(e.target.value)}
                        required
                      >
                        {recurrenceOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="recurrenceInterval">Repeat Every *</label>
                      <input
                        id="recurrenceInterval"
                        type="number"
                        min="1"
                        value={recurrenceInterval}
                        onChange={(e) => setRecurrenceInterval(e.target.value)}
                        placeholder={
                          recurrenceFrequency === 'daily' ? 'e.g., 1 for every day' :
                          recurrenceFrequency === 'weekly' ? 'e.g., 1 for every week' :
                          recurrenceFrequency === 'monthly' ? 'e.g., 1 for every month' :
                          'e.g., 1 for every year'
                        }
                        required
                      />
                      <small className="form-hint">
                        {recurrenceFrequency === 'daily' ? 'Enter the number of days between occurrences' :
                         recurrenceFrequency === 'weekly' ? 'Enter the number of weeks between occurrences' :
                         recurrenceFrequency === 'monthly' ? 'Enter the number of months between occurrences' :
                         'Enter the number of years between occurrences'}
                      </small>
                    </div>
                  </div>
                  
                  {recurrenceFrequency === 'weekly' && (
                    <div className="form-group">
                      <label>Days of the Week *</label>
                      <div className="day-buttons">
                        {Object.keys(weeklyDays).map(day => (
                          <button
                            key={day}
                            type="button"
                            className={`day-button ${weeklyDays[day] ? 'selected' : ''}`}
                            onClick={() => handleWeeklyDayToggle(day)}
                            onKeyDown={(e) => handleWeeklyDayKeyDown(day, e)}
                            aria-label={`Toggle ${dayOptions.find(d => d.value === day)?.label}`}
                          >
                            {day.substring(0, 1)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {recurrenceFrequency === 'monthly' && (
                    <div className="form-group">
                      <label>Monthly Recurrence Type:</label>
                      <div className="form-row">
                        <label>
                          <input
                            type="radio"
                            value="absolute"
                            checked={monthlyType === 'absolute'}
                            onChange={() => setMonthlyType('absolute')}
                          />
                          Day of Month
                        </label>
                        <label>
                          <input
                            type="radio"
                            value="relative"
                            checked={monthlyType === 'relative'}
                            onChange={() => setMonthlyType('relative')}
                          />
                          Relative Day
                        </label>
                      </div>
                      {monthlyType === 'absolute' && (
                        <div className="form-group">
                          <label htmlFor="monthlyDay">Day of Month *</label>
                          <input
                            id="monthlyDay"
                            type="number"
                            min="1"
                            max="31"
                            value={monthlyDay}
                            onChange={(e) => setMonthlyDay(e.target.value)}
                            required
                          />
                        </div>
                      )}
                      {monthlyType === 'relative' && (
                        <div className="form-row">
                          <div className="form-group">
                            <label htmlFor="monthlyBySetPos">Position *</label>
                            <select
                              id="monthlyBySetPos"
                              value={monthlyBySetPos}
                              onChange={(e) => setMonthlyBySetPos(parseInt(e.target.value))}
                              required
                            >
                              {setPosOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="form-group">
                            <label htmlFor="monthlyByDay">Day *</label>
                            <select
                              id="monthlyByDay"
                              value={monthlyByDay}
                              onChange={(e) => setMonthlyByDay(e.target.value)}
                              required
                            >
                              {dayOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {recurrenceFrequency === 'yearly' && (
                    <div className="form-group">
                      <label>Yearly Recurrence Type:</label>
                      <div className="form-row">
                        <label>
                          <input
                            type="radio"
                            value="absolute"
                            checked={yearlyType === 'absolute'}
                            onChange={() => setYearlyType('absolute')}
                          />
                          Specific Date
                        </label>
                        <label>
                          <input
                            type="radio"
                            value="relative"
                            checked={yearlyType === 'relative'}
                            onChange={() => setYearlyType('relative')}
                          />
                          Relative Day
                        </label>
                      </div>
                      {yearlyType === 'absolute' && (
                        <div className="form-row">
                          <div className="form-group">
                            <label htmlFor="yearlyMonth">Month *</label>
                            <select
                              id="yearlyMonth"
                              value={yearlyMonth}
                              onChange={(e) => setYearlyMonth(parseInt(e.target.value))}
                              required
                            >
                              {monthOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="form-group">
                            <label htmlFor="yearlyDay">Day *</label>
                            <input
                              id="yearlyDay"
                              type="number"
                              min="1"
                              max="31"
                              value={yearlyDay}
                              onChange={(e) => setYearlyDay(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                      )}
                      {yearlyType === 'relative' && (
                        <div className="form-row">
                          <div className="form-group">
                            <label htmlFor="yearlyBySetPos">Position *</label>
                            <select
                              id="yearlyBySetPos"
                              value={yearlyBySetPos}
                              onChange={(e) => setYearlyBySetPos(parseInt(e.target.value))}
                              required
                            >
                              {setPosOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="form-group">
                            <label htmlFor="yearlyByDay">Day *</label>
                            <select
                              id="yearlyByDay"
                              value={yearlyByDay}
                              onChange={(e) => setYearlyByDay(e.target.value)}
                              required
                            >
                              {dayOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="form-group">
                            <label htmlFor="yearlyMonth">Month *</label>
                            <select
                              id="yearlyMonth"
                              value={yearlyMonth}
                              onChange={(e) => setYearlyMonth(parseInt(e.target.value))}
                              required
                            >
                              {monthOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="form-group">
                    <label>Recurrence Range:</label>
                    <div className="form-row">
                      <label>
                        <input
                          type="radio"
                          value="noEnd"
                          checked={recurrenceEndType === 'noEnd'}
                          onChange={() => setRecurrenceEndType('noEnd')}
                        />
                        No end date
                      </label>
                      <label>
                        <input
                          type="radio"
                          value="endDate"
                          checked={recurrenceEndType === 'endDate'}
                          onChange={() => setRecurrenceEndType('endDate')}
                        />
                        End by date
                      </label>
                      <label>
                        <input
                          type="radio"
                          value="count"
                          checked={recurrenceEndType === 'count'}
                          onChange={() => setRecurrenceEndType('count')}
                        />
                        End after occurrences
                      </label>
                    </div>
                    {recurrenceEndType === 'endDate' && (
                      <div className="form-group">
                        <label htmlFor="recurrenceEndDate">End Date *</label>
                        <input
                          id="recurrenceEndDate"
                          type="date"
                          value={recurrenceEndDate}
                          onChange={(e) => setRecurrenceEndDate(e.target.value)}
                          required
                        />
                      </div>
                    )}
                    {recurrenceEndType === 'count' && (
                      <div className="form-group">
                        <label htmlFor="numberOfOccurrences">Number of Occurrences *</label>
                        <input
                          id="numberOfOccurrences"
                          type="number"
                          min="1"
                          value={numberOfOccurrences}
                          onChange={(e) => setNumberOfOccurrences(e.target.value)}
                          required
                        />
                      </div>
                    )}
                  </div>
                </>
              )}
              
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
                <label htmlFor="meetingInfoLink">Meeting Info Link</label>
                <input
                  id="meetingInfoLink"
                  type="url"
                  value={meetingInfoLink}
                  onChange={(e) => setMeetingInfoLink(e.target.value)}
                  placeholder="Enter conference website, registration link, etc."
                />
                <small className="form-hint">Link to conference info, registration, or additional details</small>
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
                  <>
                    <button 
                      type="button" 
                      className="delete-button"
                      onClick={handleDeleteEvent}
                    >
                      Delete Event
                    </button>
                    {editMode === 'instance' && (
                      <button
                        type="button"
                        className="delete-occurrence-button"
                        onClick={handleDeleteOccurrence}
                      >
                        Delete This Occurrence
                      </button>
                    )}
                  </>
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