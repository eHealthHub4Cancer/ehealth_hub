// src/components/FirebaseNews.js
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Search, Filter } from 'lucide-react';
import { ClipLoader } from 'react-spinners';
import { getAllArticles, ARTICLE_TYPES } from '../services/newsService';
import './FirebaseNews.css';

// Debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const FirebaseNews = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortOrder, setSortOrder] = useState('newest');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const override = {
    display: "block",
    margin: "100px auto",
    borderColor: "#1a3e5a",
  };

  useEffect(() => {
    loadArticles();
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, selectedCategories, sortOrder]);

  const loadArticles = async () => {
    setLoading(true);
    try {
      const data = await getAllArticles(true); // Only published articles
      setArticles(data);
      setError(null);
    } catch (err) {
      console.error('Error loading articles:', err);
      setError('Failed to load articles. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = useCallback((newCategories) => {
    setSelectedCategories(newCategories);
  }, []);

  // Get all unique categories from articles
  const allCategories = useMemo(() => {
    return [...new Set(articles.flatMap(item => item.categories || []))].filter(Boolean).sort();
  }, [articles]);

  // Parse date string (handles formats like "30/04/2026", "April 30, 2026", "2026-04-30")
  const parseArticleDate = (dateStr) => {
    if (!dateStr) return new Date(0);

    // Try DD/MM/YYYY format
    const ddmmyyyy = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (ddmmyyyy) {
      return new Date(ddmmyyyy[3], ddmmyyyy[2] - 1, ddmmyyyy[1]);
    }

    // Try standard date parsing
    const parsed = new Date(dateStr);
    return isNaN(parsed.getTime()) ? new Date(0) : parsed;
  };

  // Filter and sort articles
  const filteredAndSortedArticles = useMemo(() => {
    const filtered = articles.filter(item => {
      const searchLower = debouncedSearchTerm.toLowerCase();
      const matchesSearch = !debouncedSearchTerm ||
        item.title?.toLowerCase().includes(searchLower) ||
        item.excerpt?.toLowerCase().includes(searchLower) ||
        item.author?.toLowerCase().includes(searchLower);

      const matchesCategories = selectedCategories.length === 0 ||
        selectedCategories.some(cat => (item.categories || []).includes(cat));

      return matchesSearch && matchesCategories;
    });

    return [...filtered].sort((a, b) => {
      // Use the date field (article's actual date), not createdAt (migration timestamp)
      const dateA = parseArticleDate(a.date);
      const dateB = parseArticleDate(b.date);
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, [articles, debouncedSearchTerm, selectedCategories, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedArticles.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = useMemo(() => {
    return filteredAndSortedArticles.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredAndSortedArticles, currentPage]);

  const getTypeLabel = (type) => {
    const found = ARTICLE_TYPES.find(t => t.value === type);
    return found ? found.label : type;
  };

  // News Card Component
  const NewsCard = ({ item }) => (
    <Link to={`/news-new/${item.slug}`} className="news-card">
      <div className="news-image">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.title} loading="lazy" />
        ) : (
          <div className="no-image">No Image</div>
        )}
        <span className={`type-badge ${item.type}`}>
          {getTypeLabel(item.type)}
        </span>
      </div>
      <div className="news-content">
        <div className="news-categories">
          {(item.categories || []).slice(0, 3).map(category => (
            <span key={category} className="category-label">{category}</span>
          ))}
        </div>
        <h3>{item.title}</h3>
        <p className="news-excerpt">{item.excerpt}</p>
        <div className="news-meta">
          {item.date && (
            <span className="meta-item">
              <Calendar size={14} />
              {item.date}
            </span>
          )}
          {item.author && (
            <span className="meta-item">
              <User size={14} />
              {item.author}
            </span>
          )}
        </div>
      </div>
    </Link>
  );

  // Skeleton loader
  const NewsCardSkeleton = () => (
    <div className="news-card skeleton">
      <div className="news-image skeleton-image"></div>
      <div className="news-content">
        <div className="skeleton-categories">
          <span></span>
          <span></span>
        </div>
        <div className="skeleton-title"></div>
        <div className="skeleton-excerpt"></div>
        <div className="skeleton-meta"></div>
      </div>
    </div>
  );

  if (error && articles.length === 0) {
    return (
      <div className="firebase-news-container">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={loadArticles} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="firebase-news-container">
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

        {allCategories.length > 0 && (
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
                  {category} ({articles.filter(item => (item.categories || []).includes(category)).length})
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

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
          {filteredAndSortedArticles.length === 0 && (
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
        <button className="refresh-button" onClick={loadArticles}>
          Refresh Content
        </button>
      </div>
    </div>
  );
};

export default FirebaseNews;
