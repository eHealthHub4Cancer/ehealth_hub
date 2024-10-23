import React, { useEffect } from 'react';
import './About.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import overviewImage from '../Images/sliders/overview.jpeg';

const About = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true
    });
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="about-page">
      <div className="about-container">
        <aside className="about-sidebar" data-aos="fade-right">
          <nav className="page-navigation">
            <h3>On this page</h3>
            <ul>
              <li><button onClick={() => scrollToSection('about')}>About</button></li>
              <li><button onClick={() => scrollToSection('motivation')}>Motivation</button></li>
              <li><button onClick={() => scrollToSection('interoperability')}>Interoperability in Health Care Data</button></li>
              <li><button onClick={() => scrollToSection('ehealthhub')}>The eHealth-Hub for Cancer</button></li>
              <li><button onClick={() => scrollToSection('contribution')}>Contribution to Goals</button></li>
              <li><button onClick={() => scrollToSection('ehealth')}>eHealth</button></li>
            </ul>
          </nav>
        </aside>

        <main className="about-content">
          <section id="about" className="content-section" data-aos="fade-up">
            <h1>About eHealthHub for Cancer</h1>
            <div className="content-block">
              <p>
                The eHealthHub for Cancer is an all-island emerging hub of excellence funded by the Irish Higher Education Authority{' '}
                <a href="https://hea.ie/2021/08/09/hea-launch-e40-million-north-south-research-programme-2021/" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="highlight-link">
                  HEA Shared Island North-South Research Programme
                </a>
                . The eHealthHub for Cancer is lead by UL and QUB and partners with clinical and academic researchers in UCD, RCSI, UG, UCC.
              </p>
            </div>
          </section>

          <section id="motivation" className="content-section" data-aos="fade-up">
            <h2>Motivation</h2>
            <div className="stat-cards">
              <div className="stat-card">
                <span className="stat-number">50%</span>
                <span className="stat-label">Citizens Will Experience Cancer in Their Lifetime</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">40,000+</span>
                <span className="stat-label">Annual Cancer Diagnoses in Ireland</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">10,000+</span>
                <span className="stat-label">Annual Cancer Diagnoses in Northern Ireland</span>
              </div>
            </div>
            <div className="content-block">
              <p>
                Cancer is the leading cause of death on the island of Ireland. Half of all citizens will experience cancer at some stage in their lifetime. 
                Annually, more than 40,000 and 10,000 people are diagnosed with cancer in Ireland (IRE) and Northern Ireland (NI) respectively. 
                With an aging demographic, the population greater than 65 years is estimated to more than double in the next 25 years{' '}
                <a href="https://assets.gov.ie/9315/6f1592a09583421baa87de3a7e9cb619.pdf" target="_blank" rel="noopener noreferrer" className="reference-link">
                  National Cancer Strategy 2017-2026
                </a>{' '}
                <a href="https://www.northernireland.gov.uk/sites/default/files/consultations/health/doh-cancer-strategy-2021-2031.PDF" target="_blank" rel="noopener noreferrer" className="reference-link">
                  A Cancer Strategy for Northern Ireland 2021-2031
                </a>
              </p>
              <div className="info-card">
                <p>
                  Cancer is identified as a priority for increased cross-border collaboration, particularly with the reinvigoration of the{' '}
                  <a href="https://www.cancer.gov/about-nci/organization/cgh/events/ireland-northern-ireland-nci-cancer-consortium-mou" target="_blank" rel="noopener noreferrer" className="highlight-link">
                    Ireland-Northern Ireland-US National Cancer Institute Memorandum of Understanding
                  </a>
                </p>
              </div>
            </div>
          </section>

          <section id="interoperability" className="content-section" data-aos="fade-up">
            <h2>Interoperability in Health Care Data</h2>
            <div className="content-block">
              <div className="feature-card">
                <h3>OMOP Common Data Model (CDM)</h3>
                <p>
                  The Observational Medical Outcomes Partnership (OMOP) Common Data Model (CDM) enables the capture of information 
                  (e.g., encounters, patients, providers, diagnoses, drugs, measurements and procedures) in the same way across different institutions. 
                  This can assist organization overcome traditional challenges when comparing health data across systems.
                </p>
              </div>
              
              <div className="key-points">
                <h3>Key Benefits</h3>
                <ul>
                  <li>Standardizes format and content of observational data</li>
                  <li>Enables application of standardized tools and methods</li>
                  <li>Facilitates data integration across healthcare organizations</li>
                  <li>Supports efficient querying for research purposes</li>
                </ul>
              </div>
            </div>
          </section>

          <section id="ehealthhub" className="content-section" data-aos="fade-up">
            <h2>The eHealth-Hub for Cancer</h2>
            <div className="image-container" data-aos="fade-up">
              <img src={overviewImage} alt="eHealth Hub Overview" className="feature-image" />
            </div>
            <div className="content-block">
              <p>
                This proposal will establish a multidisciplinary all-Island framework for federated cancer eHealth research using OMOP-CDM, 
                build skills and capacity for real-world data analysis, such that Ireland and NI can prosper in EU and global eHealth cancer 
                research and improve patient quality-of-care.
              </p>
            </div>
          </section>

          <section id="contribution" className="content-section" data-aos="fade-up">
            <h2>Contribution of eHealth-Hub to national, shared island and EU goals</h2>
            <div className="contribution-grid">
              <div className="contribution-item">
                <div className="contribution-icon">📊</div>
                <p>Inform evidence-based policy</p>
              </div>
              <div className="contribution-item">
                <div className="contribution-icon">🤝</div>
                <p>Enable increased EU, US and global research collaborations</p>
              </div>
              <div className="contribution-item">
                <div className="contribution-icon">🔬</div>
                <p>Support clinical trials design and research</p>
              </div>
              <div className="contribution-item">
                <div className="contribution-icon">⚡</div>
                <p>Provide next-generation clinical decision-making tools</p>
              </div>
              <div className="contribution-item">
                <div className="contribution-icon">🏥</div>
                <p>Deliver research for individualized healthcare</p>
              </div>
              <div className="contribution-item">
                <div className="contribution-icon">🔄</div>
                <p>Enable real-time data access for cross-border health care</p>
              </div>
            </div>
          </section>

          <section id="ehealth" className="content-section" data-aos="fade-up">
            <h2>eHealth</h2>
            <div className="content-block">
              <p>
                eHealth is a key pillar in health care reform, prioritized in Programme for Government, Sláintecare, and the Project 
                Ireland 2040 National Development Plan and the eHealth strategy for Ireland. The Organisation of European Cancer 
                Institutes (OECI) have highlighted a need for systems to digitize and harmonize patient data.
              </p>
              <div className="info-card">
                <p>
                  eHealth initiatives are integral to European Commission EU4Health (2021-2027), Europe's Beating Cancer Plan and 
                  Horizon Europe Conquering Cancer: Mission Possible (2021-27). This proposal also addresses United Nations SDGs 3 
                  (Health and well being).
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default About;