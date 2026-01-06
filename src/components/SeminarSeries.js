import React, { useEffect, useState } from 'react';
import './SeminarSeries.css';
import { getSeminarsByStatus } from '../services/ohdsiSeminarService';

const SeminarSeries = () => {
  const [upcomingSeminars, setUpcomingSeminars] = useState([]);
  const [pastSeminars, setPastSeminars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFlyer, setSelectedFlyer] = useState(null);

  useEffect(() => {
    loadSeminars();
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

  const openFlyerModal = (flyerUrl) => {
    setSelectedFlyer(flyerUrl);
  };

  const closeFlyerModal = () => {
    setSelectedFlyer(null);
  };

  return (
    <div className="seminar-series-page">
      {/* Hero Section */}
      <section className="seminar-hero">
        <div className="seminar-hero-content">
          <h1>OHDSI Ireland Seminar Series</h1>
          <p>Join our regular seminar series featuring expert speakers discussing OHDSI tools, methodologies, and real-world evidence research.</p>
        </div>
      </section>

      {/* Main Content */}
      <div className="seminar-series-content">
        {loading && <div className="loading">Loading seminars...</div>}

        {/* Upcoming Seminars */}
        {!loading && upcomingSeminars.length > 0 && (
          <section className="seminars-section">
            <h2 className="seminars-section-title">Upcoming Seminars</h2>
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
                    <h3>{seminar.title}</h3>
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
          </section>
        )}

        {/* Past Seminars */}
        {!loading && pastSeminars.length > 0 && (
          <section className="seminars-section">
            <h2 className="seminars-section-title">Past Seminars</h2>
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
                    <h3>{seminar.title}</h3>
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
                    <div className="seminar-buttons">
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
                      {seminar.slidesLink && (
                        <a 
                          href={seminar.slidesLink} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="seminar-button slides-button"
                        >
                          View Slides
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {!loading && upcomingSeminars.length === 0 && pastSeminars.length === 0 && (
          <div className="no-seminars">
            <p>No seminars scheduled at the moment. Check back soon!</p>
          </div>
        )}
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

export default SeminarSeries;