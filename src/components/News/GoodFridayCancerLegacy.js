import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Calendar, User, ExternalLink } from 'lucide-react';
import './NewsArticle.css';

function GoodFridayCancerLegacy() {
  return (
    <div className="news-article-container">
      {/* Breadcrumb Navigation */}
      <nav className="article-breadcrumb">
        <Link to="/news" className="breadcrumb-link">News</Link>
        <ChevronLeft size={16} />
        <span>All-Island study highlights the cancer legacy of the Good Friday Agreement</span>
      </nav>

      {/* Article Header */}
      <div className="article-header">
        <div className="article-categories">
          <span className="category-tag">BELFAST</span>
          <span className="category-tag">GOOD FRIDAY</span>
          <span className="category-tag">CANCER RESEARCH</span>
          <span className="category-tag">ALL ISLAND</span>
        </div>
        <h1>All-Island study highlights the cancer legacy of the Good Friday Agreement</h1>
        <div className="article-meta">
          <div className="meta-item">
            <Calendar size={18} />
            <span>October 24, 2023</span>
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
          alt="Good Friday Agreement Cancer Research Team" 
          className="article-image"
        />
      </div>

      {/* Article Content */}
      <div className="article-content">
        <div className="article-summary">
          New all-island research led by Queen's University Belfast highlights the health and economic impact of the Good Friday Agreement on cancer across the island of Ireland in the last 25 years.
        </div>

        <div className="article-body">
          <p>The work, involving researchers from Northern Ireland, Ireland, the UK and the U.S. has been published today in the <a href="https://www.sciencedirect.com/science/article/pii/S2213538323000656?via%3Dihub" target="_blank" rel="noopener noreferrer">Journal of Cancer Policy</a>, the number one cancer policy journal globally.</p>

          <p>The study highlights the impact of the Ireland - Northern Ireland – U.S. National Cancer Institute Cancer Consortium, the brainchild of former Queen's University's Vice-Chancellor, Professor Patrick G. Johnston.</p>

          <p>The Consortium is a unique partnership, established in 1999, between the governments of Ireland, Northern Ireland and the U.S., as a direct result of the Good Friday Agreement.</p>

          <div className="key-findings">
            <h2>Key Findings</h2>
            <ul>
              <li>550% increase in the quality of joint cancer research on the island</li>
              <li>Enhanced research leading to increased university spin-out activity</li>
              <li>Significant improvement in cancer outcomes</li>
              <li>Established unique partnership between Ireland, Northern Ireland, and U.S.</li>
            </ul>
          </div>

          <p>The study shows how the Consortium acted as a catalyst, enhancing cancer research quantity and quality both between researchers in Northern Ireland and Ireland and with premier institutions in the U.S., leading to improved cancer outcomes on the island of Ireland.</p>

        </div>

        {/* Related Links */}
        <div className="related-links">
          <h2>Read More About This Story</h2>
          <div className="links-grid">
            {[
              {
                title: "Full Study in Journal of Cancer Policy",
                url: "https://www.sciencedirect.com/science/article/pii/S2213538323000656?via%3Dihub"
              },
              {
                title: "UL News Coverage",
                url: "https://www.ul.ie/news/all-island-study-involving-ul-researcher-highlights-cancer-legacy-of-good-friday-agreement"
              },
              {
                title: "QUB News Coverage",
                url: "https://www.qub.ac.uk/News/Allnews/featured-research/All-IslandstudyhighlightsthecancerlegacyoftheGoodFridayAgreement.html"
              }
            ].map((link, index) => (
              <a 
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="related-link"
              >
                <span>{link.title}</span>
                <ExternalLink size={16} />
              </a>
            ))}
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

export default GoodFridayCancerLegacy;