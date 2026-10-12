// src/services/newsService.js
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
  Timestamp,
  where
} from 'firebase/firestore';
import { db, auth } from '../firebase';

// Constants
const NEWS_COLLECTION = 'news_articles';

// User roles - matching your existing system
const USER_ROLES = {
  'ehealth@ul.ie': 'admin',
  'user@ehealth.ie': 'user'
};

// Get user role
export const getUserRole = (email) => {
  return USER_ROLES[email] || 'user';
};

// Article types
export const ARTICLE_TYPES = [
  { value: 'research', label: 'Research' },
  { value: 'event', label: 'Event' },
  { value: 'job', label: 'Job Posting' },
  { value: 'conference', label: 'Conference' },
  { value: 'presentation', label: 'Presentation' }
];

// Fixed news categories - articles can only be tagged with these
export const NEWS_CATEGORIES = [
  'Research',
  'Health Data & Infrastructure',
  'Digital Health',
  'Precision & Personalised Medicine',
  'Policy',
  'Collaboration & Partnerships',
  'Patients & Communities',
  'Events & Talks',
  'Careers & Training'
];

// Maps old free-text tags (lowercased) onto the fixed categories.
// Tags not listed here (e.g. place names) are dropped.
const LEGACY_CATEGORY_MAP = {
  'research': 'Research',
  'cancer research': 'Research',
  'research impact': 'Research',
  'report': 'Research',

  'cancer data': 'Health Data & Infrastructure',
  'health data': 'Health Data & Infrastructure',
  'data': 'Health Data & Infrastructure',
  'data governance': 'Health Data & Infrastructure',
  'data infrastructure': 'Health Data & Infrastructure',
  'data science': 'Health Data & Infrastructure',
  'data standards': 'Health Data & Infrastructure',
  'ohdsi': 'Health Data & Infrastructure',
  'omop cdm': 'Health Data & Infrastructure',
  'ehds': 'Health Data & Infrastructure',
  'secondary use': 'Health Data & Infrastructure',
  'real world evidence': 'Health Data & Infrastructure',

  'digital health': 'Digital Health',
  'cancer digital health': 'Digital Health',
  'connected health': 'Digital Health',
  'dell technologies': 'Digital Health',
  'digicore': 'Digital Health',

  'genomics': 'Precision & Personalised Medicine',
  'cancer genomcis': 'Precision & Personalised Medicine',
  'cancer genomics': 'Precision & Personalised Medicine',
  'molecular oncology': 'Precision & Personalised Medicine',
  'precision medicine': 'Precision & Personalised Medicine',
  'precision oncology medicines': 'Precision & Personalised Medicine',
  'personalised cancer medicine': 'Precision & Personalised Medicine',
  'personalised oncology medicine': 'Precision & Personalised Medicine',
  'personalised prevention': 'Precision & Personalised Medicine',

  'policy': 'Policy',
  'cancer policy': 'Policy',
  'health policy': 'Policy',
  'digital health policy': 'Policy',
  'eu policy': 'Policy',
  "europe's beating cancer plan": 'Policy',
  'eu4health': 'Policy',

  'collaboration': 'Collaboration & Partnerships',
  'international collaboration': 'Collaboration & Partnerships',
  'european collaboration': 'Collaboration & Partnerships',
  'all island': 'Collaboration & Partnerships',
  'good friday': 'Collaboration & Partnerships',
  'nsrp': 'Collaboration & Partnerships',
  'hea': 'Collaboration & Partnerships',
  'ldcrc': 'Collaboration & Partnerships',
  'aicri': 'Collaboration & Partnerships',
  'jane 2': 'Collaboration & Partnerships',
  'ja pcm': 'Collaboration & Partnerships',
  'iarc': 'Collaboration & Partnerships',

  'patient advocacy': 'Patients & Communities',
  'public & patient involvement': 'Patients & Communities',
  'patient centered care': 'Patients & Communities',
  'cancer survivors': 'Patients & Communities',
  'cancer survivorship': 'Patients & Communities',
  'health inequalities': 'Patients & Communities',
  'gender': 'Patients & Communities',
  'blood cancer': 'Patients & Communities',
  'colorectal cancer': 'Patients & Communities',
  'early onset bowel cancer': 'Patients & Communities',

  'conference': 'Events & Talks',
  'talk': 'Events & Talks',
  'video': 'Events & Talks',
  'esmo': 'Events & Talks',
  'rte': 'Events & Talks',
  'call to action': 'Events & Talks',

  'phd': 'Careers & Training',
  'postdoc': 'Careers & Training',
  'hiring': 'Careers & Training',
  'training': 'Careers & Training',
  'research opportunity': 'Careers & Training'
};

