import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Calendar, User } from 'lucide-react';
import './News.css';

function News() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortOrder, setSortOrder] = useState('newest');

  const newsItems = [
    {
      id: 1,
      title: "All-Island study highlights the cancer legacy of the Good Friday Agreement",
      image: require('../Images/News/2023_Belfast Photo 1.jpeg'),
      date: "OCT 24, 2023",
      author: "AEDIN CULHANE",
      categories: ["BELFAST", "GOOD FRIDAY", "CANCER RESEARCH", "ALL ISLAND"],
      excerpt: "New all-island research led by Queen's University Belfast highlights the health and economic impact of the Good Friday Agreement on cancer across the island of Ireland in...",
      route: "/news/good-friday-cancer-legacy"
    },
    {
      id: 2,
      title: "New study highlights significant gender inequality and bias in cancer research",
      image: require('../Images/News/IrishNews_gender.jpg'),
      date: "OCT 11, 2023",
      author: "AEDIN CULHANE",
      categories: ["CANCER RESEARCH", "GENDER"],
      excerpt: "A new study, the first of its kind, highlights the extent of gender inequality and gender bias against senior female academics working in cancer research in Europe.",
      route: "/news/gender-inequality-study"
    },
    {
      id: 3,
      title: "PhD Advert",
      image: require('../Images/News/Computer_Stockphoto.PNG'),
      date: "MAY 12, 2023",
      author: "AEDIN CULHANE",
      categories: ["PHD", "RESEARCH OPPORTUNITY"],
      excerpt: "Interested in a Fully-Funded PhD?",
      route: "/news/phd-opportunity"
    },
    {
      id: 4,
      title: "Belfast Agreement 25 Cancer Showcase",
      image: require('../Images/News/2023_Belfast Photo 1.jpeg'),
      date: "MAY 8, 2023",
      author: "AEDIN CULHANE",
      categories: ["BELFAST", "GOOD FRIDAY", "CONFERENCE"],
      excerpt: "Belfast Agreement 25 Cancer Showcase discusses need for greater cross-border collaboration on cancer research",
      route: "/news/belfast-agreement-showcase"
    },
    {
      id: 5,
      title: "LDCRC Building Together Event",
      image: require('../Images/News/LDCRC_BuildingTogether_April_2023.jpeg'),
      date: "APR 25, 2023",
      author: "AEDIN CULHANE",
      categories: ["LDCRC", "CONNECTED HEALTH", "TALK"],
      excerpt: "LDCRC Building Together Event led by Prof Aedin Culhane and Ruth Clifford",
      route: "/news/ldcrc-building-together"
    },
    {
      id: 6,
      title: "Prof Mark Lawler and DELL Technologies",
      image: require('../Images/News/DELL.PNG'),
      date: "APR 20, 2023",
      author: "AEDIN CULHANE",
      categories: ["DELL TECHNOLOGIES", "CONNECTED HEALTH", "TALK"],
      excerpt: "Presentation by Prof Mark Lawler on Connected Health for the Digital Futures in Healthcare program with DELL Technologies.",
      route: "/news/dell-technologies-presentation"
    },
    {
      id: 7,
      title: "HRB National Conference 2022",
      image: require('../Images/News/2022_HRB_Conference.png'),
      date: "NOV 30, 2022",
      author: "AEDIN CULHANE",
      categories: ["CONFERENCE", "DUBLIN", "VIDEO"],
      excerpt: "Prof Culhane invited to chair and participate in panel discussion at the National HRB Conference 'Personalised Medicine in Ireland'",
      route: "/news/hrb-conference"
    },
    {
      id: 8,
      title: "eHealth-Hub at the OHDSI 2022 meeting",
      image: require('../Images/News/2022_OHDSI_meeting_WashingtonDC.jpg'),
      date: "OCT 16, 2022",
      author: "AEDIN CULHANE",
      categories: ["USA", "CONFERENCE", "OHDSI"],
      excerpt: "Prof Aedin Culhane attended the OHDSI 2022 conference in Washington DC",
      route: "/news/ohdsi-meeting"
    },
    {
      id: 9,
      title: "AICRI Launch",
      image: require('../Images/News/AICRI_launch.jpeg'),
      date: "SEP 28, 2022",
      author: "AEDIN CULHANE",
      categories: ["AICRI", "DUBLIN"],
      excerpt: "The eHealthHub team presented at the All-Ireland Cancer Institute (AICRI) Showcase event which was held in collaboration with 15th International Symposium on Translational...",
      route: "/news/aicri-launch"
    },
    {
      id: 10,
      title: "BCNI Talk",
      image: require('../Images/News/BCNI_meeting.png'),
      date: "SEP 9, 2022",
      author: "AEDIN CULHANE",
      categories: ["CONFERENCE", "GALWAY", "BLOOD CANCER", "TALK"],
      excerpt: "Presentation of the eHealth Hub at the Blood Cancer Network Ireland Meeting.",
      route: "/news/bcni-talk"
    },
    {
      id: 11,
      title: "RTE Brainstorm Article",
      image: require('../Images/News/lungcancer.jpg'),
      date: "MAY 19, 2022",
      author: "AEDIN CULHANE",
      categories: ["RTE", "NEWS ARTICLE"],
      excerpt: "Article about the eHealth-Hub on RTE Brainstorm",
      route: "/news/rte-brainstorm"
    },
    {
      id: 12,
      title: "LimerickPost",
      image: require('../Images/News/ul-research-centre-Clifford_Culhane2.jpeg'),
      date: "APR 4, 2022",
      author: "AEDIN CULHANE",
      categories: ["NEWS ARTICLE", "LIMERICK"],
      excerpt: "Limerick and Belfast researchers tackle 'future cancer epidemic' from the Limerick Post",
      route: "/news/limerick-post"
    }
  ];

  // Filter news items based on search and categories
  const filteredNews = newsItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategories = selectedCategories.length === 0 || 
                            selectedCategories.some(cat => item.categories.includes(cat));
    return matchesSearch && matchesCategories;
  });

  // Sort news items
  const sortedNews = [...filteredNews].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  // Get all unique categories
  const allCategories = [...new Set(newsItems.flatMap(item => item.categories))].sort();

  return (
    <div className="news-container">
      <div className="news-header">
        <h1>News from the eHealth-Hub for Cancer</h1>
        
        {/* Search and Filter Section */}
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
                }}
              >
                {category} ({newsItems.filter(item => item.categories.includes(category)).length})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* News Grid */}
      <div className="news-grid">
        {sortedNews.map(item => (
          <article
            key={item.id}
            className="news-card"
            onClick={() => navigate(item.route)}
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
    </div>
  );
}

export default News;