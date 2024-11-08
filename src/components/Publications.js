import React, { useState } from 'react';
import './Publications.css';

function Publications() {
  // State for active year filter
  const [activeYear, setActiveYear] = useState('2023');
  const [currentPage, setCurrentPage] = useState(1);

  const publicationsPerPage = 5; // Number of publications per page
  const publications = {
    2023: [
      {
        id: 1,
        citation: "O. Adair, E. McFerran, T. Owen, et al. \"A comparison of international modelling methods to evaluate health economics of colorectal cancer screening: a systematic review protocol\". Eng. In: Systematic reviews 12.1 (Jan. 2023), p. 14.",
        doi: "10.1186/s13643-023-02173-w",
        pmid: "36707908"
      },
      {
        id: 2,
        citation: "A. Aggarwal, A. Choudhury, N. Fearnhead, et al. \"The future of cancer care in the UK-time for a radical and sustainable National Cancer Plan\". Eng. In: The Lancet. Oncology 25.1 (Jan. 2024), pp. e6-e17.",
        doi: "10.1016/S1470-2045(23)00511-9",
        pmid: "37977167"
      },
      {
        id: 3,
        citation: "R. Amirkhah, K. Gilroy, S. B. Malla, et al. \"MmCMS: mouse models' consensus molecular subtypes of colorectal cancer\". Eng. In: British journal of cancer 128.7 (Mar. 2023), pp. 1333-1343.",
        doi: "10.1038/s41416-023-02157-6",
        pmid: "36717674"
      },
      {
        id: 4,
        citation: "M. Baumann, J. Celis, U. Ringborg, et al. \"Engaging European society at the forefront of cancer research and care: How discussions at the 5th Gago Conference on European Science policy led to the Heidelberg Manifesto\". Eng. In: Molecular oncology 17.6 (Jun. 2023), pp. 925-945.",
        doi: "10.1002/1878-0261.13423",
        pmid: "36938773"
      },
      {
        id: 5,
        citation: "I. Bondarenko, A. Agarwal, M. Van Hemelrijck, et al. \"Far-reaching impact of the Russian invasion of Ukraine on global cancer research\". Eng. In: European journal of cancer 183 (Apr. 2023), pp. 95-97.",
        doi: "10.1016/j.ejca.2023.01.020",
        pmid: "36812845"
      },
      {
        id: 6,
        citation: "R. Casolino, A. L. Johns, M. Courtot, et al. \"Accelerating cancer omics and precision oncology in health care and research: a Lancet Oncology Commission\". Eng. In: The Lancet. Oncology 24.2 (Feb. 2023), pp. 123-125.",
        doi: "10.1016/S1470-2045(23)00007-4",
        pmid: "36725142"
      },
      {
        id: 7,
        citation: "N. Couespel, E. Venegoni, and M. Lawler. \"The European Cancer Pulse: tracking inequalities in cancer control for citizen benefit\". Eng. In: The Lancet. Oncology 24.5 (May. 2023), pp. 441-442.",
        doi: "10.1016/S1470-2045(23)00140-7",
        pmid: "37142370"
      },
      {
        id: 8,
        citation: "K. B. Eckenrode, D. Righelli, M. Ramos, et al. \"Curated single cell multimodal landmark datasets for R/Bioconductor\". Eng. In: PLoS computational biology 19.8 (Aug. 2023), p. e1011324.",
        doi: "10.1371/journal.pcbi.1011324",
        pmid: "37624866"
      },
      {
        id: 9,
        citation: "D. J. Flanagan, R. Amirkhah, D. F. Vincent, et al. \"Author Correction: Epithelial TGFβ engages growth-factor signalling to circumvent apoptosis and drive intestinal tumourigenesis with aggressive features\". Eng. In: Nature communications 14.1 (Jan. 2023), p. 522.",
        doi: "10.1038/s41467-023-36266-w",
        pmid: "36720858"
      },
      {
        id: 10,
        citation: "G. J. Greene, C. S. Thomson, D. Donnelly, et al. \"Whole-population trends in pathology-confirmed cancer incidence in Northern Ireland, Scotland and Wales during the SARS-CoV-2 pandemic: A retrospective observational study\". Eng. In: Cancer epidemiology 84 (Jun. 2023), p. 102367.",
        doi: "10.1016/j.canep.2023.102367",
        pmid: "37119604"
      },
      {
        id: 11,
        citation: "J. Han, M. Rolles, F. Torabi, et al. \"The impact of the COVID-19 pandemic on community prescription of opioid and antineuropathic analgesics for cancer patients in Wales, UK\". Eng. In: Supportive care in cancer 31.9 (Aug. 2023), p. 531.",
        doi: "10.1007/s00520-023-07944-8",
        pmid: "37606853"
      },
      {
        id: 12,
        citation: "R. H. Henderson, D. French, E. Stewart, et al. \"Delivering the precision oncology paradigm: reduced R&D costs and greater return on investment through a companion diagnostic informed precision oncology medicines approach\". Eng. In: Journal of pharmaceutical policy and practice 16.1 (Jul. 2023), p. 84.",
        doi: "10.1186/s40545-023-00590-9",
        pmid: "37408046"
      },
      {
        id: 13,
        citation: "M. Lawler, G. Lewison, K. Oliver, et al. \"Gender inequity in cancer research leadership in Europe: Time to act\". Eng. In: European journal of cancer 194 (Nov. 2023), p. 113345.",
        doi: "10.1016/j.ejca.2023.113345",
        pmid: "37813780"
      },
      {
        id: 14,
        citation: "M. Lawler, R. Sullivan, G. K. Abou-Alfa, et al. \"Health diplomacy in action: The cancer legacy of the Good Friday Agreement\". Eng. In: Journal of cancer policy 38 (Dec. 2023), p. 100448.",
        doi: "10.1016/j.jcpo.2023.100448",
        pmid: "37839622"
      },
      {
        id: 15,
        citation: "M. P. Lythgoe, G. Lewison, A. Aggarwal, et al. \"The rise of immuno-oncology in China: a challenge to western dominance?\" Eng. In: The Lancet. Oncology 24.5 (May. 2023), pp. 439-441.",
        doi: "10.1016/S1470-2045(23)00026-8",
        pmid: "37142369"
      },
      {
        id: 16,
        citation: "E. McFerran, V. Cairnduff, R. Elder, et al. \"Cost consequences of unscheduled emergency admissions in cancer patients in the last year of life\". Eng. In: Supportive care in cancer 31.3 (Mar. 2023), p. 201.",
        doi: "10.1007/s00520-023-07633-6",
        pmid: "36869930"
      },
      {
        id: 17,
        citation: "S. O'Reilly, H. K. Carroll, D. Murray, et al. \"Impact of the COVID-19 pandemic on cancer care in Ireland - Perspectives from a COVID-19 and Cancer Working Group\". Eng. In: Journal of cancer policy 36 (Jun. 2023), p. 100414.",
        doi: "10.1016/j.jcpo.2023.100414",
        pmid: "36841473"
      },
      {
        id: 18,
        citation: "T. Sessler, G. P. Quinn, M. Wappett, et al. \"surviveR: a flexible shiny application for patient survival analysis\". Eng. In: Scientific reports 13.1 (Dec. 2023), p. 22093.",
        doi: "10.1038/s41598-023-48894-9",
        pmid: "38086891"
      },
      {
        id: 19,
        citation: "R. d. M. Simoes, R. Shirasaki, S. L. Downey-Kopyscinski, et al. \"Genome-scale functional genomics identify genes preferentially essential for multiple myeloma cells compared to other neoplasias\". Eng. In: Nature cancer 4.5 (May. 2023), pp. 754-773.",
        doi: "10.1038/s43018-023-00550-x",
        pmid: "37237081"
      },
      {
        id: 20,
        citation: "K. Taylor, J. Zou, M. Magalhaes, et al. \"Circulating tumour DNA kinetics in recurrent/metastatic head and neck squamous cell cancer patients\". Eng. In: European journal of cancer 188 (Jul. 2023), pp. 29-38.",
        doi: "10.1016/j.ejca.2023.04.014",
        pmid: "37182343"
      }
    ],
    2022: [
      {
        id: 1,
        citation: "A. Banerjee, C. Sudlow, and M. Lawler. \"Indirect effects of the pandemic: highlighting the need for data-driven policy and preparedness\". Eng. In: Journal of the Royal Society of Medicine 115.7 (Jul. 2022), pp. 249-251.",
        doi: "10.1177/01410768221095245",
        pmid: "35537476"
      },
      {
        id: 2,
        citation: "M. Begum, G. Lewison, X. Wang, et al. \"Global colorectal cancer research, 2007-2021: Outputs and funding\". Eng. In: International journal of cancer 152.3 (Feb. 2023), pp. 470-479.",
        doi: "10.1002/ijc.34279",
        pmid: "36082449"
      },
      {
        id: 3,
        citation: "G. Buyens, M. van Balken, K. Oliver, et al. \"Cancer literacy - Informing patients and implementing shared decision making\". Eng. In: Journal of cancer policy 35 (Dec. 2022), p. 100375.",
        doi: "10.1016/j.jcpo.2022.100375",
        pmid: "36462750"
      },
      {
        id: 4,
        citation: "S. M. Corry, A. M. McCorry, T. R. Lannagan, et al. \"Activation of innate-adaptive immune machinery by poly(I:C) exposes a therapeutic vulnerability to prevent relapse in stroma-rich colon cancer\". Eng. In: Gut 71.12 (Dec. 2022), pp. 2502-2517.",
        doi: "10.1136/gutjnl-2021-326183",
        pmid: "35477539"
      },
      {
        id: 5,
        citation: "S. Creedican, C. M. Robinson, K. Mnich, et al. \"Inhibition of IRE1α RNase activity sensitizes patient-derived acute myeloid leukaemia cells to proteasome inhibitors\". Eng. In: Journal of cellular and molecular medicine 26.16 (Aug. 2022), pp. 4629-4633.",
        doi: "10.1111/jcmm.17479",
        pmid: "35822520"
      },
      {
        id: 6,
        citation: "S. Elizabeth, K. Aidan, O. B. David, et al. \"Low CD49d expression in newly diagnosed chronic lymphocytic leukaemia may be associated with high-risk features and reduced treatment-free-intervals\". Eng. In: European journal of haematology 109.5 (Nov. 2022), pp. 441-446.",
        doi: "10.1111/ejh.13824",
        pmid: "35776688"
      },
      {
        id: 7,
        citation: "N. C. Fisher, R. M. Byrne, H. Leslie, et al. \"Biological Misinterpretation of Transcriptional Signatures in Tumor Samples Can Unknowingly Undermine Mechanistic Understanding and Faithful Alignment with Preclinical Data\". Eng. In: Clinical cancer research 28.18 (Sep. 2022), pp. 4056-4069.",
        doi: "10.1158/1078-0432.CCR-22-1102",
        pmid: "35792866"
      },
      {
        id: 8,
        citation: "D. J. Flanagan, R. Amirkhah, D. F. Vincent, et al. \"Epithelial TGFβ engages growth-factor signalling to circumvent apoptosis and drive intestinal tumourigenesis with aggressive features\". Eng. In: Nature communications 13.1 (Dec. 2022), p. 7551.",
        doi: "10.1038/s41467-022-35134-3",
        pmid: "36477656"
      },
      {
        id: 9,
        citation: "G. Greene, R. Griffiths, J. Han, et al. \"Impact of the SARS-CoV-2 pandemic on female breast, colorectal and non-small cell lung cancer incidence, stage and healthcare pathway to diagnosis during 2020 in Wales, UK, using a national cancer clinical record system\". Eng. In: British journal of cancer 127.3 (Aug. 2022), pp. 558-568.",
        doi: "10.1038/s41416-022-01830-6",
        pmid: "35501391"
      },
      {
        id: 10,
        citation: "R. H. Henderson, D. French, E. McFerran, et al. \"Spend less to achieve more: Economic analysis of intermittent versus continuous cetuximab in KRAS wild-type patients with metastatic colorectal cancer\". Eng. In: Journal of cancer policy 33 (Sep. 2022), p. 100342.",
        doi: "10.1016/j.jcpo.2022.100342",
        pmid: "35718327"
      },
      {
        id: 11,
        citation: "G. Lambe, S. Doran, R. Clifford, et al. \"Isolated CNS relapse of medullary aggressive high-grade B-cell lymphoma on 18F-FDG-PET/CT\". Eng. In: European journal of hybrid imaging 6.1 (May. 2022), p. 9.",
        doi: "10.1186/s41824-022-00130-9",
        pmid: "35501493"
      },
      {
        id: 12,
        citation: "M. Lawler and M. Crul. \"Data must underpin our response to the covid-19 pandemic's disastrous impact on cancer\". Eng. In: BMJ (Clinical research ed.) 376 (Feb. 2022), p. o282.",
        doi: "10.1136/bmj.o282",
        pmid: "35115384"
      },
      {
        id: 13,
        citation: "M. Lawler, L. Davies, S. Oberst, et al. \"European Groundshot-addressing Europe's cancer research challenges: a Lancet Oncology Commission\". Eng. In: The Lancet. Oncology 24.1 (Jan. 2023), pp. e11-e56.",
        doi: "10.1016/S1470-2045(22)00540-X",
        pmid: "36400101"
      },
      {
        id: 14,
        citation: "M. Lawler and F. Meunier. \"Don't make cancer survivors pay twice-the right for them to be \"forgotten\" should be law everywhere\". Eng. In: BMJ (Clinical research ed.) 378 (Sep. 2022), p. o2197.",
        doi: "10.1136/bmj.o2197",
        pmid: "36130783"
      },
      {
        id: 15,
        citation: "E. Nolte, M. Morris, S. Landon, et al. \"Exploring the link between cancer policies and cancer survival: a comparison of International Cancer Benchmarking Partnership countries\". Eng. In: The Lancet. Oncology 23.11 (Nov. 2022), pp. e502-e514.",
        doi: "10.1016/S1470-2045(22)00450-8",
        pmid: "36328024"
      },
      {
        id: 16,
        citation: "G. P. Quinn, T. Sessler, B. Ahmaderaghi, et al. \"classifieR a flexible interactive cloud-application for functional annotation of cancer transcriptomes\". Eng. In: BMC bioinformatics 23.1 (Mar. 2022), p. 114.",
        doi: "10.1186/s12859-022-04641-x",
        pmid: "35361119"
      },
      {
        id: 17,
        citation: "P. Robbe, K. E. Ridout, D. V. Vavoulis, et al. \"Whole-genome sequencing of chronic lymphocytic leukemia identifies subgroups with distinct biological and clinical features\". Eng. In: Nature genetics 54.11 (Nov. 2022), pp. 1675-1689.",
        doi: "10.1038/s41588-022-01211-y",
        pmid: "36333502"
      },
      {
        id: 18,
        citation: "R. Sullivan, G. Lewison, J. Torode, et al. \"Cancer research collaboration between the UK and the USA: reflections on the 2021 G20 Summit announcement\". Eng. In: The Lancet. Oncology 23.4 (Apr. 2022), pp. 460-462.",
        doi: "10.1016/S1470-2045(22)00079-1",
        pmid: "35358453"
      },
      {
        id: 19,
        citation: "H. Van Poppel, N. M. L. Battisti, M. Lawler, et al. \"European Cancer Organisation's Inequalities Network: Putting Cancer Inequalities on the European Policy Map\". Eng. In: JCO global oncology 8 (Oct. 2022), p. e2200233.",
        doi: "10.1200/GO.22.00233",
        pmid: "36252165"
      },
      {
        id: 20,
        citation: "Y. Wang, A. Buck, M. Grimaud, et al. \"Anti-CAIX BBζ CAR4/8 T cells exhibit superior efficacy in a ccRCC mouse model\". Eng. In: Molecular therapy oncolytics 24 (Mar. 2022), pp. 385-399.",
        doi: "10.1016/j.omto.2021.12.019",
        pmid: "35118195"
      }
    ]
  };

  const scrollToYear = (year) => {
    const element = document.getElementById(`year-${year}`);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

   // Calculate the current publications to display based on active page
   const indexOfLastPublication = currentPage * publicationsPerPage;
   const indexOfFirstPublication = indexOfLastPublication - publicationsPerPage;
   const currentPublications = publications[activeYear].slice(indexOfFirstPublication, indexOfLastPublication);
 
   // Calculate total pages for the active year
   const totalPages = Math.ceil(publications[activeYear].length / publicationsPerPage);
 
   const handlePageChange = (pageNumber) => {
     setCurrentPage(pageNumber);
   };
 
   return (
     <div className="publications-container">
       <div className="publications-sidebar">
         <div className="sidebar-content">
           <h3>On this page</h3>
           <nav className="year-navigation">
             {Object.keys(publications).reverse().map((year) => (
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