// Convert any stored categories (old free-text or new fixed) to the fixed list
export const normalizeCategories = (categories) => {
  if (!Array.isArray(categories)) return [];
  const result = new Set();
  categories.forEach(cat => {
    if (typeof cat !== 'string') return;
    if (NEWS_CATEGORIES.includes(cat)) {
      result.add(cat);
      return;
    }
    const key = cat.trim().toLowerCase().replace(/-/g, ' ').replace(/\s+/g, ' ');
    if (LEGACY_CATEGORY_MAP[key]) result.add(LEGACY_CATEGORY_MAP[key]);
  });
  return NEWS_CATEGORIES.filter(c => result.has(c));
};

// ==================== NEWS ARTICLE OPERATIONS ====================

// Create a new article
export const createArticle = async (articleData) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    const firestoreData = {
      title: articleData.title || '',
      excerpt: articleData.excerpt || '',
      date: articleData.date || '',
      author: articleData.author || '',
      categories: articleData.categories || [],
      imageUrl: articleData.imageUrl || '',
      slug: articleData.slug || generateSlug(articleData.title),
      type: articleData.type || 'research',
      content: articleData.content || '',
      eventDetails: articleData.eventDetails || {},
      keyPoints: articleData.keyPoints || [],
      relatedLinks: articleData.relatedLinks || [],
      published: articleData.published || false,
      createdBy: currentUser.email,
      createdAt: Timestamp.now(),
      updatedBy: currentUser.email,
      updatedAt: Timestamp.now()
    };

    const docRef = await addDoc(collection(db, NEWS_COLLECTION), firestoreData);

    return {
      id: docRef.id,
      ...firestoreData
    };
  } catch (error) {
    console.error("Error creating article:", error);
    throw error;
  }
};

// Update an existing article
export const updateArticle = async (articleId, articleData) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    const articleRef = doc(db, NEWS_COLLECTION, articleId);

    const updateData = {
      title: articleData.title || '',
      excerpt: articleData.excerpt || '',
      date: articleData.date || '',
      author: articleData.author || '',
      categories: articleData.categories || [],
      imageUrl: articleData.imageUrl || '',
      slug: articleData.slug || '',
      type: articleData.type || 'research',
      content: articleData.content || '',
      eventDetails: articleData.eventDetails || {},
      keyPoints: articleData.keyPoints || [],
      relatedLinks: articleData.relatedLinks || [],
      published: articleData.published || false,
      updatedBy: currentUser.email,
      updatedAt: Timestamp.now()
    };

    await updateDoc(articleRef, updateData);

    return {
      id: articleId,
      ...updateData
    };
  } catch (error) {
    console.error("Error updating article:", error);
    throw error;
  }
};

// Get a single article by ID
export const getArticle = async (articleId) => {
  try {
    const articleRef = doc(db, NEWS_COLLECTION, articleId);
    const articleDoc = await getDoc(articleRef);

    if (!articleDoc.exists()) {
      return null;
    }

    const data = articleDoc.data();
    return {
      id: articleDoc.id,
      ...data,
      categories: normalizeCategories(data.categories),
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate()
    };
  } catch (error) {
    console.error("Error getting article:", error);
    throw error;
  }
};

// Get article by slug
export const getArticleBySlug = async (slug) => {
  try {
    const articlesQuery = query(
      collection(db, NEWS_COLLECTION),
      where('slug', '==', slug)
    );

    const snapshot = await getDocs(articlesQuery);

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    const data = doc.data();

    return {
      id: doc.id,
      ...data,
      categories: normalizeCategories(data.categories),
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate()
    };
  } catch (error) {
    console.error("Error getting article by slug:", error);
    throw error;
  }
};

// Get all articles (sorted by date descending)
export const getAllArticles = async (publishedOnly = false) => {
  try {
    // Simple query without composite index requirement
    const articlesQuery = query(
      collection(db, NEWS_COLLECTION),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(articlesQuery);

    let articles = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        categories: normalizeCategories(data.categories),
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate()
      };
    });

    // Filter in JavaScript if publishedOnly
    if (publishedOnly) {
      articles = articles.filter(article => article.published === true);
    }

    return articles;
  } catch (error) {
    console.error("Error getting all articles:", error);
    throw error;
  }
};

