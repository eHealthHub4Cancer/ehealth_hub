import React, { useEffect } from 'react';
import './CollaboratorsSection.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import image4 from '../Images/sliders/overview.jpeg';

function CollaboratorsSection() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true, easing: 'ease-in-out' });
  }, []);

  const collaborators = [
    { name: 'University of Limerick (UL)', role: 'Lead Institution', link: 'https://www.ul.ie/' },
    { name: "Queen's University Belfast (QUB)", role: 'Research Partner', link: 'https://www.qub.ac.uk/' },
    { name: 'National Cancer Registry Ireland (NCRI)', role: 'Data Registry', link: 'https://www.ncri.ie/' },
    { name: 'RCSI, UCD, University of Galway, UCC & TCD', role: 'Academic Partners', link: 'https://www.rcsi.com/' },
  ];

  return (
    <section className="cs-section">
      <div className="cs-inner">
        <div className="cs-grid">

          {/* ── Left: content ── */}
          <div className="cs-content" data-aos="fade-right">

            <div className="cs-header">
              <span className="cs-eyebrow">Research Network</span>
              <h2 className="cs-heading">Our Collaborators</h2>
              <div className="cs-bar"></div>
              <p className="cs-subheading">
                Leading institutions driving innovation in cancer eHealth research.
              </p>
            </div>

            <p className="cs-body" data-aos="fade-up" data-aos-delay="150">
              The <strong className="cs-highlight">eHealthHub for Cancer</strong> brings together
              key institutions across Ireland to advance cancer research and improve patient
              care outcomes — leveraging cutting-edge technology, data sharing, and
              collaborative research.
            </p>

            <div className="cs-cards" data-aos="fade-up" data-aos-delay="300">
              {collaborators.map((c, i) => (
                <a
                  key={i}
                  href={c.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cs-card"
                >
                  <div className="cs-card-body">
                    <span className="cs-card-role">{c.role}</span>
                    <span className="cs-card-name">{c.name}</span>
                  </div>
                  <svg className="cs-card-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17L17 7M17 7H7M17 7v10"/>
                  </svg>
                </a>
              ))}
            </div>

            <figure className="cs-quote" data-aos="fade-up" data-aos-delay="450">
              <blockquote>
                "By connecting cancer data from across the island of Ireland, we are
                creating a future where real-time data access drives evidence-based
                healthcare decisions and improves cancer care for all."
              </blockquote>
              <figcaption>— eHealthHub for Cancer</figcaption>
            </figure>

          </div>

          {/* ── Right: image + stats ── */}
          <div className="cs-visual" data-aos="fade-left">
            <div className="cs-img-wrap">
              <img
                src={image4}
                alt="Overview of Collaborators"
                loading="lazy"
                className="cs-img"
              />
              <div className="cs-stats">
                <div className="cs-stat">
                  <span className="cs-stat-num">€4M</span>
                  <span className="cs-stat-lbl">Funding</span>
                </div>
                <div className="cs-stat">
                  <span className="cs-stat-num">10</span>
                  <span className="cs-stat-lbl">PhD Students</span>
                </div>
                <div className="cs-stat">
                  <span className="cs-stat-num">7</span>
                  <span className="cs-stat-lbl">Research Assistants</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default CollaboratorsSection;