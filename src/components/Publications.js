import React, { useState } from 'react';
import './Publications.css';
import PublicationsData from './PublicationsData';
import ReportsData from './ReportsData';
import { FileText } from 'lucide-react';

function Publications() {
  // State for active section - can be 'reports' or a year like '2024'
  const [activeSection, setActiveSection] = useState('2024');
  const [currentPage, setCurrentPage] = useState(1);

  const publicationsPerPage = 5; // Number of publications per page

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open PDF in a new tab using Mozilla PDF viewer
  const handleOpenPdf = (url) => {
    const pdfViewerUrl = `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(url)}`;
    window.open(pdfViewerUrl, '_blank');
  };

  // Calculate current items and pagination for publications
  const getPublicationData = () => {
    if (activeSection === 'reports') return { currentItems: [], totalPages: 0 };
    
    const indexOfLastPublication = currentPage * publicationsPerPage;
    const indexOfFirstPublication = indexOfLastPublication - publicationsPerPage;
    const currentItems = PublicationsData[activeSection].slice(indexOfFirstPublication, indexOfLastPublication);
    const totalPages = Math.ceil(PublicationsData[activeSection].length / publicationsPerPage);
    
    return { currentItems, totalPages, indexOfFirstPublication };
  };

  const { currentItems, totalPages, indexOfFirstPublication } = getPublicationData();

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    scrollToTop();
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    setCurrentPage(1); // Reset to page 1 when changing sections
    scrollToTop();
  };

  return (
    <div className="publications-container">
      <div className="publications-sidebar">
        <div className="sidebar-content">
          <h3>On this page</h3>
          <nav className="year-navigation">
            <button
              className={`year-link reports-link ${activeSection === 'reports' ? 'active' : ''}`}
              onClick={() => handleSectionChange('reports')}
            >
              Reports
            </button>
            {Object.keys(PublicationsData).reverse().map((year) => (
              <button
                key={year}
                className={`year-link ${activeSection === year ? 'active' : ''}`}
                onClick={() => handleSectionChange(year)}
              >
                Publications {year}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="publications-content">
        <h1>Reports & Publications</h1>
        
        {/* Reports Section */}
        {activeSection === 'reports' && (
          <section className="content-section">
            <h2>Reports</h2>
            
            <div className="reports-grid">
              {ReportsData.map(report => (
                <div key={report.id} className="report-card">
                  <div className="report-content">
                    <div className="report-header">
                      <h3>{report.title}</h3>
                      <p className="report-meta">{report.date}</p>
                    </div>
                    <div className="report-body">
                      <div className="report-image">
                        <img 
                          src={report.imageUrl} 
                          alt={report.imageCaption || "Report cover"} 
                        />
                        {report.imageCaption && (
                          <p className="image-caption">{report.imageCaption}</p>
                        )}
                      </div>
                      <div className="report-details">
                        <p className="report-authors">Authors: {report.authors}</p>
                        <p className="report-description">{report.description}</p>
                        <div className="report-actions">
                          <button 
                            className="report-button pdf-button"
                            onClick={() => handleOpenPdf(report.pdfUrl)}
                          >
                            <FileText size={18} />
                            <span>Read Full Report</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* Publications Section */}
        {activeSection !== 'reports' && (
          <section className="content-section">
            <h2>Publications by eHealth-Hub Cancer Researchers in {activeSection}</h2>
            
            <div className="publications-grid">
              {currentItems.map((pub, index) => (
                <article key={pub.id} className="publication-card">
                  <div className="publication-number">[{index + 1 + indexOfFirstPublication}]</div>
                  <div className="publication-content">
                    <p className="publication-text">{pub.citation}</p>
                    <div className="publication-meta">
                      {pub.doi && (
                        <a
                          href={`https://doi.org/${pub.doi}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="meta-link"
                        >
                          DOI: {pub.doi}
                        </a>
                      )}
                      {pub.pmid && (
                        <a
                          href={`https://pubmed.ncbi.nlm.nih.gov/${pub.pmid}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="meta-link"
                        >
                          PMID: {pub.pmid}
                        </a>
                      )}
                      {pub.pdfUrl && (
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handleOpenPdf(pub.pdfUrl);
                          }}
                          className="meta-link pdf-link"
                        >
                          <FileText size={16} />
                          <span>View PDF</span>
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 0 && (
              <div className="pagination">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    className={`pagination-button ${currentPage === i + 1 ? 'active' : ''}`}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

export default Publications;