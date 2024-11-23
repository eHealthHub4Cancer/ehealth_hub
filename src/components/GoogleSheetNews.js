import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Calendar, User } from 'lucide-react';
import './News.css';

function GoogleSheetNews() {
  const navigate = useNavigate();
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortOrder, setSortOrder] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const parseCSVLine = (line) => {
    const result = [];
    let cell = '';
    let insideQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        result.push(cell.trim().replace(/^"|"$/g, ''));
        cell = '';
      } else {
        cell += char;
      }
    }
    result.push(cell.trim().replace(/^"|"$/g, ''));
    return result;
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const fetchNews = useCallback(async () => {
    try {
      const response = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vSTKMvqBJMCJPvUPIyk1M-l03Yyd57wmo_0pevGrZoHuRIS0qv0r5mwo4WK97gEQWVLXadmrCK5TXVK/pub?gid=0&single=true&output=csv');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      const rows = text.split('\n').map(parseCSVLine);
      
      const news = rows.slice(1).map(row => ({
        title: row[0] || '',
        excerpt: row[1] || '',
        date: row[2] || '',
        author: row[3] || '',
        categories: (row[4] || '').split(',').map(cat => cat.trim()).filter(Boolean),
        image: row[5] || '',
        slug: row[6] || generateSlug(row[0]), // Use provided slug or generate from title
      }));

      setNewsItems(news);
      setError(null);
    } catch (err) {
      console.error('Error fetching news:', err);
      setError(`Failed to load news data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const filteredNews = newsItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategories = selectedCategories.length === 0 || 
                            selectedCategories.some(cat => item.categories.includes(cat));
    return matchesSearch && matchesCategories;
  });

  const sortedNews = [...filteredNews].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedNews.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedNews.length / itemsPerPage);

  const allCategories = [...new Set(newsItems.flatMap(item => item.categories))].filter(Boolean).sort();

  if (loading) return <div className="news-container">Loading news...</div>;
  if (error) return (
    <div className="news-container">
      <h1>News from the eHealth-Hub for Cancer</h1>
      <div style={{ color: 'red', margin: '20px 0' }}>
        {error}
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
                  setSelectedCategories(prev =>
                    prev.includes(category)
                      ? prev.filter(c => c !== category)
                      : [...prev, category]
                  );
                  setCurrentPage(1);
                }}
              >
                {category} ({newsItems.filter(item => item.categories.includes(category)).length})
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="news-grid">
        {currentItems.map((item, index) => (
          <article
            key={index}
            className="news-card"
            onClick={() => navigate(`/news/${item.slug}`)}
          >
            <div className="news-image-container">
              <img src={item.image} alt={item.title} className="news-image" />
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
        ))}
      </div>

      {filteredNews.length === 0 && (
        <div className="no-results">
          <p>No news articles found matching your criteria.</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`pagination-button ${currentPage === i + 1 ? 'active' : ''}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default GoogleSheetNews;