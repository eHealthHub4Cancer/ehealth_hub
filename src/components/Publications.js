import React, { useState, useEffect, useRef } from 'react';
import './Publications.css';
import './ResearchPublications.css';
import PublicationsData from './PublicationsData';
import ReportsData from './ReportsData';
import OtherOutputsData from './OtherOutputsData';
import { FileText, ChevronDown, CalendarDays, Copy, Check } from 'lucide-react';

function CopyLink({ url }) {
  const [status, setStatus] = useState('');
  const resetTimer = useRef(null);
  useEffect(() => () => window.clearTimeout(resetTimer.current), []);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setStatus('Copied');
    } catch {
      setStatus('Could not copy');
    }
    window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => setStatus(''), 2500);
  };
  return <button type="button" className="rp-copy-link" onClick={copy} aria-label={`Copy link: ${url}`} title="Copy link">
    {status === 'Copied' ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
    <span className="rp-copy-status" role="status">{status}</span>
  </button>;
}

function Publications() {
  // State for active section - can be 'reports' or a year like '2024'
  const [outputType, setOutputType] = useState('publications');
  const [activeSection, setActiveSection] = useState(Object.keys(PublicationsData).sort((a, b) => Number(b) - Number(a))[0] || '');
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

  // Calculate current items and rp-pagination for publications
  const getPublicationData = () => {
    if (outputType !== 'publications') return { currentItems: [], totalPages: 0 };
    
    const indexOfLastPublication = currentPage * publicationsPerPage;
    const indexOfFirstPublication = indexOfLastPublication - publicationsPerPage;
    const currentItems = (PublicationsData[activeSection] || []).slice(indexOfFirstPublication, indexOfLastPublication);
    const totalPages = Math.ceil((PublicationsData[activeSection] || []).length / publicationsPerPage);
    
    return { currentItems, totalPages, indexOfFirstPublication };
  };

  const { currentItems, totalPages, indexOfFirstPublication } = getPublicationData();

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    scrollToTop();
  };

  const typeLabels = { publications: 'Publications', reports: 'Reports', posters: 'Posters', presentations: 'Presentations' };
  const getYear = item => String(item.year || (item.date || '').match(/\b(?:19|20)\d{2}\b/)?.[0] || 'Undated');
  const outputItems = outputType === 'reports' ? ReportsData : (OtherOutputsData[outputType] || []);
  const availableYears = outputType === 'publications'
    ? Object.keys(PublicationsData).filter(year => PublicationsData[year].length).sort((a, b) => Number(b) - Number(a))
    : [...new Set(outputItems.map(getYear))].sort((a, b) => b.localeCompare(a));
  const filteredOutputs = outputItems.filter(item => getYear(item) === activeSection);
  const handleTypeChange = type => {
    setOutputType(type);
    const items = type === 'reports' ? ReportsData : (OtherOutputsData[type] || []);
    const years = type === 'publications' ? Object.keys(PublicationsData).filter(year => PublicationsData[year].length).sort((a, b) => Number(b) - Number(a))
      : [...new Set(items.map(getYear))].sort((a, b) => b.localeCompare(a));
    setActiveSection(years[0] || '');
    setCurrentPage(1);
  };

  return (
    <div className="rp-publications-container">
      <header className="rp-page-header">
        <h1>Research Outputs</h1>
        <p className="rp-intro">Publications, reports, posters and presentations from eHealthHub for Cancer.</p>
        
      </header>
      <div className="rp-publications-sidebar">
        <div className="rp-sidebar-content">
          <h3>Output type</h3>
          <nav className="rp-year-navigation" aria-label="Output type">
            {Object.entries(typeLabels).map(([type, label]) => (
              <button key={type} className={`rp-year-link ${outputType === type ? 'active' : ''}`}
                aria-pressed={outputType === type} onClick={() => handleTypeChange(type)}>{label}</button>
            ))}
          </nav>
          {availableYears.length > 0 && <div className="rp-year-select">
            <label htmlFor="output-year">Select year</label>
            <div className="rp-year-control">
            <CalendarDays size={18} aria-hidden="true" />
            <select id="output-year" value={activeSection} onChange={event => { setActiveSection(event.target.value); setCurrentPage(1); }}>
              {availableYears.map(year => <option key={year} value={year}>{year}</option>)}
            </select>
            <ChevronDown className="rp-year-chevron" size={17} aria-hidden="true" />
            </div>
          </div>}

        </div>
      </div>

      <div className="rp-publications-content">
        {/* Reports Section */}
        {outputType === 'reports' && (
          <section className="rp-content-section">
            <h2>Reports</h2>
            
            <div className="rp-reports-grid">
              {filteredOutputs.map(report => (
                <div key={report.id} className="rp-report-card">
                  <div className="rp-report-content">
                    <div className="rp-report-header">
                      <h3>{report.title}</h3>
                      <p className="rp-report-meta">{report.date}</p>
                    </div>
                    <div className="rp-report-body">
                      <div className="rp-report-image">
                        <img 
                          src={report.imageUrl} 
                          alt={report.imageCaption || "Report cover"} 
                        />
                        {report.imageCaption && (
                          <p className="rp-image-caption">{report.imageCaption}</p>
                        )}
                      </div>
                      <div className="rp-report-details">
                        <p className="rp-report-authors">Authors: {report.authors}</p>
                        <p className="rp-report-description">{report.description}</p>
                        <div className="rp-report-actions">
                          <span className="rp-link-actions">
                          <button 
                            className="rp-report-button rp-pdf-button"
                            onClick={() => handleOpenPdf(report.pdfUrl)}
                          >
                            <FileText size={18} />
                            <span>Read Full Report</span>
                          </button>
                          <CopyLink url={report.pdfUrl} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {(outputType === 'posters' || outputType === 'presentations') && <section className="rp-content-section">
          <h2>{typeLabels[outputType]}{activeSection && ` · ${activeSection}`}</h2>
          {filteredOutputs.length === 0 ? <p className="rp-empty-state">No {typeLabels[outputType].toLowerCase()} have been added yet.</p>
            : filteredOutputs.map(item => <article className="rp-publication-card" key={item.id}>
              <div className="rp-publication-content">
                <h3 className="rp-paper-title">{item.title}</h3>
                {item.authors && <p className="rp-paper-authors">{item.authors}</p>}
                {item.date && <p className="rp-paper-source">{item.date}</p>}
                {item.description && <p className="rp-publication-text">{item.description}</p>}
                {(item.url || item.pdfUrl) && <span className="rp-link-actions"><a className="rp-meta-link" href={item.url || item.pdfUrl} target="_blank" rel="noopener noreferrer">View {outputType === 'posters' ? 'poster' : 'presentation'}</a><CopyLink url={item.url || item.pdfUrl} /></span>}
              </div>
            </article>)}
        </section>}

        {/* Publications Section */}
        {outputType === 'publications' && (
          <section className="rp-content-section">
            <div className="rp-results-heading">
              <h2>Publications <span className="rp-year-label">{activeSection}</span></h2>
              <span className="rp-results-count">{(PublicationsData[activeSection] || []).length} publications</span>
            </div>
            
            <div className="rp-publications-grid">
              {currentItems.map((pub, index) => (
                <article key={pub.id} className="rp-publication-card">
                  <div className="rp-publication-number">[{index + 1 + indexOfFirstPublication}]</div>
                  <div className="rp-publication-content">
                    <p className="rp-publication-text">{(() => {
                      const titleStart = pub.citation.indexOf('"');
                      const titleEnd = titleStart >= 0 ? pub.citation.indexOf('"', titleStart + 1) : -1;
                      if (titleEnd < 0) return pub.citation;
                      return <>
                        <span className="rp-citation-authors">{pub.citation.slice(0, titleStart)}</span>
                        <strong className="rp-citation-title">{pub.citation.slice(titleStart, titleEnd + 1)}</strong>
                        <span className="rp-citation-source">{pub.citation.slice(titleEnd + 1)}</span>
                      </>;
                    })()}</p>
                    <div className="rp-publication-meta">
                      {pub.doi && (
                        <span className="rp-link-actions"><a
                          href={`https://doi.org/${pub.doi}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rp-meta-link"
                        >
                          DOI <span className="rp-identifier">{pub.doi}</span>
                        </a><CopyLink url={`https://doi.org/${pub.doi}`} /></span>
                      )}
                      {pub.pmid && (
                        <span className="rp-link-actions"><a
                          href={`https://pubmed.ncbi.nlm.nih.gov/${pub.pmid}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rp-meta-link"
                        >
                          PubMed <span className="rp-identifier">{pub.pmid}</span>
                        </a><CopyLink url={`https://pubmed.ncbi.nlm.nih.gov/${pub.pmid}`} /></span>
                      )}
                      {pub.pdfUrl && (
                        <span className="rp-link-actions"><a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handleOpenPdf(pub.pdfUrl);
                          }}
                          className="rp-meta-link rp-pdf-link"
                        >
                          <FileText size={16} />
                          <span>View PDF</span>
                        </a><CopyLink url={pub.pdfUrl} /></span>
                      )}
                      {pub.link && (
                        <span className="rp-link-actions"><a
                          href={pub.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rp-meta-link"
                        >
                          View Article
                        </a><CopyLink url={pub.link} /></span>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="rp-pagination">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    className={`rp-pagination-button ${currentPage === i + 1 ? 'active' : ''}`}
                    aria-current={currentPage === i + 1 ? 'page' : undefined}
                    aria-label={`Page ${i + 1}`}
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