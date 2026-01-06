/**
 * Google Sheets Service for LinkedIn Posts
 * 
 * Sheet Structure:
 * Column A: Order (1, 2, 3, 4, 5)
 * Column B: LinkedIn Iframe Code (complete iframe HTML)
 * Column C: Status (active/inactive)
 * Column D: Date Added (optional, for tracking)
 */

// Your Google Sheet Configuration
const SHEET_ID = '1PnIkuYmUhYaUxqwt-l7E9v2uBuK5F4JKbj9Hzc7zV1k';
const SHEET_NAME = 'linkedin post'; // Must match your sheet tab name exactly
const SHEET_GID = '365700154'; // The gid from your published URL

/**
 * Fetch LinkedIn posts from Google Sheets using CSV export
 * This is the most reliable method for published sheets
 * @param {number} maxPosts - Maximum number of posts to fetch (default: 5)
 * @returns {Promise<Array>} Array of LinkedIn post objects
 */
export const getLinkedInPostsFromSheet = async (maxPosts = 5) => {
  try {
    // Using the CSV export method - most reliable for published sheets
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${SHEET_GID}`;
    
    const response = await fetch(url);
    const csvText = await response.text();
    
    // Parse CSV
    const rows = csvText.split('\n');
    const posts = [];
    
    // Skip header row (index 0), process data rows
    for (let i = 1; i < rows.length && posts.length < maxPosts; i++) {
      const row = rows[i];
      
      // Skip empty rows
      if (!row.trim()) continue;
      
      // Parse CSV row (handling quoted fields with commas)
      const columns = parseCSVRow(row);
      
      if (columns.length < 3) continue; // Need at least Order, Iframe, Status
      
      const order = columns[0]?.trim() || i;
      const iframeCode = columns[1]?.trim() || '';
      const status = columns[2]?.trim().toLowerCase() || 'active';
      const dateAdded = columns[3]?.trim() || '';
      
      // Only include active posts with valid iframe code
      if (status === 'active' && iframeCode && iframeCode.includes('<iframe')) {
        posts.push({
          id: `linkedin-post-${order}`,
          order: parseInt(order) || i,
          iframeCode: iframeCode,
          status,
          dateAdded
        });
      }
    }
    
    // Sort by order
    posts.sort((a, b) => a.order - b.order);
    
    return posts.slice(0, maxPosts);
  } catch (error) {
    console.error('Error fetching LinkedIn posts from Google Sheets:', error);
    return []; // Return empty array on error to prevent breaking the page
  }
};

/**
 * Parse a CSV row handling quoted fields with commas
 * @param {string} row - CSV row string
 * @returns {Array<string>} Array of column values
 */
const parseCSVRow = (row) => {
  const columns = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    const nextChar = row[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // Column separator
      columns.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  // Add last column
  columns.push(current);
  
  return columns;
};

/**
 * Alternative method using JSON export (fallback)
 * @param {number} maxPosts - Maximum number of posts to fetch
 * @returns {Promise<Array>} Array of LinkedIn post objects
 */
export const getLinkedInPostsFromSheetJSON = async (maxPosts = 5) => {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&gid=${SHEET_GID}`;
    
    const response = await fetch(url);
    const text = await response.text();
    
    // Parse the response (Google returns JSONP, need to extract JSON)
    const jsonMatch = text.match(/google\.visualization\.Query\.setResponse\((.*)\);/);
    if (!jsonMatch) {
      throw new Error('Invalid response format');
    }
    
    const json = JSON.parse(jsonMatch[1]);
    const posts = [];
    const rows = json.table.rows;
    
    // Skip header row (index 0), process data rows
    for (let i = 1; i < rows.length && posts.length < maxPosts; i++) {
      const row = rows[i];
      
      // Check if row has data
      if (!row.c || !row.c[0] || !row.c[1]) continue;
      
      const order = row.c[0]?.v || i;
      const iframeCode = row.c[1]?.v || '';
      const status = (row.c[2]?.v || 'active').toLowerCase();
      const dateAdded = row.c[3]?.v || '';
      
      // Only include active posts with valid iframe code
      if (status === 'active' && iframeCode.trim() && iframeCode.includes('<iframe')) {
        posts.push({
          id: `linkedin-post-${order}`,
          order: parseInt(order) || i,
          iframeCode: iframeCode.trim(),
          status,
          dateAdded
        });
      }
    }
    
    // Sort by order
    posts.sort((a, b) => a.order - b.order);
    
    return posts.slice(0, maxPosts);
  } catch (error) {
    console.error('Error fetching LinkedIn posts from Google Sheets (JSON):', error);
    // Fallback to CSV method
    return getLinkedInPostsFromSheet(maxPosts);
  }
};

/**
 * Extract iframe src URL from iframe code
 * @param {string} iframeCode - Complete iframe HTML string
 * @returns {string} The src URL
 */
export const extractIframeSrc = (iframeCode) => {
  const srcMatch = iframeCode.match(/src=["']([^"']+)["']/);
  return srcMatch ? srcMatch[1] : '';
};

/**
 * Sanitize iframe code to ensure it's safe
 * @param {string} iframeCode - Complete iframe HTML string
 * @returns {string} Sanitized iframe code
 */
export const sanitizeIframeCode = (iframeCode) => {
  // Basic sanitization - ensure it's an iframe and from LinkedIn
  if (!iframeCode.includes('<iframe') || !iframeCode.includes('linkedin.com')) {
    return '';
  }
  return iframeCode.trim();
};