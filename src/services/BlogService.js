// src/services/blogService.js
import { 
    collection, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc, 
    getDocs, 
    query, 
    orderBy,
    where,
    getDoc,
    Timestamp 
  } from 'firebase/firestore';
  import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
  import { db, storage, auth } from '../firebase';
  
  // Constants
  const BLOG_POSTS_COLLECTION = 'blogPosts';
  
  // User roles - this matches your PrivateRoute
  const USER_ROLES = {
    'ehealth@ul.ie': 'admin',
    'user@ehealth.ie': 'user'
  };
  
  // Get user role
  export const getUserRole = (email) => {
    return USER_ROLES[email] || 'user';
  };
  
  // Create new blog post
  export const createBlogPost = async (postData) => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('User not authenticated');
      }
  
      const firestoreData = {
        title: postData.title || '',
        content: postData.content || '',
        authors: postData.authors || '',
        coverImage: postData.coverImage || '',
        authorEmail: currentUser.email,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        status: postData.status || 'draft'
        // Don't include publishedAt for drafts
      };
  
      const docRef = await addDoc(collection(db, BLOG_POSTS_COLLECTION), firestoreData);
      
      return docRef.id;
    } catch (error) {
      console.error("Error creating blog post:", error);
      throw error;
    }
  };
  
  // Get all blog posts (with status filter)
  export const getAllBlogPosts = async (status = 'published') => {
    try {
      let postsQuery;
      
      if (status === 'all') {
        // For admin: get all posts
        postsQuery = query(
          collection(db, BLOG_POSTS_COLLECTION),
          orderBy('createdAt', 'desc')
        );
      } else {
        // Filter by status
        postsQuery = query(
          collection(db, BLOG_POSTS_COLLECTION),
          where('status', '==', status),
          orderBy('createdAt', 'desc')
        );
      }
      
      const snapshot = await getDocs(postsQuery);
      
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
          publishedAt: data.publishedAt?.toDate()
        };
      });
    } catch (error) {
      console.error("Error getting blog posts:", error);
      throw error;
    }
  };
  
  // Get posts by current user OR all posts if admin
  export const getUserBlogPosts = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('User not authenticated');
      }
  
      const userRole = getUserRole(currentUser.email);
      let postsQuery;
  
      if (userRole === 'admin') {
        // Admin sees ALL posts (same as getAllBlogPosts with 'all' status)
        postsQuery = query(
          collection(db, BLOG_POSTS_COLLECTION),
          orderBy('createdAt', 'desc')
        );
      } else {
        // Regular users see only their own posts
        postsQuery = query(
          collection(db, BLOG_POSTS_COLLECTION),
          where('authorEmail', '==', currentUser.email),
          orderBy('createdAt', 'desc')
        );
      }
      
      const snapshot = await getDocs(postsQuery);
      
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
          publishedAt: data.publishedAt?.toDate()
        };
      });
    } catch (error) {
      console.error("Error getting user blog posts:", error);
      throw error;
    }
  };
  
  // Get single blog post by ID
  export const getBlogPost = async (id) => {
    try {
      const postRef = doc(db, BLOG_POSTS_COLLECTION, id);
      const postDoc = await getDoc(postRef);
      
      if (!postDoc.exists()) {
        throw new Error('Blog post not found');
      }
      
      const data = postDoc.data();
      return {
        id: postDoc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
        publishedAt: data.publishedAt?.toDate()
      };
    } catch (error) {
      console.error("Error getting blog post:", error);
      throw error;
    }
  };
  
  // Update blog post
  export const updateBlogPost = async (id, postData) => {
    try {
      const postRef = doc(db, BLOG_POSTS_COLLECTION, id);
      
      // Clean up undefined values
      const cleanedData = {};
      Object.keys(postData).forEach(key => {
        if (postData[key] !== undefined && postData[key] !== null) {
          cleanedData[key] = postData[key];
        }
      });
      
      const firestoreData = {
        ...cleanedData,
        updatedAt: Timestamp.now()
      };
      
      await updateDoc(postRef, firestoreData);
      
      return {
        id,
        ...postData
      };
    } catch (error) {
      console.error("Error updating blog post:", error);
      throw error;
    }
  };
  
  // ENHANCED: Publish blog post with optional custom date (ADMIN BACKDATING FEATURE)
  export const publishBlogPost = async (id, customDate = null) => {
    try {
      const postRef = doc(db, BLOG_POSTS_COLLECTION, id);
      
      // Use custom date if provided (admin backdating), otherwise use current time
      const publishDate = customDate ? Timestamp.fromDate(customDate) : Timestamp.now();
      
      const updateData = {
        status: 'published',
        publishedAt: publishDate,
        updatedAt: Timestamp.now()
      };
      
      await updateDoc(postRef, updateData);
    } catch (error) {
      console.error("Error publishing blog post:", error);
      throw error;
    }
  };
  
  // Send published post back to draft (admin only)
  export const sendBackToDraft = async (id) => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser || getUserRole(currentUser.email) !== 'admin') {
        throw new Error('Only admin can send posts back to draft');
      }
  
      const postRef = doc(db, BLOG_POSTS_COLLECTION, id);
      
      const updateData = {
        status: 'draft',
        publishedAt: null,
        updatedAt: Timestamp.now()
      };
      
      await updateDoc(postRef, updateData);
    } catch (error) {
      console.error("Error sending post back to draft:", error);
      throw error;
    }
  };
  
  // Delete blog post
  export const deleteBlogPost = async (id) => {
    try {
      const postRef = doc(db, BLOG_POSTS_COLLECTION, id);
      await deleteDoc(postRef);
      return id;
    } catch (error) {
      console.error("Error deleting blog post:", error);
      throw error;
    }
  };
  
  // Upload image to Firebase Storage
  export const uploadImage = async (file) => {
    try {
      // Create unique filename
      const timestamp = Date.now();
      const fileName = `blog-images/${timestamp}-${file.name}`;
      const storageRef = ref(storage, fileName);
      
      // Upload file
      const snapshot = await uploadBytes(storageRef, file);
      
      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };