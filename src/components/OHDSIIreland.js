import React, { useEffect, useState } from 'react';
import './OHDSIIreland.css';
import ohdsiLogo from '../Images/logo/OHDSI_Logo.png';
import { getSeminarsByStatus } from '../services/ohdsiSeminarService';

const OHDSIIreland = () => {
  const [upcomingSeminars, setUpcomingSeminars] = useState([]);
  const [pastSeminars, setPastSeminars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFlyer, setSelectedFlyer] = useState(null);

  useEffect(() => {
    loadSeminars();
    setupScrollAnimations();
  }, []);

  const loadSeminars = async () => {
    try {
      const [upcoming, past] = await Promise.all([
        getSeminarsByStatus('upcoming'),
        getSeminarsByStatus('past')
      ]);
      setUpcomingSeminars(upcoming);
      setPastSeminars(past);
    } catch (error) {
      console.error('Error loading seminars:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupScrollAnimations = () => {
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    const sections = document.querySelectorAll('.ohdsi-objectives, .ohdsi-activities, .ohdsi-get-involved, .ohdsi-resources, .ohdsi-leadership, .ohdsi-seminars');
    sections.forEach((section) => {
      section.style.opacity = '0';
      section.style.transform = 'translateY(30px)';
      section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(section);
    });

    return () => observer.disconnect();
  };

  const scrollToGetInvolved = (e) => {
    e.preventDefault();
    const element = document.getElementById('get-involved');
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const openFlyerModal = (flyerUrl) => {
    setSelectedFlyer(flyerUrl);
  };

  const closeFlyerModal = () => {
    setSelectedFlyer(null);
  };

  return (
    <div className="ohdsi-ireland-container">
      {/* Hero Section */}
      <section className="ohdsi-hero">
        <div className="ohdsi-hero-content">
          <div className="ohdsi-hero-text">
            <h1>OHDSI Ireland</h1>
            <p className="subtitle">
              The all-island Irish National Node fostering real-world evidence research, 
              advancing healthcare outcomes, and building collaborative partnerships across Ireland.
            </p>
            <div className="ohdsi-hero-cta">
              <button onClick={scrollToGetInvolved} className="hero-button">
                Get Involved
              </button>
            </div>
          </div>
          <div className="ohdsi-hero-logo">
            <div className="logo-container">
              <img src={ohdsiLogo} alt="OHDSI Ireland Logo" />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="ohdsi-main-content">
        {/* Leadership Section */}
        <section className="ohdsi-leadership">
          <h2>Leadership</h2>
          <div className="leadership-content">
            <div className="leadership-highlight">
              <p>
                <strong>The node leads are Prof Aedin Culhane, University of Limerick, Prof Mark Lawler, Queen's University Belfast and Dr Catherine Mahoney, Eli Lilly and Company.</strong>
              </p>
            </div>
          </div>
        </section>

        {/* Objectives Section */}
        <section className="ohdsi-objectives">
          <h2>Our Objectives</h2>
          <p>
            The OHDSI Ireland node is established with clear goals to transform 
            healthcare research and policy through collaborative real-world evidence generation.
          </p>
          <div className="objectives-grid">
            <div className="objective-card">
              <h3>Foster Collaboration</h3>
              <p>
                Facilitate collaboration and knowledge sharing, fostering real-world 
                evidence research on the island of Ireland through multi-stakeholder engagement.
              </p>
            </div>
            <div className="objective-card">
              <h3>Align with National Initiatives</h3>
              <p>
                Align with national health initiatives and stimulate research collaborations 
                and projects with European and global OHDSI partners.
              </p>
            </div>
            <div className="objective-card">
              <h3>Enhance Communication</h3>
              <p>
                Communicate OHDSI activities and facilitate engagement with OHDSI 
                activities, meetings, and events across the research community.
              </p>
            </div>
          </div>
        </section>

        {/* Activities Section */}
        <section className="ohdsi-activities">
          <h2>Key Activities</h2>
          <p>
            To achieve our objectives, the Irish National Node focuses on strategic activities 
            that build bridges between stakeholders and advance real-world evidence research.
          </p>
          <div className="activities-grid">
            <div className="activity-card">
              <h3>Stakeholder Engagement</h3>
              <p>
                Actively communicate OHDSI activities to <span className="activity-highlight">academia</span>, 
                <span className="activity-highlight"> healthcare organizations</span>, 
                <span className="activity-highlight"> policy makers</span>, 
                <span className="activity-highlight"> eHealth enterprises</span>, 
                <span className="activity-highlight"> pharmaceutical companies</span>, and 
                <span className="activity-highlight"> clinical research institutions</span>.
              </p>
            </div>
            <div className="activity-card">
              <h3>European Collaboration</h3>
              <p>
                Engage regularly in <span className="activity-highlight">OHDSI activities at the European level</span>, 
                fostering international partnerships and knowledge exchange across borders.
              </p>
            </div>
            <div className="activity-card">
              <h3>Industry Working Group</h3>
              <p>
                Establish a dedicated working group for <span className="activity-highlight">real-world evidence experts</span> in Ireland's large pharmaceutical sector to increase industry engagement with the OHDSI community.
              </p>
            </div>
          </div>
        </section>

        {/* SEMINAR SERIES SECTION - NEW */}
        {!loading && (upcomingSeminars.length > 0 || pastSeminars.length > 0) && (
          <section className="ohdsi-seminars">
            <h2>Seminar Series</h2>
            <p className="seminars-intro">
              Join our regular seminar series featuring expert speakers discussing OHDSI tools, 
              methodologies, and real-world evidence research.
            </p>

            {/* Upcoming Seminars */}
            {upcomingSeminars.length > 0 && (
              <div className="seminars-section">
                <h3 className="seminars-section-title">Upcoming Seminars</h3>
                <div className="seminars-grid">
                  {upcomingSeminars.map((seminar) => (
                    <div key={seminar.id} className="seminar-card upcoming">
                      {seminar.flyerImage && (
                        <div className="seminar-flyer" onClick={() => openFlyerModal(seminar.flyerImage)}>
                          <img src={seminar.flyerImage} alt={seminar.title} />
                          <div className="flyer-overlay">
                            <span>Click to view</span>
                          </div>
                        </div>
                      )}
                      <div className="seminar-info">
                        <h4>{seminar.title}</h4>
                        <div className="seminar-details">
                          <p className="seminar-date">
                            <strong>📅 {seminar.date}</strong>
                            {seminar.time && <span> at {seminar.time}</span>}
                          </p>
                          <p className="seminar-speaker">
                            <strong>👤 Speaker:</strong> {seminar.speaker}
                          </p>
                          {seminar.description && (
                            <p className="seminar-description">{seminar.description}</p>
                          )}
                        </div>
                        {seminar.teamsLink && (
                          <a 
                            href={seminar.teamsLink} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="seminar-button teams-button"
                          >
                            Join Teams Meeting
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Past Seminars */}
            {pastSeminars.length > 0 && (
              <div className="seminars-section">
                <h3 className="seminars-section-title">Past Seminars</h3>
                <div className="seminars-grid">
                  {pastSeminars.map((seminar) => (
                    <div key={seminar.id} className="seminar-card past">
                      {seminar.flyerImage && (
                        <div className="seminar-flyer" onClick={() => openFlyerModal(seminar.flyerImage)}>
                          <img src={seminar.flyerImage} alt={seminar.title} />
                          <div className="flyer-overlay">
                            <span>Click to view</span>
                          </div>
                        </div>
                      )}
                      <div className="seminar-info">
                        <h4>{seminar.title}</h4>
                        <div className="seminar-details">
                          <p className="seminar-date">
                            <strong>📅 {seminar.date}</strong>
                          </p>
                          <p className="seminar-speaker">
                            <strong>👤 Speaker:</strong> {seminar.speaker}
                          </p>
                          {seminar.description && (
                            <p className="seminar-description">{seminar.description}</p>
                          )}
                        </div>
                        {seminar.recordingLink && (
                          <a 
                            href={seminar.recordingLink} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="seminar-button recording-button"
                          >
                            Watch Recording
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Resources Section */}
        <section className="ohdsi-resources">
          <h2>Resources & Information</h2>
          <div className="resources-grid">
            <div className="resource-card">
              <h3>
                <a href="https://www.ohdsi-europe.org/index.php/national-nodes/ireland" 
                   target="_blank" rel="noopener noreferrer">
                  OHDSI Ireland Node
                </a>
              </h3>
              <p>
                Complete list of node members and related publications on the official 
                OHDSI Europe website.
              </p>
            </div>
            <div className="resource-card">
              <h3>
                <a href="https://www.ohdsi.org/join-the-journey/" 
                   target="_blank" rel="noopener noreferrer">
                  Join the Journey
                </a>
              </h3>
              <p>
                New to OHDSI? Start here to find comprehensive information about 
                getting involved in the community.
              </p>
            </div>
            <div className="resource-card">
              <h3>
                <a href="https://www.ehealth4cancer.ie/#/blog/Ke0b0Mr3iBRZYE3j2mo2" 
                   target="_blank" rel="noopener noreferrer">
                  Newcomers Guide
                </a>
              </h3>
              <p>
                A comprehensive starter guide written by eHealth-Hub team member Marina 
                for those new to OHDSI.
              </p>
            </div>
            <div className="resource-card">
              <h3>
                <a href="https://ohdsi.github.io/TheBookOfOhdsi/" 
                   target="_blank" rel="noopener noreferrer">
                  The Book of OHDSI
                </a>
              </h3>
              <p>
                Complete documentation describing the OHDSI community, data standards, 
                and analytical tools.
              </p>
            </div>
            <div className="resource-card">
              <h3>
                <a href="https://www.ohdsi.org/workgroups/" 
                   target="_blank" rel="noopener noreferrer">
                  Working Groups
                </a>
              </h3>
              <p>
                Explore various OHDSI working groups and find opportunities to contribute 
                to specific research areas.
              </p>
            </div>
          </div>
        </section>

        {/* Get Involved Section */}
        <section id="get-involved" className="ohdsi-get-involved">
          <h2>Get Involved</h2>
          <p>
            Everyone is welcome to actively participate in OHDSI, whether you are a patient, 
            a health professional, a researcher, or someone who simply believes in our cause. 
            Join our growing community and help advance real-world evidence research in Ireland.
          </p>
          
          <div className="meeting-info">
            <div className="meeting-card">
              <h3>Join Our Regular Meetings</h3>
              <p className="meeting-schedule">
                <strong>OHDSI Ireland meets every first Friday of the month</strong>
              </p>
              <a 
                href="https://teams.microsoft.com/l/meetup-join/19%3ameeting_YjQxYjM0N2QtNGNmYy00NzA5LWI0ODItMzY5YTg4YmU2NGQz%40thread.v2/0?context=%7b%22Tid%22%3a%220084b924-3ab4-4116-9251-9939f695e54c%22%2c%22Oid%22%3a%22189dbe0d-f9e9-4dbb-a927-067b84929cd4%22%7d"
                target="_blank" 
                rel="noopener noreferrer"
                className="teams-meeting-button"
              >
                Join OHDSI Ireland Meeting
              </a>
            </div>
          </div>
          
          <a href="mailto:ehealth@ul.ie" className="contact-button">
            Contact Us
          </a>
        </section>
      </div>

      {/* Flyer Modal */}
      {selectedFlyer && (
        <div className="flyer-modal" onClick={closeFlyerModal}>
          <div className="flyer-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="flyer-modal-close" onClick={closeFlyerModal}>×</button>
            <img src={selectedFlyer} alt="Seminar Flyer" />
          </div>
        </div>
      )}
    </div>
  );
};

export default OHDSIIreland;