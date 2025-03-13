import React, { useState } from 'react';
import './Publications.css';
import PublicationsData from './PublicationsData';

function Publications() {
  // State for active year filter
  const [activeYear, setActiveYear] = useState('2024');
  const [currentPage, setCurrentPage] = useState(1);

  const publicationsPerPage = 5; // Number of publications per page

  const scrollToYear = (year) => {
    const element = document.getElementById(`year-${year}`);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

   // Calculate the current publications to display based on active page
   const indexOfLastPublication = currentPage * publicationsPerPage;
   const indexOfFirstPublication = indexOfLastPublication - publicationsPerPage;
   const currentPublications = PublicationsData[activeYear].slice(indexOfFirstPublication, indexOfLastPublication);
 
   // Calculate total pages for the active year
   const totalPages = Math.ceil(PublicationsData[activeYear].length / publicationsPerPage);
 
   const handlePageChange = (pageNumber) => {
     setCurrentPage(pageNumber);
   };
 
   return (
     <div className="publications-container">
       <div className="publications-sidebar">
         <div className="sidebar-content">
           <h3>On this page</h3>
           <nav className="year-navigation">
             {Object.keys(PublicationsData).reverse().map((year) => (
               <button
                 key={year}
                 className={`year-link ${activeYear === year ? 'active' : ''}`}
                 onClick={() => {
                   setActiveYear(year);
                   setCurrentPage(1); // Reset to page 1 when the year changes
                   scrollToYear(year);
                 }}
               >
                 Publications {year}
               </button>
             ))}
           </nav>
         </div>
       </div>
 
       <div className="publications-content">
         <h1>Publications</h1>
         
         {activeYear && (
           <section id={`year-${activeYear}`} className="year-section">
             <h2>Publications by eHealth-Hub Cancer Researchers in {activeYear}</h2>
             
             <div className="publications-grid">
               {currentPublications.map((pub, index) => (
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
                     </div>
                   </div>
                 </article>
               ))}
             </div>
 
             {/* Pagination Controls */}
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
           </section>
         )}
       </div>
     </div>
   );
 }
 
 export default Publications;