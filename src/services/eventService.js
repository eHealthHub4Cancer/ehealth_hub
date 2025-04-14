import { 
    collection, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc, 
    getDocs, 
    query, 
    orderBy, 
    getDoc,
    Timestamp 
  } from 'firebase/firestore';
  import { db } from '../firebase';
  
  // Constants
  const EVENTS_COLLECTION = 'events';
  const CATEGORY_COLORS = {
    meeting: '#2196F3',    // Blue
    conference: '#4CAF50', // Green
    deadline: '#F44336',   // Red
    workshop: '#9C27B0',   // Purple
    other: '#FF9800'       // Orange
  };
  
  // Get all events
  export const getEvents = async () => {
    try {
      const eventsCollection = collection(db, EVENTS_COLLECTION);
      const eventsQuery = query(eventsCollection, orderBy('start', 'asc'));
      const snapshot = await getDocs(eventsQuery);
      
      return snapshot.docs.map(doc => {
        const data = doc.data();
        
        // Convert Firestore Timestamps to JavaScript Dates
        return {
          id: doc.id,
          ...data,
          start: data.start?.toDate(),
          end: data.end?.toDate()
        };
      });
    } catch (error) {
      console.error("Error getting events:", error);
      throw error;
    }
  };
  
  // Get a single event by ID
  export const getEvent = async (id) => {
    try {
      const eventRef = doc(db, EVENTS_COLLECTION, id);
      const eventDoc = await getDoc(eventRef);
      
      if (!eventDoc.exists()) {
        throw new Error('Event not found');
      }
      
      const data = eventDoc.data();
      return {
        id: eventDoc.id,
        ...data,
        start: data.start?.toDate(),
        end: data.end?.toDate()
      };
    } catch (error) {
      console.error("Error getting event:", error);
      throw error;
    }
  };
  
  // Add new event
  export const addEvent = async (eventData) => {
    try {
      // Auto-assign color based on category if not provided
      if (!eventData.color && eventData.category) {
        eventData.color = CATEGORY_COLORS[eventData.category] || CATEGORY_COLORS.other;
      }
      
      // Convert JavaScript Date objects to Firestore Timestamps
      const firestoreData = {
        ...eventData,
        start: Timestamp.fromDate(new Date(eventData.start)),
        end: Timestamp.fromDate(new Date(eventData.end)),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };
      
      const docRef = await addDoc(collection(db, EVENTS_COLLECTION), firestoreData);
      
      return {
        id: docRef.id,
        ...eventData
      };
    } catch (error) {
      console.error("Error adding event:", error);
      throw error;
    }
  };
  
  // Update event
  export const updateEvent = async (id, eventData) => {
    try {
      const eventRef = doc(db, EVENTS_COLLECTION, id);
      
      // Auto-assign color based on category if not provided
      if (!eventData.color && eventData.category) {
        eventData.color = CATEGORY_COLORS[eventData.category] || CATEGORY_COLORS.other;
      }
      
      // Convert JavaScript Date objects to Firestore Timestamps
      const firestoreData = {
        ...eventData,
        start: eventData.start instanceof Date 
          ? Timestamp.fromDate(eventData.start)
          : Timestamp.fromDate(new Date(eventData.start)),
        end: eventData.end instanceof Date
          ? Timestamp.fromDate(eventData.end)
          : Timestamp.fromDate(new Date(eventData.end)),
        updatedAt: Timestamp.now()
      };
      
      await updateDoc(eventRef, firestoreData);
      
      return {
        id,
        ...eventData
      };
    } catch (error) {
      console.error("Error updating event:", error);
      throw error;
    }
  };
  
  // Delete event
  export const deleteEvent = async (id) => {
    try {
      const eventRef = doc(db, EVENTS_COLLECTION, id);
      await deleteDoc(eventRef);
      return id;
    } catch (error) {
      console.error("Error deleting event:", error);
      throw error;
    }
  };
  
  // Get category colors (for the UI)
  export const getCategoryColors = () => {
    return CATEGORY_COLORS;
  };
  
  // Generate iCalendar format for "Add to Calendar" functionality
  export const generateICalString = (event) => {
    const formatDate = (date) => {
      return date.toISOString().replace(/-|:|\.\d+/g, '');
    };
    
    const startDate = formatDate(new Date(event.start));
    const endDate = formatDate(new Date(event.end));
    
    // Create description with meeting link if available
    let description = event.description || '';
    if (event.meetingLink) {
      description += description ? '\n\nJoin meeting: ' + event.meetingLink : 'Join meeting: ' + event.meetingLink;
    }
    
    return `BEGIN:VCALENDAR
  VERSION:2.0
  BEGIN:VEVENT
  SUMMARY:${event.title}
  DTSTART:${startDate}
  DTEND:${endDate}
  DESCRIPTION:${description}
  LOCATION:${event.location || ''}
  END:VEVENT
  END:VCALENDAR`;
  };
  
  // Generate downloadable link for calendar
  export const generateCalendarLink = (event, type = 'ical') => {
    // Create description with meeting link if available
    let description = event.description || '';
    if (event.meetingLink) {
      description += description ? '\n\nJoin meeting: ' + event.meetingLink : 'Join meeting: ' + event.meetingLink;
    }
  
    if (type === 'ical') {
      const icalData = generateICalString(event);
      const encodedData = encodeURIComponent(icalData);
      return `data:text/calendar;charset=utf-8,${encodedData}`;
    } else if (type === 'google') {
      const startDate = new Date(event.start).toISOString().replace(/-|:|\.\d+/g, '');
      const endDate = new Date(event.end).toISOString().replace(/-|:|\.\d+/g, '');
      
      return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(event.location || '')}`;
    } else if (type === 'outlook') {
      // Use the Office 365 calendar URL format for better compatibility
      const startIso = new Date(event.start).toISOString();
      const endIso = new Date(event.end).toISOString();
      
      return `https://outlook.office.com/calendar/action/compose?subject=${encodeURIComponent(event.title)}&startdt=${startIso}&enddt=${endIso}&body=${encodeURIComponent(description)}&location=${encodeURIComponent(event.location || '')}`;
    }
    
    return '';
  };