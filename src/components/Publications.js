import React, { useState, useEffect, useRef } from 'react';
import './Publications.css';
import './ResearchPublications.css';
import { getPublicOutputs, formatOutputDate, sortOutputs, getStaticOutputs } from '../services/researchOutputsService';
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

const typeKeys = { publications: 'publication', reports: 'report', posters: 'poster', presentations: 'presentation' };

// Latest year that has outputs of the given type
const latestYear = (outputs, type) =>
  outputs.filter(output => output.type === typeKeys[type]).map(output => String(output.year || 'Undated'))
    .sort((a, b) => b.localeCompare(a))[0] || '';

// Render a publication as Authors. "Title". Source. - or the stored citation for older free-text entries
const renderCitation = (pub) => {
  if (pub.title) {
    return <>
      <span className="rp-citation-authors">{pub.authors}. </span>
      <strong className="rp-citation-title">"{pub.title}".</strong>
      <span className="rp-citation-source"> {pub.source}</span>
    </>;
  }
  const citation = pub.citation || '';
  const titleStart = citation.indexOf('"');
  const titleEnd = titleStart >= 0 ? citation.indexOf('"', titleStart + 1) : -1;
  if (titleEnd < 0) return citation;
  return <>
    <span className="rp-citation-authors">{citation.slice(0, titleStart)}</span>
    <strong className="rp-citation-title">{citation.slice(titleStart, titleEnd + 1)}</strong>
    <span className="rp-citation-source">{citation.slice(titleEnd + 1)}</span>
  </>;
};

function Publications() {
  // Static data renders immediately, then is replaced by the admin-managed outputs
  const [outputs, setOutputs] = useState(() => sortOutputs(getStaticOutputs()));
  // State for active section - a year like '2024'
  const [outputType, setOutputType] = useState('publications');
  const [activeSection, setActiveSection] = useState(() => latestYear(sortOutputs(getStaticOutputs()), 'publications'));
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    getPublicOutputs().then(loaded => {
      if (cancelled) return;
      setOutputs(loaded);
      setActiveSection(current => current || latestYear(loaded, 'publications'));
    });
    return () => { cancelled = true; };
  }, []);

  const publicationsPerPage = 5; // Number of publications per page

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open PDF in a new tab using Mozilla PDF viewer
  const handleOpenPdf = (url) => {
    const pdfViewerUrl = `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(url)}`;
    window.open(pdfViewerUrl, '_blank');
  };

  const getYear = item => String(item.year || 'Undated');
  const outputItems = outputs.filter(output => output.type === typeKeys[outputType]);
  const filteredOutputs = outputItems.filter(item => getYear(item) === activeSection);

  // Calculate current items and rp-pagination for publications
  const getPublicationData = () => {
    if (outputType !== 'publications') return { currentItems: [], totalPages: 0 };
    
    const indexOfLastPublication = currentPage * publicationsPerPage;
    const indexOfFirstPublication = indexOfLastPublication - publicationsPerPage;
    const currentItems = filteredOutputs.slice(indexOfFirstPublication, indexOfLastPublication);
    const totalPages = Math.ceil(filteredOutputs.length / publicationsPerPage);
    
    return { currentItems, totalPages, indexOfFirstPublication };
  };

  const { currentItems, totalPages, indexOfFirstPublication } = getPublicationData();

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    scrollToTop();
  };

  const typeLabels = { publications: 'Publications', reports: 'Reports', posters: 'Posters', presentations: 'Presentations' };
  const availableYears = [...new Set(outputItems.map(getYear))].sort((a, b) => b.localeCompare(a));
  const handleTypeChange = type => {
    setOutputType(type);
    setActiveSection(latestYear(outputs, type));
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
                      <p className="rp-report-meta">{formatOutputDate(report)}</p>
                    </div>
                    <div className="rp-report-body">
                      {report.imageUrl && (
                        <div className="rp-report-image">
                          <img 
                            src={report.imageUrl} 
                            alt={report.imageCaption || "Report cover"} 
                          />
                          {report.imageCaption && (
                            <p className="rp-image-caption">{report.imageCaption}</p>
                          )}
                        </div>
                      )}
                      <div className="rp-report-details">
                        {report.authors && <p className="rp-report-authors">Authors: {report.authors}</p>}
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
                {item.year && <p className="rp-paper-source">{formatOutputDate(item)}</p>}
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
              <span className="rp-results-count">{filteredOutputs.length} publications</span>
            </div>
            
            <div className="rp-publications-grid">
              {currentItems.map((pub, index) => (
                <article key={pub.id} className="rp-publication-card">
                  <div className="rp-publication-number">[{index + 1 + indexOfFirstPublication}]</div>
                  <div className="rp-publication-content">
                    <p className="rp-publication-text">{renderCitation(pub)}</p>
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