// src/services/forumService.js
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
    setDoc,
    Timestamp 
  } from 'firebase/firestore';
  import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
  import { db, storage, auth } from '../firebase';
  
  // Constants
  const FORUM_COLLECTION = 'allIslandForum';
  
  // User roles - matching your existing system
  const USER_ROLES = {
    'ehealth@ul.ie': 'admin',
    'user@ehealth.ie': 'user'
  };
  
  // Get user role
  export const getUserRole = (email) => {
    return USER_ROLES[email] || 'user';
  };
  
  // ==================== FORUM DATA OPERATIONS ====================
  
  // Create or Update forum data for a specific year
  export const saveForumData = async (year, forumData) => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('User not authenticated');
      }
  
      const forumRef = doc(db, FORUM_COLLECTION, year.toString());
      
      // Check if document exists
      const forumDoc = await getDoc(forumRef);
      
      const firestoreData = {
        year: parseInt(year),
        title: forumData.title || '',
        subtitle: forumData.subtitle || '',
        date: forumData.date || '',
        venue: forumData.venue || '',
        description: forumData.description || '',
        highlights: forumData.highlights || '',
        coverImage: forumData.coverImage || '',
        heroImage: forumData.heroImage || '',
        blogLinks: forumData.blogLinks || [],
        newsLinks: forumData.newsLinks || [],
        mediaGalleryUrl: forumData.mediaGalleryUrl || '',
        agendaItems: forumData.agendaItems || [],
        speakers: forumData.speakers || [],
        posters: forumData.posters || [],
        registrationLink: forumData.registrationLink || '',
        submitAbstractLink: forumData.submitAbstractLink || '',
        status: forumData.status || 'upcoming', // upcoming, past, ongoing
        updatedBy: currentUser.email,
        updatedAt: Timestamp.now()
      };
  
      if (forumDoc.exists()) {
        // Update existing document
        await updateDoc(forumRef, firestoreData);
      } else {
        // Create new document with additional fields
        firestoreData.createdBy = currentUser.email;
        firestoreData.createdAt = Timestamp.now();
        await setDoc(forumRef, firestoreData);
      }
      
      return {
        id: year.toString(),
        ...forumData
      };
    } catch (error) {
      console.error("Error saving forum data:", error);
      throw error;
    }
  };
  
  // Get forum data by year
  export const getForumData = async (year) => {
    try {
      const forumRef = doc(db, FORUM_COLLECTION, year.toString());
      const forumDoc = await getDoc(forumRef);
      
      if (!forumDoc.exists()) {
        return null;
      }
      
      const data = forumDoc.data();
      return {
        id: forumDoc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate()
      };
    } catch (error) {
      console.error("Error getting forum data:", error);
      throw error;
    }
  };
  
  // Get all forums (sorted by year descending)
  export const getAllForums = async () => {
    try {
      const forumsQuery = query(
        collection(db, FORUM_COLLECTION),
        orderBy('year', 'desc')
      );
      
      const snapshot = await getDocs(forumsQuery);
      
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate()
        };
      });
    } catch (error) {
      console.error("Error getting all forums:", error);
      throw error;
    }
  };
  
  // Delete forum data for a specific year
  export const deleteForumData = async (year) => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser || getUserRole(currentUser.email) !== 'admin') {
        throw new Error('Only admin can delete forum data');
      }
  
      const forumRef = doc(db, FORUM_COLLECTION, year.toString());
      await deleteDoc(forumRef);
      
      return year;
    } catch (error) {
      console.error("Error deleting forum data:", error);
      throw error;
    }
  };
  
  // ==================== IMAGE UPLOAD OPERATIONS ====================
  
  // Upload forum hero/cover image
  export const uploadForumImage = async (file, year, imageType = 'cover') => {
    try {
      if (!file) {
        throw new Error('No file provided');
      }
  
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        throw new Error('Invalid file type. Please upload JPG, PNG, or WebP images.');
      }
  
      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error('File size exceeds 5MB limit');
      }
  
      // Create unique filename
      const timestamp = Date.now();
      const fileName = `forum-images/${year}/${imageType}-${timestamp}-${file.name}`;
      const storageRef = ref(storage, fileName);
      
      // Upload file
      const snapshot = await uploadBytes(storageRef, file);
      
      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return downloadURL;
    } catch (error) {
      console.error("Error uploading forum image:", error);
      throw error;
    }
  };
  
  // Delete forum image from storage
  export const deleteForumImage = async (imageUrl) => {
    try {
      if (!imageUrl) return;
      
      // Extract the file path from the URL
      const fileRef = ref(storage, imageUrl);
      await deleteObject(fileRef);
    } catch (error) {
      console.error("Error deleting forum image:", error);
      // Don't throw error if image doesn't exist
      if (error.code !== 'storage/object-not-found') {
        throw error;
      }
    }
  };
  
  // ==================== LINK MANAGEMENT OPERATIONS ====================
  
  // Add a blog link to forum
  export const addBlogLink = async (year, linkData) => {
    try {
      const forumData = await getForumData(year);
      
      if (!forumData) {
        throw new Error('Forum data not found');
      }
  
      const newLink = {
        id: Date.now().toString(),
        title: linkData.title || '',
        url: linkData.url || '',
        addedAt: Timestamp.now()
      };
  
      const updatedBlogLinks = [...(forumData.blogLinks || []), newLink];
      
      await saveForumData(year, {
        ...forumData,
        blogLinks: updatedBlogLinks
      });
  
      return newLink;
    } catch (error) {
      console.error("Error adding blog link:", error);
      throw error;
    }
  };
  
  // Remove a blog link from forum
  export const removeBlogLink = async (year, linkId) => {
    try {
      const forumData = await getForumData(year);
      
      if (!forumData) {
        throw new Error('Forum data not found');
      }
  
      const updatedBlogLinks = (forumData.blogLinks || []).filter(
        link => link.id !== linkId
      );
      
      await saveForumData(year, {
        ...forumData,
        blogLinks: updatedBlogLinks
      });
  
      return linkId;
    } catch (error) {
      console.error("Error removing blog link:", error);
      throw error;
    }
  };
  
  // Add a news link to forum
  export const addNewsLink = async (year, linkData) => {
    try {
      const forumData = await getForumData(year);
      
      if (!forumData) {
        throw new Error('Forum data not found');
      }
  
      const newLink = {
        id: Date.now().toString(),
        title: linkData.title || '',
        url: linkData.url || '',
        addedAt: Timestamp.now()
      };
  
      const updatedNewsLinks = [...(forumData.newsLinks || []), newLink];
      
      await saveForumData(year, {
        ...forumData,
        newsLinks: updatedNewsLinks
      });
  
      return newLink;
    } catch (error) {
      console.error("Error adding news link:", error);
      throw error;
    }
  };
  
  // Remove a news link from forum
  export const removeNewsLink = async (year, linkId) => {
    try {
      const forumData = await getForumData(year);
      
      if (!forumData) {
        throw new Error('Forum data not found');
      }
  
      const updatedNewsLinks = (forumData.newsLinks || []).filter(
        link => link.id !== linkId
      );
      
      await saveForumData(year, {
        ...forumData,
        newsLinks: updatedNewsLinks
      });
  
      return linkId;
    } catch (error) {
      console.error("Error removing news link:", error);
      throw error;
    }
  };
  
  // ==================== AGENDA MANAGEMENT OPERATIONS ====================
  
  // Add agenda item
  export const addAgendaItem = async (year, agendaData) => {
    try {
      const forumData = await getForumData(year);
      
      if (!forumData) {
        throw new Error('Forum data not found');
      }
  
      const newAgendaItem = {
        id: Date.now().toString(),
        time: agendaData.time || '',
        title: agendaData.title || '',
        description: agendaData.description || '',
        speaker: agendaData.speaker || '',
        addedAt: Timestamp.now()
      };
  
      const updatedAgenda = [...(forumData.agendaItems || []), newAgendaItem];
      
      await saveForumData(year, {
        ...forumData,
        agendaItems: updatedAgenda
      });
  
      return newAgendaItem;
    } catch (error) {
      console.error("Error adding agenda item:", error);
      throw error;
    }
  };
  
  // Remove agenda item
  export const removeAgendaItem = async (year, itemId) => {
    try {
      const forumData = await getForumData(year);
      
      if (!forumData) {
        throw new Error('Forum data not found');
      }
  
      const updatedAgenda = (forumData.agendaItems || []).filter(
        item => item.id !== itemId
      );
      
      await saveForumData(year, {
        ...forumData,
        agendaItems: updatedAgenda
      });
  
      return itemId;
    } catch (error) {
      console.error("Error removing agenda item:", error);
      throw error;
    }
  };
  
  // ==================== SPEAKER MANAGEMENT OPERATIONS ====================
  
  // Add speaker
  export const addSpeaker = async (year, speakerData) => {
    try {
      const forumData = await getForumData(year);
      
      if (!forumData) {
        throw new Error('Forum data not found');
      }
  
      const newSpeaker = {
        id: Date.now().toString(),
        name: speakerData.name || '',
        title: speakerData.title || '',
        organization: speakerData.organization || '',
        bio: speakerData.bio || '',
        photo: speakerData.photo || '',
        addedAt: Timestamp.now()
      };
  
      const updatedSpeakers = [...(forumData.speakers || []), newSpeaker];
      
      await saveForumData(year, {
        ...forumData,
        speakers: updatedSpeakers
      });
  
      return newSpeaker;
    } catch (error) {
      console.error("Error adding speaker:", error);
      throw error;
    }
  };
  
  // Remove speaker
  export const removeSpeaker = async (year, speakerId) => {
    try {
      const forumData = await getForumData(year);
      
      if (!forumData) {
        throw new Error('Forum data not found');
      }
  
      const updatedSpeakers = (forumData.speakers || []).filter(
        speaker => speaker.id !== speakerId
      );
      
      await saveForumData(year, {
        ...forumData,
        speakers: updatedSpeakers
      });
  
      return speakerId;
    } catch (error) {
      console.error("Error removing speaker:", error);
      throw error;
    }
  };
  
  // ==================== UTILITY FUNCTIONS ====================
  
  // Get available years for forums
  export const getAvailableYears = async () => {
    try {
      const forums = await getAllForums();
      return forums.map(forum => forum.year).sort((a, b) => b - a);
    } catch (error) {
      console.error("Error getting available years:", error);
      throw error;
    }
  };
  
  // Check if forum exists for a year
  export const forumExists = async (year) => {
    try {
      const forumData = await getForumData(year);
      return forumData !== null;
    } catch (error) {
      console.error("Error checking forum existence:", error);
      return false;
    }
  };