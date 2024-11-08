import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Calendar, User, ExternalLink } from 'lucide-react';
import './NewsArticle.css';

function BelfastAgreement25() {
  return (
    <div className="news-article-container">
      {/* Breadcrumb Navigation */}
      <nav className="article-breadcrumb">
        <Link to="/news" className="breadcrumb-link">News</Link>
        <ChevronLeft size={16} />
        <span>Belfast Agreement 25 Cancer Showcase</span>
      </nav>

      {/* Article Header */}
      <div className="article-header">
        {/* <div className="article-categories">
          <span className="category-tag">BELFAST</span>
          <span className="category-tag">GOOD FRIDAY</span>
          <span className="category-tag">CONFERENCE</span>
        </div> */}
        <br/>
        <h1>Belfast Agreement 25 Cancer Showcase</h1>
        <div className="article-meta">
          <div className="meta-item">
            <Calendar size={18} />
            <span>May 8, 2023</span>
          </div>
          <div className="meta-item">
            <User size={18} />
            <span>AEDIN CULHANE</span>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      <div className="article-image-container">
        <img 
          src={require('../../Images/News/2023_Belfast Photo 1.jpeg')}
          alt="Belfast Agreement 25 Cancer Showcase Event" 
          className="article-image"
        />
        <div className="image-caption sec">
          Prof Aedin Culhane and Prof Mark Lawler met Tánaiste Micheál Martin at the Belfast Agreement 25 Cancer Showcase event
        </div>
      </div>

      {/* Article Content */}
      <div className="article-content">
        <div className="article-summary">
          Belfast Agreement 25 Cancer Showcase discusses need for greater cross-border collaboration on cancer research.
        </div>

        <div className="article-body">
          <div className="event-highlight">
            <h2>'Cancer Knows No Borders'</h2>
            <p>This powerful theme underpinned the recent event which celebrated the positive impacts of the Good Friday Agreement upon cancer research and care across the island of Ireland.</p>
          </div>

          <div className="key-points">
            <h2>Event Highlights</h2>
            <ul>
              <li>Meeting with Tánaiste Micheál Martin to discuss cross-border cancer research collaboration</li>
              <li>Celebration of Good Friday Agreement's impact on cancer research</li>
              <li>Focus on all-island approach to cancer care and research</li>
              <li>Discussion of future collaborative opportunities</li>
            </ul>
          </div>

          <p className='sec'>Prof Aedin Culhane and Prof Mark Lawler met Tánaiste Micheál Martin at the Belfast Agreement 25 Cancer Showcase event in April to discuss greater cross-border collaboration on cancer research.</p>
          <div className="impact-section">
            <h2>Impact & Legacy</h2>
            <p>The event highlighted the significant progress made in cancer research and care through cross-border collaboration since the Good Friday Agreement, while emphasizing the importance of continued partnership for future advances in cancer treatment and research.</p>
          </div>
        </div>

        {/* Related Coverage */}
        <div className="related-coverage">
          <h2>Media Coverage</h2>
          <div className="coverage-grid">
            <a 
              href="https://www.irishtimes.com/health/2023/04/17/countless-lives-saved-from-cancer-due-to-belfast-agreement/"
              target="_blank"
              rel="noopener noreferrer"
              className="coverage-card"
            >
              <div className="coverage-content">
                <h3>The Irish Times</h3>
                <p>"Countless lives saved from cancer due to Belfast Agreement"</p>
              </div>
              <ExternalLink size={16} />
            </a>

            <a 
              href="https://www.ul.ie/news/ul-academic-discusses-need-for-greater-cross-border-collaboration-on-cancer-research"
              target="_blank"
              rel="noopener noreferrer"
              className="coverage-card"
            >
              <div className="coverage-content">
                <h3>University of Limerick News</h3>
                <p>UL academic discusses need for greater cross-border collaboration on cancer research</p>
              </div>
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </div>

      {/* Back to News */}
      <div className="article-footer">
        <Link to="/news" className="back-to-news">
          <ChevronLeft size={20} />
          <span>Back to News</span>
        </Link>
      </div>
    </div>
  );
}

export default BelfastAgreement25;