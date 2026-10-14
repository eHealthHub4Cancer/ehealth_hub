import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Users, UserRound, ArrowUpRight } from 'lucide-react';
import './About.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import overviewImage from '../Images/sliders/overview.jpeg';

const About = () => {
  const [activeSection, setActiveSection] = useState('about');
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll('.about-page .content-section'));
    const update = () => {
      const current = sections.filter(section => section.getBoundingClientRect().top <= 150).pop();
      setActiveSection(current ? current.id : 'about');
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  const [advisoryPage, setAdvisoryPage] = useState(0);
  const [advisoryPaused, setAdvisoryPaused] = useState(false);
  const [advisoryHovered, setAdvisoryHovered] = useState(false);
  const [advisoryFocused, setAdvisoryFocused] = useState(false);
  const [advisoryVisible, setAdvisoryVisible] = useState(false);
  const [advisoryAutoAllowed, setAdvisoryAutoAllowed] = useState(false);
  const advisoryRef = useRef(null);

  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 768px)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setAdvisoryAutoAllowed(mobile.matches && !reducedMotion.matches && !document.hidden);
    update();
    mobile.addEventListener('change', update);
    reducedMotion.addEventListener('change', update);
    document.addEventListener('visibilitychange', update);
    const observer = new IntersectionObserver(([entry]) => setAdvisoryVisible(entry.isIntersecting), { threshold: 0.25 });
    if (advisoryRef.current) observer.observe(advisoryRef.current);
    return () => {
      observer.disconnect();
      mobile.removeEventListener('change', update);
      reducedMotion.removeEventListener('change', update);
      document.removeEventListener('visibilitychange', update);
    };
  }, []);

  useEffect(() => {
    if (!advisoryAutoAllowed || !advisoryVisible || advisoryPaused || advisoryHovered || advisoryFocused) return;
    const timer = window.setInterval(() => setAdvisoryPage(page => (page + 1) % 3), 10000);
    return () => window.clearInterval(timer);
  }, [advisoryAutoAllowed, advisoryVisible, advisoryPaused, advisoryHovered, advisoryFocused]);
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true
    });
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <div className="about-page">
      <div className="about-container">
        <aside className="about-sidebar" data-aos="fade-right">
          <nav className="page-navigation" aria-label="On this page">
            <h3>On this page</h3>
            <ul>
              <li><button aria-current={activeSection === 'about' ? 'location' : undefined} onClick={() => scrollToSection('about')}>About</button></li>
              <li><button aria-current={activeSection === 'work-packages' ? 'location' : undefined} onClick={() => scrollToSection('work-packages')}>Work Packages</button></li>
              <li><button aria-current={activeSection === 'motivation' ? 'location' : undefined} onClick={() => scrollToSection('motivation')}>Motivation</button></li>
              <li><button aria-current={activeSection === 'advisory-board' ? 'location' : undefined} onClick={() => scrollToSection('advisory-board')}>Scientific Advisory Board</button></li>
              <li><button aria-current={activeSection === 'interoperability' ? 'location' : undefined} onClick={() => scrollToSection('interoperability')}>Interoperability in Health Care Data</button></li>
              <li><button aria-current={activeSection === 'ehealthhub' ? 'location' : undefined} onClick={() => scrollToSection('ehealthhub')}>The eHealth-Hub for Cancer</button></li>
              <li><button aria-current={activeSection === 'contribution' ? 'location' : undefined} onClick={() => scrollToSection('contribution')}>Contribution to Goals</button></li>
              <li><button aria-current={activeSection === 'ehealth' ? 'location' : undefined} onClick={() => scrollToSection('ehealth')}>eHealth</button></li>
            </ul>
          </nav>
        </aside>

        <main className="about-content">
          <section id="about" className="content-section" data-aos="fade-up">
            <h1>About eHealthHub for Cancer</h1>
            <div className="content-block">
              <p>
              The eHealth-Hub, is a Strand II project  funded under the North South Research Programme (NSRP){' '}
                <a href="https://hea.ie/2021/08/09/hea-launch-e40-million-north-south-research-programme-2021/" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="highlight-link">
                  NSRP North-South Research Programme
                </a>
                . The eHealth-Hub for Cancer is led by the University of Limerick (UL) and Queen's University Belfast (QUB), and partners with clinical and academic researchers from the University College Dublin (UCD), Royal College of Surgeons in Ireland (RCSI), University of Galway (UG), University College Cork (UCC), and Trinity College Dublin (TCD).
              </p>
              <p>
                The Hub also works with European partners on Ireland's readiness for the{' '}
                <Link to="/news/preparing-for-EHDS" className="highlight-link">European Health Data Space (EHDS)</Link>
                , and the University of Limerick leads Ireland's participation in the EU-funded{' '}
                <Link to="/news/ul-leads-ireland-in-eu-candle-cancer-data-project" className="highlight-link">CANDLE cancer data initiative</Link>.
              </p>

            </div>
          </section>

          <section id="work-packages" className="content-section" data-aos="fade-up">
            <h2>Work Packages</h2>
            <div className="content-block">
              <div className="work-packages-list">
                <div className="work-package-item">
                  <span className="wp-number">WP1</span>
                  <span className="wp-title">Project Management and Dissemination</span>
                </div>
                <div className="work-package-item">
                  <span className="wp-number">WP2</span>
                  <span className="wp-title">eHealth-Hub Training Academy for clinical cancer research</span>
                </div>
                <div className="work-package-item">
                  <span className="wp-number">WP3</span>
                  <span className="wp-title">eHealth-Hub Foundations for implementing cross-border federated eHealth (Retrospective Study of Data Quality at Source)</span>
                </div>
                <div className="work-package-item">
                  <span className="wp-number">WP4</span>
                  <span className="wp-title">Development of next-generation cancer data tools to facilitate clinical decisions</span>
                </div>
                <div className="work-package-item">
                  <span className="wp-number">WP5</span>
                  <span className="wp-title">Application of federated all-Ireland cancer eHealth research in cancer</span>
                </div>
                <div className="work-package-item">
                  <span className="wp-number">WP6</span>
                  <span className="wp-title">Population all-island studies cancer to inform public policy</span>
                </div>
              </div>
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

          <section id="advisory-board" className="content-section" data-aos="fade-up">
            <h2 className="advisory-heading"><Users size={27} aria-hidden="true" /><span>eHealth Hub for Cancer Scientific Advisory Board</span></h2>
            <div className="content-block"> 
              <div className="advisory-carousel" ref={advisoryRef}
                onMouseEnter={() => setAdvisoryHovered(true)} onMouseLeave={() => setAdvisoryHovered(false)}
                onFocusCapture={() => setAdvisoryFocused(true)}
                onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setAdvisoryFocused(false); }}
                onTouchStart={() => setAdvisoryPaused(true)}>
              <div className="advisory-board-grid" id="advisory-members" data-page={advisoryPage}>
                <div className="advisory-member">
                  <span className="advisory-avatar"><UserRound size={23} aria-hidden="true" /></span>
                  <div className="member-info">
                    <h4>
                      <a href="https://www.leedsth.nhs.uk/about/press-media/media-experts/professor-geoff-hall/" 
                         target="_blank" 
                         rel="noopener noreferrer" 
                         className="member-link">
                        Professor Geoff Hall
                        <ArrowUpRight size={16} aria-hidden="true" />
                        <span className="advisory-sr-only"> (opens in a new tab)</span>
                      </a>
                    </h4>
                    <p>Professor of Digital Health, Leeds University, Chief Clinical Information Officer for Leeds Teaching Hospitals, UK</p>
                  </div>
                </div>

                <div className="advisory-member">
                  <span className="advisory-avatar"><UserRound size={23} aria-hidden="true" /></span>
                  <div className="member-info">
                    <h4>
                      <a href="https://www.abdn.ac.uk/people/lesley.anderson" 
                         target="_blank" 
                         rel="noopener noreferrer" 
                         className="member-link">
                        Professor Lesley Anderson
                        <ArrowUpRight size={16} aria-hidden="true" />
                        <span className="advisory-sr-only"> (opens in a new tab)</span>
                      </a>
                    </h4>
                    <p>Professor in Health Data Science, University of Aberdeen, UK</p>
                  </div>
                </div>

                <div className="advisory-member">
                  <span className="advisory-avatar"><UserRound size={23} aria-hidden="true" /></span>
                  <div className="member-info">
                    <h4>
                      <a href="https://www.bme.jhu.edu/people/faculty/paul-nagy/" 
                         target="_blank" 
                         rel="noopener noreferrer" 
                         className="member-link">
                        Associate Professor Paul Nagy
                        <ArrowUpRight size={16} aria-hidden="true" />
                        <span className="advisory-sr-only"> (opens in a new tab)</span>
                      </a>
                    </h4>
                    <p>Program Director Informatics and Data Science, Johns Hopkins University, USA</p>
                  </div>
                </div>

                <div className="advisory-member">
                  <span className="advisory-avatar"><UserRound size={23} aria-hidden="true" /></span>
                  <div className="member-info">
                    <h4>
                      <a href="https://ie.linkedin.com/in/angela-clayton-lea-mba-7970881b" 
                         target="_blank" 
                         rel="noopener noreferrer" 
                         className="member-link">
                        Ms Angela Clayton-Lea
                        <ArrowUpRight size={16} aria-hidden="true" />
                        <span className="advisory-sr-only"> (opens in a new tab)</span>
                      </a>
                    </h4>
                    <p>Chief Executive Officer at Cancer Trials Ireland, Ireland</p>
                  </div>
                </div>

                <div className="advisory-member">
                  <span className="advisory-avatar"><UserRound size={23} aria-hidden="true" /></span>
                  <div className="member-info">
                    <h4>
                      <a href="https://martincurley.eu/" 
                         target="_blank" 
                         rel="noopener noreferrer" 
                         className="member-link">
                        Prof Martin Curley
                        <ArrowUpRight size={16} aria-hidden="true" />
                        <span className="advisory-sr-only"> (opens in a new tab)</span>
                      </a>
                    </h4>
                    <p>Professor of Innovation, Maynooth University and Digital Health Leader, Ireland</p>
                  </div>
                </div>

                <div className="advisory-member">
                  <span className="advisory-avatar"><UserRound size={23} aria-hidden="true" /></span>
                  <div className="member-info">
                    <h4>
                      <a href="https://www.turing.ac.uk/people/external-researchers/debbie-keatley" 
                         target="_blank" 
                         rel="noopener noreferrer" 
                         className="member-link">
                        Ms Debbie Keatley
                        <ArrowUpRight size={16} aria-hidden="true" />
                        <span className="advisory-sr-only"> (opens in a new tab)</span>
                      </a>
                    </h4>
                    <p>Member Data Advisory Board, Cancer Research UK and member of the Northern Ireland cancer Research Consumer Forum</p>
                  </div>
                </div>

                <div className="advisory-member">
                  <span className="advisory-avatar"><UserRound size={23} aria-hidden="true" /></span>
                  <div className="member-info">
                    <h4>
                      <a href="https://uk.linkedin.com/in/xosegb" 
                         target="_blank" 
                         rel="noopener noreferrer" 
                         className="member-link">
                        Dr Xose Fernandez
                        <ArrowUpRight size={16} aria-hidden="true" />
                        <span className="advisory-sr-only"> (opens in a new tab)</span>
                      </a>
                    </h4>
                    <p>Head Digital Oncology Network for Europe, IQVIA UK</p>
                  </div>
                </div>

                <div className="advisory-member">
                  <span className="advisory-avatar"><UserRound size={23} aria-hidden="true" /></span>
                  <div className="member-info">
                    <h4>
                      <a href="https://ie.linkedin.com/in/gilles-ducorroy-9b90768" 
                         target="_blank" 
                         rel="noopener noreferrer" 
                         className="member-link">
                        Mr Gilles Ducorroy
                        <ArrowUpRight size={16} aria-hidden="true" />
                        <span className="advisory-sr-only"> (opens in a new tab)</span>
                      </a>
                    </h4>
                    <p>Health &amp; Value and Pricing Reimbursement Director, Pfizer</p>
                  </div>
                </div>
              </div>
              <nav className="advisory-pagination" aria-label="Advisory board pages">
                {[0, 1, 2].map(page => (
                  <button key={page} type="button" aria-controls="advisory-members"
                    aria-label={`Show advisory board page ${page + 1}`}
                    aria-current={advisoryPage === page ? 'page' : undefined}
                    onClick={() => { setAdvisoryPage(page); setAdvisoryPaused(true); }}>{page + 1}</button>
                ))}
                <span className="advisory-page-status">Page {advisoryPage + 1} of 3</span>
              </nav>
              </div>
            </div>
          </section>

          <section id="interoperability" className="content-section" data-aos="fade-up">
            <h2>Interoperability in Health Care Data</h2>
            <div className="content-block">
              <div className="feature-card">
                <h3>OMOP Common Data Model (CDM)</h3>
                <hr/>
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