// Get articles by type
export const getArticlesByType = async (type, publishedOnly = false) => {
  try {
    let articlesQuery;

    if (publishedOnly) {
      articlesQuery = query(
        collection(db, NEWS_COLLECTION),
        where('type', '==', type),
        where('published', '==', true),
        orderBy('createdAt', 'desc')
      );
    } else {
      articlesQuery = query(
        collection(db, NEWS_COLLECTION),
        where('type', '==', type),
        orderBy('createdAt', 'desc')
      );
    }

    const snapshot = await getDocs(articlesQuery);

    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        categories: normalizeCategories(data.categories),
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate()
      };
    });
  } catch (error) {
    console.error("Error getting articles by type:", error);
    throw error;
  }
};

// Delete an article
export const deleteArticle = async (articleId) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser || getUserRole(currentUser.email) !== 'admin') {
      throw new Error('Only admin can delete articles');
    }

    const articleRef = doc(db, NEWS_COLLECTION, articleId);
    await deleteDoc(articleRef);

    return articleId;
  } catch (error) {
    console.error("Error deleting article:", error);
    throw error;
  }
};

// Toggle publish status
export const togglePublishStatus = async (articleId, published) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    const articleRef = doc(db, NEWS_COLLECTION, articleId);

    await updateDoc(articleRef, {
      published: published,
      updatedBy: currentUser.email,
      updatedAt: Timestamp.now()
    });

    return { id: articleId, published };
  } catch (error) {
    console.error("Error toggling publish status:", error);
    throw error;
  }
};

// ==================== UTILITY FUNCTIONS ====================

// Generate slug from title
export const generateSlug = (title) => {
  if (!title) return '';
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

// Validate article data
export const validateArticle = (articleData) => {
  const errors = [];

  if (!articleData.title?.trim()) {
    errors.push('Title is required');
  }

  if (!articleData.slug?.trim()) {
    errors.push('Slug is required');
  }

  if (!articleData.type) {
    errors.push('Article type is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Get event detail fields based on article type
export const getEventDetailFields = (type) => {
  switch (type) {
    case 'research':
      return [
        { key: 'Publication', label: 'Publication', placeholder: 'e.g., Nature Medicine' },
        { key: 'PublishDate', label: 'Publish Date', placeholder: 'e.g., January 2025' },
        { key: 'ImageCaption', label: 'Image Caption', placeholder: 'Photo credit or description' }
      ];
    case 'event':
      return [
        { key: 'EventTitle', label: 'Event Title', placeholder: 'Event name' },
        { key: 'Description', label: 'Description', placeholder: 'Brief description' },
        { key: 'ImageCaption', label: 'Image Caption', placeholder: 'Photo credit or description' }
      ];
    case 'job':
      return [
        { key: 'Institution', label: 'Institution', placeholder: 'e.g., University of Limerick' },
        { key: 'Location', label: 'Location', placeholder: 'e.g., Limerick, Ireland' },
        { key: 'ClosingDate', label: 'Closing Date', placeholder: 'e.g., March 31, 2025' },
        { key: 'PositionLevel', label: 'Position Level', placeholder: 'e.g., Postdoctoral Researcher' },
        { key: 'Department', label: 'Department', placeholder: 'e.g., School of Medicine' },
        { key: 'ContractType', label: 'Contract Type', placeholder: 'e.g., Full-time, 2 years' }
      ];
    case 'conference':
      return [
        { key: 'Location', label: 'Location', placeholder: 'e.g., Dublin, Ireland' },
        { key: 'Date', label: 'Date', placeholder: 'e.g., June 4-5, 2025' },
        { key: 'Type', label: 'Type', placeholder: 'e.g., International Symposium' },
        { key: 'ImageCaption', label: 'Image Caption', placeholder: 'Photo credit or description' }
      ];
    case 'presentation':
      return [
        { key: 'Speaker', label: 'Speaker', placeholder: 'Speaker name' },
        { key: 'Role', label: 'Role', placeholder: 'Speaker role/title' },
        { key: 'EventTitle', label: 'Event Title', placeholder: 'Event or program name' }
      ];
    default:
      return [];
  }
};
