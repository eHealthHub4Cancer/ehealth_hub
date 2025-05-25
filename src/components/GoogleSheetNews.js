import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Calendar, User } from 'lucide-react';
import { ClipLoader } from 'react-spinners';
import Papa from 'papaparse';
import './News.css';

// Constants
const CACHE_KEY = 'news_data_cache';
const CACHE_EXPIRY = 60 * 60 * 1000; // 1 hour in milliseconds
const GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSTKMvqBJMCJPvUPIyk1M-l03Yyd57wmo_0pevGrZoHuRIS0qv0r5mwo4WK97gEQWVLXadmrCK5TXVK/pub?gid=226797145&single=true&output=csv';

function GoogleSheetNews() {
  const navigate = useNavigate();
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortOrder, setSortOrder] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timerId);
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, selectedCategories, sortOrder]);

  const generateSlug = (title) => {
    return title
      ?.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || '';
  };

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);

      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        const { timestamp, data } = JSON.parse(cachedData);
        if (Date.now() - timestamp <= CACHE_EXPIRY) {
          setNewsItems(data);
          setLoading(false);
          return;
        }
      }

      const response = await fetch(GOOGLE_SHEET_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

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
      console.error('Error fetching news:', err);
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

  const handleFilterChange = useCallback((newCategories) => {
    setSelectedCategories(newCategories);
  }, []);

  const filteredAndSortedNews = useMemo(() => {
    const filtered = newsItems.filter(item => {
      const matchesSearch = !debouncedSearchTerm ||
        item.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        item.excerpt.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      const matchesCategories = selectedCategories.length === 0 || 
        selectedCategories.some(cat => item.categories.includes(cat));
      return matchesSearch && matchesCategories;
    });
    return [...filtered].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, [newsItems, debouncedSearchTerm, selectedCategories, sortOrder]);

  const currentItems = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredAndSortedNews.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredAndSortedNews, currentPage]);

  const allCategories = useMemo(() => {
    return [...new Set(newsItems.flatMap(item => item.categories))].filter(Boolean).sort();
  }, [newsItems]);

  const totalPages = Math.ceil(filteredAndSortedNews.length / itemsPerPage);

  const NewsCard = React.memo(({ item }) => (
    <article
      className="news-card"
      onClick={() => navigate(`/news/${item.slug}`)}
    >
      <div className="news-image-container">
        <img 
          src={item.image} 
          alt={item.title} 
          className="news-image"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/placeholder-image.jpg';
          }}
        />
        <div className="news-categories">
          {item.categories.map(category => (
            <span key={category} className="category-label">
              {category}
            </span>
          ))}
        </div>
      </div>
      <div className="news-content">
        <h2>{item.title}</h2>
        <p className="news-excerpt">{item.excerpt}</p>
        <div className="news-meta">
          <div className="meta-item">
            <Calendar size={16} />
            <span>{item.date}</span>
          </div>
          <div className="meta-item">
            <User size={16} />
            <span>{item.author}</span>
          </div>
        </div>
      </div>
    </article>
  ));

  const NewsCardSkeleton = () => (
    <div className="news-card skeleton">
      <div className="news-image-container skeleton-image"></div>
      <div className="news-content">
        <div className="skeleton-title"></div>
        <div className="skeleton-text"></div>
        <div className="skeleton-text"></div>
        <div className="news-meta">
          <div className="skeleton-meta"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="news-container">
      <div className="news-header">
        <h1>News from the eHealth-Hub for Cancer</h1>
        <div className="controls-section">
          <div className="search-bar">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search news..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="sort-control">
            <select 
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
        <div className="categories-filter">
          <div className="filter-header">
            <Filter size={20} />
            <span>Categories</span>
          </div>
          <div className="category-tags">
            {allCategories.map(category => (
              <button
                key={category}
                className={`category-tag ${selectedCategories.includes(category) ? 'active' : ''}`}
                onClick={() => {
                  handleFilterChange(
                    selectedCategories.includes(category)
                      ? selectedCategories.filter(c => c !== category)
                      : [...selectedCategories, category]
                  );
                }}
              >
                {category} ({newsItems.filter(item => item.categories.includes(category)).length})
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          {error}
          <button onClick={fetchNews}>Retry</button>
        </div>
      )}

      {loading ? (
        <div className="news-grid">
          {[...Array(itemsPerPage)].map((_, index) => (
            <NewsCardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <>
          <div className="news-grid">
            {currentItems.map((item, index) => (
              <NewsCard key={`${item.slug}-${index}`} item={item} />
            ))}
          </div>
          {filteredAndSortedNews.length === 0 && (
            <div className="no-results">
              <p>No news articles found matching your criteria.</p>
            </div>
          )}
        </>
      )}

      {!loading && totalPages > 1 && (
        <div className="pagination">
          <button 
            className="pagination-button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          >
            «
          </button>
          {Array.from(
            { length: Math.min(5, totalPages) },
            (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  className={`pagination-button ${currentPage === pageNum ? 'active' : ''}`}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            }
          )}
          <button 
            className="pagination-button"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          >
            »
          </button>
        </div>
      )}

      <div className="refresh-container">
        <button 
          className="refresh-button"
          onClick={() => {
            localStorage.removeItem(CACHE_KEY);
            fetchNews();
          }}
        >
          Refresh Content
        </button>
      </div>
    </div>
  );
}

export default React.memo(GoogleSheetNews);