import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Calendar, User, ExternalLink } from 'lucide-react';
import './NewsArticle.css';

function GenderInequalityStudy() {
  return (
    <div className="news-article-container">
      {/* Breadcrumb Navigation */}
      <nav className="article-breadcrumb">
        <Link to="/news" className="breadcrumb-link">News</Link>
        <ChevronLeft size={16} />
        <span>New study highlights significant gender inequality and bias in cancer research</span>
      </nav>

      {/* Article Header */}
      <div className="article-header">
        {/* <div className="article-categories">
          <span className="category-tag">CANCER RESEARCH</span>
          <span className="category-tag">GENDER</span>
        </div> */}
        <br/>
        <h1>New study highlights significant gender inequality and bias in cancer research</h1>
        <div className="article-meta">
          <div className="meta-item">
            <Calendar size={18} />
            <span>October 11, 2023</span>
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
          src={require('../../Images/News/IrishNews_gender.jpg')} 
          alt="Gender inequality in cancer research" 
          className="article-image"
        />
      </div>

      {/* Article Content */}
      <div className="article-content">
        <div className="article-summary">
          A new study, the first of its kind, highlights the extent of gender inequality and gender bias against senior female academics working in cancer research in Europe.
        </div>

        <div className="article-body">
          <p>The findings have just been published today in the <a href="https://www.sciencedirect.com/science/article/abs/pii/S0959804923006470?dgcid=author" target="_blank" rel="noopener noreferrer">European Journal of Cancer</a>.</p>

          <p>The study, from researchers of the All-Island e-Health Hub for Cancer, which is led by Queen's University Belfast and University of Limerick, King's College London, UK, Ghent University, Belgium, the International Brain Tumour Alliance and the European Cancer Organisation looked at published cancer research papers from the 28 EU Member States (plus Iceland, Norway, Switzerland and the United Kingdom (UK)), from two specific years (2009 and 2019) and used these data to determine female cancer research participation and female cancer research leadership over that decade.</p>

          <p>It found whilst there was a slight increase in overall female participation in cancer research between 2009 and 2019 (as judged by percentage of females as authors in cancer research papers, which rose from 42% to 49%), female research leadership tended to stall, only rising from a low of 24% to 34% in the study period.</p>

          <p>The study also found that female cancer research leadership was highest in the majority of Eastern European countries and in Scandinavia, compared to countries in central Europe. However, when cancer researchers from central European countries worked abroad, the percentage of females became similar to that of their host countries.</p>

          <p>The research suggests that female cancer research participation is heavily influenced by availability and relative cost of child-care, which is more favourable in Scandinavia and Eastern Europe than in central/western Europe. These countries are also generous in the provision of maternity and/or paternity leave for new parents.</p>

          <blockquote className="article-quote">
            <p>"This research is very timely and impactful. It highlights the importance of gender equality in cancer research. We recognise the need to address gender balance in science and do more to address this issue. I am committed to increasing female participation and leadership across the higher education sector, as such I was delighted to introduce the Senior Academic Leadership Initiative (SALI), which is allowing us to ensure that enhanced female senior academic leadership is delivered within higher education across Ireland. The research highlighted here, supported through the North South Research Programme, shows that Ireland is heading in the right direction, but emphasises that there is still work to be done to achieve gender equity."</p>
            <cite>- Irish Minister for Further Education, Research, Innovation and Science Simon Harris T.D.</cite>
          </blockquote>
        </div>

        {/* Related Links */}
        <div className="related-links">
          <h2>Read More About This Story</h2>
          <div className="links-grid">
            {[
              {
                title: "Irish News Report",
                url: "https://www.irishnews.com/news/republicofirelandnews/2023/10/12/news/all-ireland_group_highlights_hurdles_facing_women_across_europe_working_in_cancer_research-3691358/"
              },
              {
                title: "QUB News",
                url: "https://www.qub.ac.uk/News/Allnews/featured-research/new-study-highlights-significant-gender-inequality-bias-cancer-research.html"
              },
              {
                title: "UL News",
                url: "https://www.ul.ie/news/ul-academic-hails-extremely-important-study-on-gender-inequality-in-cancer-research"
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

        {/* Related Research */}
        <div className="related-research">
          <h2>Related Research</h2>
          <div className="research-links">
            <a 
              href="https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(23)01701-4/fulltext"
              target="_blank"
              rel="noopener noreferrer"
              className="research-paper"
            >
              <div className="paper-content">
                <h3>Women, power, and cancer: a Lancet Commission</h3>
                <p>Ginsburg O, Vanderpuye V, Beddoe AM, et al. Lancet. 2023</p>
              </div>
              <ExternalLink size={16} />
            </a>
            
            <a 
              href="https://www.theguardian.com/society/2023/sep/26/feminist-approach-cancer-save-lives-800000-women"
              target="_blank"
              rel="noopener noreferrer"
              className="research-paper"
            >
              <div className="paper-content">
                <h3>'Feminist approach' to cancer could save lives of 800,000 women a year</h3>
                <p>The Guardian News Report</p>
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

export default GenderInequalityStudy;