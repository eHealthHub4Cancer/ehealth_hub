// src/services/ohdsiSeminarService.js
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
const SEMINARS_COLLECTION = 'ohdsiSeminars';

// User roles - matching your existing system
const USER_ROLES = {
  'ehealth@ul.ie': 'admin',
  'user@ehealth.ie': 'user'
};

// Get user role
export const getUserRole = (email) => {
  return USER_ROLES[email] || 'user';
};

// ==================== SEMINAR DATA OPERATIONS ====================

// Create or Update seminar
export const saveSeminarData = async (seminarId, seminarData) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    const firestoreData = {
      title: seminarData.title || '',
      date: seminarData.date || '',
      time: seminarData.time || '',
      speaker: seminarData.speaker || '',
      description: seminarData.description || '',
      teamsLink: seminarData.teamsLink || '',
      recordingLink: seminarData.recordingLink || '',
      slidesLink: seminarData.slidesLink || '', // ADDED: Slides link field
      flyerImage: seminarData.flyerImage || '',
      status: seminarData.status || 'upcoming', // upcoming or past
      updatedBy: currentUser.email,
      updatedAt: Timestamp.now()
    };

    if (seminarId) {
      // Update existing seminar
      const seminarRef = doc(db, SEMINARS_COLLECTION, seminarId);
      await updateDoc(seminarRef, firestoreData);
      return { id: seminarId, ...seminarData };
    } else {
      // Create new seminar
      firestoreData.createdBy = currentUser.email;
      firestoreData.createdAt = Timestamp.now();
      const docRef = await addDoc(collection(db, SEMINARS_COLLECTION), firestoreData);
      return { id: docRef.id, ...seminarData };
    }
  } catch (error) {
    console.error("Error saving seminar data:", error);
    throw error;
  }
};

// Get all seminars
export const getAllSeminars = async () => {
  try {
    const seminarsQuery = query(
      collection(db, SEMINARS_COLLECTION),
      orderBy('date', 'desc')
    );
    
    const snapshot = await getDocs(seminarsQuery);
    
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
    console.error("Error getting all seminars:", error);
    throw error;
  }
};

// Get seminar by ID
export const getSeminarById = async (seminarId) => {
  try {
    const seminarRef = doc(db, SEMINARS_COLLECTION, seminarId);
    const seminarDoc = await getDoc(seminarRef);
    
    if (!seminarDoc.exists()) {
      throw new Error('Seminar not found');
    }
    
    const data = seminarDoc.data();
    return {
      id: seminarDoc.id,
      ...data,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate()
    };
  } catch (error) {
    console.error("Error getting seminar:", error);
    throw error;
  }
};

// Get seminars by status
export const getSeminarsByStatus = async (status) => {
  try {
    const seminarsQuery = query(
      collection(db, SEMINARS_COLLECTION),
      orderBy('date', status === 'upcoming' ? 'asc' : 'desc')
    );
    
    const snapshot = await getDocs(seminarsQuery);
    
    const seminars = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate()
      };
    });

    // Filter by status
    return seminars.filter(seminar => seminar.status === status);
  } catch (error) {
    console.error("Error getting seminars by status:", error);
    throw error;
  }
};

// Delete seminar
export const deleteSeminar = async (seminarId) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser || getUserRole(currentUser.email) !== 'admin') {
      throw new Error('Only admin can delete seminars');
    }

    const seminarRef = doc(db, SEMINARS_COLLECTION, seminarId);
    await deleteDoc(seminarRef);
    
    return seminarId;
  } catch (error) {
    console.error("Error deleting seminar:", error);
    throw error;
  }
};

// ==================== IMAGE UPLOAD OPERATIONS ====================

// Upload flyer image to Firebase Storage
export const uploadFlyerImage = async (file, seminarId) => {
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
    const fileName = `ohdsi-seminars/${seminarId || timestamp}-${file.name}`;
    const storageRef = ref(storage, fileName);
    
    // Upload file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error("Error uploading flyer image:", error);
    throw error;
  }
};

// Delete flyer image from storage
export const deleteFlyerImage = async (imageUrl) => {
  try {
    if (!imageUrl) return;
    
    // Extract the file path from the URL
    const fileRef = ref(storage, imageUrl);
    await deleteObject(fileRef);
  } catch (error) {
    console.error("Error deleting flyer image:", error);
    // Don't throw error if image doesn't exist
    if (error.code !== 'storage/object-not-found') {
      throw error;
    }
  }
};

// ==================== UTILITY FUNCTIONS ====================

// Check if seminar exists
export const seminarExists = async (seminarId) => {
  try {
    const seminarData = await getSeminarById(seminarId);
    return seminarData !== null;
  } catch (error) {
    console.error("Error checking seminar existence:", error);
    return false;
  }
};