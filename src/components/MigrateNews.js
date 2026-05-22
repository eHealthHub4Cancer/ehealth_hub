// src/components/MigrateNews.js
// One-time migration script to move news from Google Sheets to Firebase
import React, { useState } from 'react';
import { collection, addDoc, Timestamp, getDocs, query, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Papa from 'papaparse';
import './MigrateNews.css';

const GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSTKMvqBJMCJPvUPIyk1M-l03Yyd57wmo_0pevGrZoHuRIS0qv0r5mwo4WK97gEQWVLXadmrCK5TXVK/pub?gid=226797145&single=true&output=csv';
const NEWS_COLLECTION = 'news_articles';

const MigrateNews = () => {
  const [status, setStatus] = useState('idle'); // idle, fetching, parsing, uploading, done, error
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [logs, setLogs] = useState([]);
  const [previewData, setPreviewData] = useState([]);
  const [existingCount, setExistingCount] = useState(0);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { message, type, timestamp }]);
  };

  // Parse the pipe-separated eventDetails string into an object
  const parseEventDetails = (detailsString) => {
    if (!detailsString || !detailsString.trim()) return {};

    const result = {};
    const parts = detailsString.split('|');

    parts.forEach(part => {
      const colonIndex = part.indexOf(':');
      if (colonIndex > -1) {
        const key = part.substring(0, colonIndex).trim();
        const value = part.substring(colonIndex + 1).trim();
        if (key && value) {
          // Normalize key names (remove spaces, make camelCase-ish)
          const normalizedKey = key.replace(/\s+/g, '');
          result[normalizedKey] = value;
        }
      }
    });

    return result;
  };

  // Convert pipe formatting to HTML
  // ||| = paragraph break
  // || = double line break
  // |• = bullet point
  // | = line break
  const convertPipesToHTML = (text) => {
    if (!text || !text.trim()) return '';

    let html = text;

    // First, handle bullet points: |• or | •
    // Find sections with multiple bullets and wrap in <ul>
    html = html.replace(/\|•\s*/g, '|||BULLET|||');
    html = html.replace(/\|\s*•\s*/g, '|||BULLET|||');

    // Handle triple pipes (paragraph breaks)
    html = html.replace(/\|\|\|/g, '</p><p>');

    // Handle double pipes (section breaks)
    html = html.replace(/\|\|/g, '<br/><br/>');

    // Handle single pipes (line breaks) - but not our bullet markers
    html = html.replace(/\|(?!BULLET)/g, '<br/>');

    // Now convert bullet markers to list items
    if (html.includes('|||BULLET|||')) {
      // Split by bullet markers
      const parts = html.split('|||BULLET|||');
      const beforeBullets = parts[0];
      const bulletItems = parts.slice(1);

      if (bulletItems.length > 0) {
        const listItems = bulletItems.map(item => {
          // Clean up the item and wrap in li
          const cleanItem = item.replace(/<br\/?>/g, ' ').trim();
          return cleanItem ? `<li>${cleanItem}</li>` : '';
        }).filter(Boolean).join('');

        html = beforeBullets + '<ul>' + listItems + '</ul>';
      }
    }

    // Wrap in paragraph if not already
    if (!html.startsWith('<p>')) {
      html = '<p>' + html;
    }
    if (!html.endsWith('</p>')) {
      html = html + '</p>';
    }

    // Clean up empty paragraphs and extra whitespace
    html = html.replace(/<p>\s*<\/p>/g, '');
    html = html.replace(/<p>\s*<br\/?>\s*<\/p>/g, '');
    html = html.replace(/\s+/g, ' ').trim();

    return html;
  };

  // Clean excerpt - remove pipes and just clean text
  const cleanExcerpt = (text) => {
    if (!text || !text.trim()) return '';

    return text
      .replace(/\|\|\|/g, ' ')  // Triple pipe to space
      .replace(/\|\|/g, ' ')    // Double pipe to space
      .replace(/\|•/g, ' ')     // Bullet to space
      .replace(/\|/g, ' ')      // Single pipe to space
      .replace(/\s+/g, ' ')     // Multiple spaces to single
      .trim();
  };

  // Parse KeyPoints - pipe-separated list
  const parseKeyPoints = (keyPointsString) => {
    if (!keyPointsString || !keyPointsString.trim()) return [];

    return keyPointsString
      .split('|')
      .map(point => point.replace(/^[•\-\*]\s*/, '').trim()) // Remove bullet markers
      .filter(point => point.length > 0);
  };

  // Parse RelatedLinks - format: "Title:URL|Title2:URL2" or "Title|URL|Title2|URL2"
  const parseRelatedLinks = (linksString) => {
    if (!linksString || !linksString.trim()) return [];

    const links = [];
    const parts = linksString.split('|').map(p => p.trim()).filter(Boolean);

    // Check if format is "Title:URL|Title:URL"
    if (parts.some(p => p.includes(':'))) {
      parts.forEach(part => {
        const colonIndex = part.indexOf(':');
        if (colonIndex > -1) {
          const title = part.substring(0, colonIndex).trim();
          let url = part.substring(colonIndex + 1).trim();

          // Handle case where URL has : in it (like https:)
          if (url.startsWith('//')) {
            url = 'https:' + url;
          } else if (!url.startsWith('http')) {
            // Check if the rest of parts form a URL
            const fullPart = part;
            const httpIndex = fullPart.indexOf('http');
            if (httpIndex > -1) {
              const titlePart = fullPart.substring(0, httpIndex).replace(/:$/, '').trim();
              const urlPart = fullPart.substring(httpIndex).trim();
              if (titlePart && urlPart) {
                links.push({ title: titlePart, url: urlPart });
                return;
              }
            }
          }

          if (title && url) {
            links.push({ title, url });
          }
        }
      });
    } else {
      // Format might be alternating: Title|URL|Title|URL
      for (let i = 0; i < parts.length - 1; i += 2) {
        const title = parts[i];
        const url = parts[i + 1];
        if (title && url && (url.startsWith('http') || url.startsWith('www'))) {
          links.push({
            title,
            url: url.startsWith('www') ? 'https://' + url : url
          });
        }
      }
    }

    return links;
  };

  // Parse AdditionalResources - same format as RelatedLinks
  const parseAdditionalResources = (resourcesString) => {
    return parseRelatedLinks(resourcesString);
  };

  // Parse categories from string to array (handles both comma and pipe separators)
  const parseCategories = (categoriesString) => {
    if (!categoriesString || !categoriesString.trim()) return [];

    // Check if it uses pipes or commas as separator
    let separator = ',';
    if (categoriesString.includes('|')) {
      separator = '|';
    }

    return categoriesString
      .split(separator)
      .map(cat => cat.trim().toUpperCase()) // Normalize to uppercase
      .filter(Boolean)
      .filter(cat => cat.length > 0 && cat !== '|'); // Remove empty and stray pipes
  };

  // Generate slug from title
  const generateSlug = (title) => {
    if (!title) return '';
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  // Determine article type based on content/categories
  const determineType = (row) => {
    const title = (row[0] || '').toLowerCase();
    const excerpt = (row[1] || '').toLowerCase();
    const categories = (row[4] || '').toLowerCase();

    if (title.includes('phd') || title.includes('postdoc') || title.includes('position') ||
        title.includes('opportunity') || title.includes('job') || title.includes('vacancy')) {
      return 'job';
    }
    if (title.includes('conference') || title.includes('symposium') || title.includes('summit')) {
      return 'conference';
    }
    if (title.includes('presentation') || title.includes('talk') || title.includes('seminar')) {
      return 'presentation';
    }
    if (title.includes('event') || title.includes('workshop') || title.includes('meeting')) {
      return 'event';
    }
    return 'research'; // default
  };

  // Transform a row from Google Sheets to Firestore format
  const transformRow = (row, index) => {
    // Google Sheets columns:
    // 0: Title, 1: Excerpt, 2: Date, 3: Author, 4: Categories,
    // 5: Image URL, 6: Slug, 7: Type, 8: Content, 9: EventDetails,
    // 10: KeyPoints, 11: RelatedLinks, 12: AdditionalResources

    const title = row[0] || '';
    const slug = row[6] || generateSlug(title);
    const type = row[7] || determineType(row);
    const rawContent = (row[8] || '').trim();
    const rawExcerpt = (row[1] || '').trim();

    // Parse key points and links
    const keyPoints = parseKeyPoints(row[10]);
    const relatedLinks = parseRelatedLinks(row[11]);
    const additionalResources = parseAdditionalResources(row[12]);

    // Combine related links and additional resources
    const allLinks = [...relatedLinks, ...additionalResources];

    return {
      title: title.trim(),
      excerpt: cleanExcerpt(rawExcerpt), // Clean pipes from excerpt
      date: (row[2] || '').trim(),
      author: (row[3] || '').trim(),
      categories: parseCategories(row[4]),
      imageUrl: (row[5] || '').trim(),
      slug: slug.trim(),
      type: type.trim().toLowerCase(),
      content: convertPipesToHTML(rawContent), // Convert pipes to HTML in content
      eventDetails: parseEventDetails(row[9]),
      keyPoints: keyPoints,
      relatedLinks: allLinks,
      published: true, // All existing articles should be published
      createdBy: 'migration@ehealth.ie',
      createdAt: Timestamp.now(),
      updatedBy: 'migration@ehealth.ie',
      updatedAt: Timestamp.now(),
      originalIndex: index // For tracking
    };
  };

  // Check existing articles and get their slugs
  const [existingSlugs, setExistingSlugs] = useState([]);

  const checkExisting = async () => {
    try {
      const snapshot = await getDocs(query(collection(db, NEWS_COLLECTION)));
      const slugs = snapshot.docs.map(doc => doc.data().slug).filter(Boolean);
      setExistingSlugs(slugs);
      setExistingCount(snapshot.size);
      return { count: snapshot.size, slugs };
    } catch (error) {
      addLog(`Error checking existing articles: ${error.message}`, 'error');
      return { count: 0, slugs: [] };
    }
  };

  // Fetch and preview data without uploading
  const fetchAndPreview = async () => {
    setStatus('fetching');
    setLogs([]);
    addLog('Fetching data from Google Sheets...');

    try {
      // Check existing
      const { count, slugs } = await checkExisting();
      addLog(`Found ${count} existing articles in Firebase`, 'info');
      if (slugs.length > 0) {
        addLog(`Existing slugs will be skipped: ${slugs.slice(0, 5).join(', ')}${slugs.length > 5 ? '...' : ''}`, 'info');
      }

      // Fetch from Google Sheets
      const response = await fetch(GOOGLE_SHEET_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      addLog('Data fetched successfully, parsing CSV...');
      setStatus('parsing');

      Papa.parse(text, {
        header: false,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.data && results.data.length > 1) {
            // Skip header row
            const dataRows = results.data.slice(1);
            addLog(`Found ${dataRows.length} articles in Google Sheets`);

            // Transform all rows
            const transformedData = dataRows.map((row, index) => transformRow(row, index));

            setPreviewData(transformedData);
            setProgress({ current: 0, total: transformedData.length });
            setStatus('idle');
            addLog('Preview ready! Review the data below before uploading.', 'success');
          } else {
            throw new Error('No data found in spreadsheet');
          }
        },
        error: (err) => {
          throw new Error(`CSV parsing error: ${err.message}`);
        }
      });
    } catch (error) {
      addLog(`Error: ${error.message}`, 'error');
      setStatus('error');
    }
  };

  // Upload all data to Firebase
  const uploadToFirebase = async () => {
    if (previewData.length === 0) {
      addLog('No data to upload. Fetch preview first.', 'error');
      return;
    }

    // Re-check existing slugs before upload
    const { slugs: currentSlugs } = await checkExisting();

    setStatus('uploading');
    addLog(`Starting upload of ${previewData.length} articles (skipping duplicates)...`);

    let successCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (let i = 0; i < previewData.length; i++) {
      const article = previewData[i];

      // Check if slug already exists
      if (currentSlugs.includes(article.slug)) {
        skippedCount++;
        addLog(`Skipped (already exists): "${article.title.substring(0, 40)}..."`, 'warning');
        setProgress({ current: i + 1, total: previewData.length });
        continue;
      }

      try {
        // Remove the originalIndex before saving
        const { originalIndex, ...articleData } = article;

        await addDoc(collection(db, NEWS_COLLECTION), articleData);
        successCount++;

        // Add to currentSlugs to prevent duplicates within same batch
        currentSlugs.push(article.slug);

        setProgress({ current: i + 1, total: previewData.length });

        if ((i + 1) % 5 === 0 || i === previewData.length - 1) {
          addLog(`Uploaded ${i + 1}/${previewData.length}: "${article.title.substring(0, 40)}..."`, 'success');
        }
      } catch (error) {
        errorCount++;
        addLog(`Failed to upload "${article.title}": ${error.message}`, 'error');
      }
    }

    setStatus('done');
    addLog(`Migration complete! ${successCount} uploaded, ${skippedCount} skipped (duplicates), ${errorCount} errors.`,
      errorCount > 0 ? 'warning' : 'success');
  };

  // Clean up existing articles - fix all pipe formatting
  const cleanupCategories = async () => {
    setStatus('uploading');
    setLogs([]);
    addLog('Cleaning up ALL pipe formatting in existing articles...');
    addLog('This will fix: categories, content, excerpts, keyPoints, and relatedLinks');

    try {
      const snapshot = await getDocs(query(collection(db, NEWS_COLLECTION)));
      const articles = snapshot.docs;

      addLog(`Found ${articles.length} articles to process`);

      let fixedCount = 0;

      for (let i = 0; i < articles.length; i++) {
        const articleDoc = articles[i];
        const data = articleDoc.data();

        const updates = {};
        let hasChanges = false;
        const whatFixed = [];

        // Fix categories
        const categories = data.categories || [];
        const hasPipeInCategories = categories.some(cat => typeof cat === 'string' && cat.includes('|'));
        if (hasPipeInCategories) {
          const cleanedCategories = categories
            .flatMap(cat => cat.split('|'))
            .map(cat => cat.trim().toUpperCase())
            .filter(cat => cat.length > 0);
          updates.categories = [...new Set(cleanedCategories)];
          hasChanges = true;
          whatFixed.push('categories');
        }

        // Fix content - convert pipes to HTML
        const content = data.content || '';
        if (content.includes('|')) {
          updates.content = convertPipesToHTML(content);
          hasChanges = true;
          whatFixed.push('content');
        }

        // Fix excerpt - clean pipes
        const excerpt = data.excerpt || '';
        if (excerpt.includes('|')) {
          updates.excerpt = cleanExcerpt(excerpt);
          hasChanges = true;
          whatFixed.push('excerpt');
        }

        // Fix keyPoints if it's a string with pipes (should be array)
        const keyPoints = data.keyPoints;
        if (typeof keyPoints === 'string' && keyPoints.includes('|')) {
          updates.keyPoints = parseKeyPoints(keyPoints);
          hasChanges = true;
          whatFixed.push('keyPoints');
        } else if (Array.isArray(keyPoints) && keyPoints.some(kp => kp.includes('|'))) {
          // keyPoints is array but items have pipes
          updates.keyPoints = keyPoints
            .flatMap(kp => kp.split('|'))
            .map(kp => kp.replace(/^[•\-\*]\s*/, '').trim())
            .filter(kp => kp.length > 0);
          hasChanges = true;
          whatFixed.push('keyPoints');
        }

        // Fix relatedLinks if it's a string with pipes (should be array of objects)
        const relatedLinks = data.relatedLinks;
        if (typeof relatedLinks === 'string' && relatedLinks.includes('|')) {
          updates.relatedLinks = parseRelatedLinks(relatedLinks);
          hasChanges = true;
          whatFixed.push('relatedLinks');
        }

        if (hasChanges) {
          updates.updatedAt = Timestamp.now();
          await updateDoc(doc(db, NEWS_COLLECTION, articleDoc.id), updates);
          fixedCount++;
          addLog(`Fixed "${data.title?.substring(0, 35)}..." - ${whatFixed.join(', ')}`, 'success');
        }

        setProgress({ current: i + 1, total: articles.length });
      }

      setStatus('done');
      addLog(`Cleanup complete! ${fixedCount} articles fixed, ${articles.length - fixedCount} already clean.`, 'success');
    } catch (error) {
      addLog(`Error during cleanup: ${error.message}`, 'error');
      setStatus('error');
    }
  };

  const clearLogs = () => {
    setLogs([]);
    setPreviewData([]);
    setStatus('idle');
    setProgress({ current: 0, total: 0 });
  };

  return (
    <div className="migrate-container">
      <div className="migrate-header">
        <h1>News Migration Tool</h1>
        <p>Migrate news articles from Google Sheets to Firebase Firestore</p>
      </div>

      <div className="migrate-warning">
        <strong>Warning:</strong> This tool will copy all articles from Google Sheets to Firebase.
        Make sure you only run this once to avoid duplicates.
        {existingCount > 0 && (
          <span className="existing-count"> Currently {existingCount} articles exist in Firebase.</span>
        )}
      </div>

      <div className="migrate-actions">
        <button
          onClick={fetchAndPreview}
          disabled={status === 'fetching' || status === 'parsing' || status === 'uploading'}
          className="btn-preview"
        >
          {status === 'fetching' || status === 'parsing' ? 'Loading...' : '1. Fetch & Preview Data'}
        </button>

        <button
          onClick={uploadToFirebase}
          disabled={previewData.length === 0 || status === 'uploading' || status === 'done'}
          className="btn-upload"
        >
          {status === 'uploading' ? `Uploading ${progress.current}/${progress.total}...` : '2. Upload to Firebase'}
        </button>

        <button
          onClick={cleanupCategories}
          disabled={status === 'uploading'}
          className="btn-cleanup"
        >
          {status === 'uploading' ? 'Cleaning...' : '3. Fix All Pipes (Categories, Content, Excerpts)'}
        </button>

        <button onClick={clearLogs} className="btn-clear">
          Clear & Reset
        </button>
      </div>

      {progress.total > 0 && (
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${(progress.current / progress.total) * 100}%` }}
          />
          <span className="progress-text">{progress.current} / {progress.total}</span>
        </div>
      )}

      <div className="logs-container">
        <h3>Logs</h3>
        <div className="logs">
          {logs.length === 0 ? (
            <p className="log-empty">No logs yet. Click "Fetch & Preview Data" to start.</p>
          ) : (
            logs.map((log, index) => (
              <div key={index} className={`log-entry log-${log.type}`}>
                <span className="log-time">[{log.timestamp}]</span>
                <span className="log-message">{log.message}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {previewData.length > 0 && (
        <div className="preview-container">
          <h3>
            Preview Data ({previewData.length} articles)
            {existingSlugs.length > 0 && (
              <span className="preview-summary">
                {' '}- {previewData.filter(a => !existingSlugs.includes(a.slug)).length} new,
                {' '}{previewData.filter(a => existingSlugs.includes(a.slug)).length} will be skipped
              </span>
            )}
          </h3>
          <div className="preview-table-wrapper">
            <table className="preview-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Status</th>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Categories</th>
                  <th>Date</th>
                  <th>Key Points</th>
                  <th>Links</th>
                  <th>Image</th>
                </tr>
              </thead>
              <tbody>
                {previewData.map((article, index) => {
                  const isDuplicate = existingSlugs.includes(article.slug);
                  return (
                    <tr key={index} className={isDuplicate ? 'row-duplicate' : ''}>
                      <td>{index + 1}</td>
                      <td>
                        {isDuplicate ? (
                          <span className="status-badge skip">Skip</span>
                        ) : (
                          <span className="status-badge new">New</span>
                        )}
                      </td>
                      <td className="title-cell">{article.title}</td>
                      <td><span className={`type-badge ${article.type}`}>{article.type}</span></td>
                      <td className="details-cell">{article.categories.join(', ') || '-'}</td>
                      <td>{article.date || '-'}</td>
                      <td className="details-cell">
                        {article.keyPoints.length > 0
                          ? `${article.keyPoints.length} points`
                          : '-'}
                      </td>
                      <td className="details-cell">
                        {article.relatedLinks.length > 0
                          ? `${article.relatedLinks.length} links`
                          : '-'}
                      </td>
                      <td>{article.imageUrl ? 'Yes' : 'No'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MigrateNews;
