// src/services/researchOutputsService.js
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  writeBatch,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import PublicationsData from '../components/PublicationsData';
import ReportsData from '../components/ReportsData';
import OtherOutputsData from '../components/OtherOutputsData';

// Constants
export const RESEARCH_OUTPUTS_COLLECTION = 'research_outputs';

// Output types - one record per output, the type decides which fields are used
export const OUTPUT_TYPES = [
  { value: 'publication', label: 'Publication', plural: 'Publications' },
  { value: 'report', label: 'Report', plural: 'Reports' },
  { value: 'poster', label: 'Poster', plural: 'Posters' },
  { value: 'presentation', label: 'Presentation', plural: 'Presentations' }
];

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const FULL_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
  'August', 'September', 'October', 'November', 'December'];

// Find a month (1-12) in free text such as "(Jan. 2026)" or "May 2025"
const parseMonth = (text) => {
  const match = (text || '').match(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+(?:\d{1,2},?\s+)?(?:19|20)\d{2}\b/);
  return match ? MONTHS.indexOf(match[1]) + 1 : null;
};

const parseYear = (text) => (text || '').match(/\b(?:19|20)\d{2}\b/)?.[0] || '';

// Display date for reports, posters and presentations, e.g. "May 2025"
export const formatOutputDate = (output) => {
  if (!output.year) return '';
  return output.month ? `${FULL_MONTHS[output.month - 1]} ${output.year}` : String(output.year);
};

// Accept a pasted DOI link as well as a bare DOI
export const cleanDoi = (value) => (value || '').trim().replace(/^https?:\/\/(dx\.)?doi\.org\//i, '').replace(/^doi:\s*/i, '');

// Accept a pasted PubMed link as well as a bare PMID
export const cleanPmid = (value) => (value || '').trim().match(/\d+/)?.[0] || '';

// Split an old-style citation (Authors. "Title". Eng. In: Journal (Mon. Year).) into parts
const splitCitation = (citation) => {
  const titleStart = citation.indexOf('"');
  const titleEnd = titleStart >= 0 ? citation.indexOf('"', titleStart + 1) : -1;
  if (titleEnd < 0) return { citation };
  return {
    authors: citation.slice(0, titleStart).trim().replace(/\.$/, ''),
    title: citation.slice(titleStart + 1, titleEnd).trim().replace(/\.$/, ''),
    source: citation.slice(titleEnd + 1).replace(/^\.?\s*/, '').replace(/^Eng\.\s*/, '').replace(/^In:\s*/, '').trim()
  };
};

// Newest first: year, then month (undated last), then original position
export const sortOutputs = (outputs) => [...outputs].sort((a, b) =>
  (Number(b.year) || 0) - (Number(a.year) || 0) ||
  (b.month || 0) - (a.month || 0) ||
  (a.order || 0) - (b.order || 0)
);

// Convert the static data files into research_outputs records.
// Used for the one-time import and as a fallback while the collection is empty.
export const getStaticOutputs = () => {
  const outputs = [];

  Object.entries(PublicationsData).forEach(([year, publications]) => {
    publications.forEach((pub, index) => {
      outputs.push({
        id: `static-publication-${year}-${pub.id}`,
        type: 'publication',
        year: String(year),
        month: parseMonth(pub.citation),
        ...splitCitation(pub.citation),
        doi: pub.doi || '',
        pmid: pub.pmid || '',
        link: pub.link || '',
        pdfUrl: pub.pdfUrl || '',
        order: index,
        published: true
      });
    });
  });

  ReportsData.forEach((report, index) => {
    outputs.push({
      id: `static-report-${report.id}`,
      type: 'report',
      year: parseYear(report.date),
      month: parseMonth(report.date),
      title: report.title,
      authors: report.authors || '',
      description: report.description || '',
      imageUrl: report.imageUrl || '',
      imageCaption: report.imageCaption || '',
      pdfUrl: report.pdfUrl || '',
      order: index,
      published: true
    });
  });

  [['posters', 'poster'], ['presentations', 'presentation']].forEach(([key, type]) => {
    (OtherOutputsData[key] || []).forEach((item, index) => {
      outputs.push({
        id: `static-${type}-${item.id}`,
        type,
        year: String(item.year || parseYear(item.date)),
        month: parseMonth(item.date),
        title: item.title,
        authors: item.authors || '',
        description: item.description || '',
        url: item.url || '',
        pdfUrl: item.pdfUrl || '',
        order: index,
        published: true
      });
    });
  });

  return outputs;
};

// Get all outputs from Firestore
export const getAllOutputs = async (publishedOnly = false) => {
  const snapshot = await getDocs(collection(db, RESEARCH_OUTPUTS_COLLECTION));
  let outputs = snapshot.docs.map(docSnap => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate()
    };
  });
  if (publishedOnly) {
    outputs = outputs.filter(output => output.published === true);
  }
  return sortOutputs(outputs);
};

