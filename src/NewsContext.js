import React, { createContext, useState, useEffect, useCallback } from 'react';
import Papa from 'papaparse';

const NewsContext = createContext();
const GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSTKMvqBJMCJPvUPIyk1M-l03Yyd57wmo_0pevGrZoHuRIS0qv0r5mwo4WK97gEQWVLXadmrCK5TXVK/pub?gid=226797145&single=true&output=csv';
const CACHE_KEY = 'news_data_cache';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000;

export function NewsProvider({ children }) {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const parsePipedContent = (content) => {
    if (!content) return [];
    return content.split('|').map(text => ({
      text: text.trim(),
      spacing: text.includes('large') ? 'large' : ''
    })).filter(item => item.text);
  };

  const parseDetails = (details) => {
    if (!details) return {};
    return details.split('|').reduce((acc, item) => {
      const [key, value] = item.split(':').map(s => s.trim());
      if (key && value) acc[key] = { value };
      return acc;
    }, {});
  };

  const parseLinks = (links) => {
    if (!links) return [];
    return links.split('|').map(link => {
      const [title, url] = link.split(':').map(s => s.trim());
      return { title: title || 'Link', url: url || '#' };
    }).filter(link => link.url && link.url !== '#');
  };

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        const { timestamp, data } = JSON.parse(cachedData);
        if (Date.now() - timestamp < CACHE_EXPIRY) {
          setNewsItems(data);
          setLoading(false);
          return;
        }
      }

      const response = await fetch(GOOGLE_SHEET_URL);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const text = await response.text();
      Papa.parse(text, {
        header: false,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.data && results.data.length > 1) {
            const news = results.data.slice(1).map(row => ({
              title: row[0] || '',
              excerpt: row[1] || '',
              date: row[2] || '',
              author: row[3] || '',
              categories: (row[4] || '').split(',').map(cat => cat.trim()).filter(Boolean),
              image: row[5] || '',
              slug: row[6] || generateSlug(row[0]),
              type: row[7] || 'research',
              content: parsePipedContent(row[8] || ''),
              eventDetails: parseDetails(row[9] || ''),
              keyPoints: parsePipedContent(row[10] || ''),
              relatedLinks: parseLinks(row[11] || ''),
              additionalResources: parseDetails(row[12] || '')
            }));

            localStorage.setItem(CACHE_KEY, JSON.stringify({
              timestamp: Date.now(),
              data: news
            }));

            setNewsItems(news);
            setError(null);
          } else {
            throw new Error('No data found in the spreadsheet');
          }
        },
        error: (err) => {
          throw new Error(`CSV parsing error: ${err.message}`);
        }
      });
    } catch (err) {
      console.error('Fetch error:', err);
      setError(`Failed to load news data: ${err.message}`);
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        const { data } = JSON.parse(cachedData);
        setNewsItems(data);
        setError(`Using cached data. ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  return (
    <NewsContext.Provider value={{ newsItems, loading, error, fetchNews }}>
      {children}
    </NewsContext.Provider>
  );
}

export const useNews = () => React.useContext(NewsContext);