// Outputs for the public page: Firestore if it has any, otherwise the static files
export const getPublicOutputs = async () => {
  try {
    const outputs = await getAllOutputs(true);
    if (outputs.length > 0) return outputs;
  } catch (error) {
    console.error('Error loading research outputs, using static data:', error);
  }
  return sortOutputs(getStaticOutputs());
};

// Keep only the fields that belong to the output's type
const toFirestoreData = (outputData) => {
  const common = {
    type: outputData.type,
    year: String(outputData.year || '').trim(),
    month: outputData.month ? Number(outputData.month) : null,
    published: outputData.published !== false,
    order: Number(outputData.order) || 0
  };
  if (outputData.type === 'publication') {
    return {
      ...common,
      authors: (outputData.authors || '').trim(),
      title: (outputData.title || '').trim(),
      source: (outputData.source || '').trim(),
      ...(outputData.citation ? { citation: outputData.citation } : {}),
      doi: cleanDoi(outputData.doi),
      pmid: cleanPmid(outputData.pmid),
      link: (outputData.link || '').trim(),
      pdfUrl: (outputData.pdfUrl || '').trim()
    };
  }
  return {
    ...common,
    title: (outputData.title || '').trim(),
    authors: (outputData.authors || '').trim(),
    description: (outputData.description || '').trim(),
    imageUrl: (outputData.imageUrl || '').trim(),
    imageCaption: (outputData.imageCaption || '').trim(),
    url: (outputData.url || '').trim(),
    pdfUrl: (outputData.pdfUrl || '').trim()
  };
};

export const createOutput = async (outputData) => {
  const docRef = await addDoc(collection(db, RESEARCH_OUTPUTS_COLLECTION), {
    ...toFirestoreData(outputData),
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });
  return docRef.id;
};

export const updateOutput = async (outputId, outputData) => {
  await updateDoc(doc(db, RESEARCH_OUTPUTS_COLLECTION, outputId), {
    ...toFirestoreData(outputData),
    updatedAt: Timestamp.now()
  });
};

export const deleteOutput = async (outputId) => {
  await deleteDoc(doc(db, RESEARCH_OUTPUTS_COLLECTION, outputId));
};

export const toggleOutputPublished = async (outputId, published) => {
  await updateDoc(doc(db, RESEARCH_OUTPUTS_COLLECTION, outputId), {
    published,
    updatedAt: Timestamp.now()
  });
};

// One-time import of the static data files (batched, max 500 writes per batch)
export const importStaticOutputs = async () => {
  const outputs = getStaticOutputs();
  for (let i = 0; i < outputs.length; i += 400) {
    const batch = writeBatch(db);
    outputs.slice(i, i + 400).forEach(({ id, ...output }) => {
      batch.set(doc(collection(db, RESEARCH_OUTPUTS_COLLECTION)), {
        ...toFirestoreData(output),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
    });
    await batch.commit();
  }
  return outputs.length;
};

// Validate before saving
export const validateOutput = (outputData) => {
  const errors = [];
  if (!outputData.title?.trim() && !outputData.citation) errors.push('Title is required');
  if (!/^(19|20)\d{2}$/.test(String(outputData.year || '').trim())) errors.push('Year must be a 4-digit year, e.g. 2026');
  if (outputData.type === 'publication' && !outputData.authors?.trim() && !outputData.citation) errors.push('Authors are required');
  if (outputData.type === 'publication' && !outputData.source?.trim() && !outputData.citation) errors.push('Journal / source is required');
  if (outputData.type === 'report' && !outputData.pdfUrl?.trim()) errors.push('Report PDF link is required');
  return errors;
};
