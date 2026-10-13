import React from 'react';
import { Link } from 'react-router-dom';
import './EuropeanResearch.css';

// Links our EU health data work from key pages so readers (and search engines)
// can reach these articles directly. Paths must match published news slugs.
const items = [
  {
    path: '/news/preparing-for-EHDS',
    label: 'European Health Data Space (EHDS)',
    title: 'Preparing for the European Health Data Space',
  },
  {
    path: '/news/ul-leads-ireland-in-eu-candle-cancer-data-project',
    label: 'CANDLE',
    title: "University of Limerick to lead Ireland's participation in the EU-funded CANDLE cancer data initiative",
  },
  {
    path: '/news/university-of-limerick-researcher-joins-european-discussions-on-personalised-cancer-prevention-and-care',
    label: 'Personalised cancer medicine',
    title: 'University of Limerick joins European discussions on personalised cancer prevention and care',
  },
  {
    path: '/ohdsi-ireland',
    label: 'OHDSI Ireland',
    title: 'The all-island national node for observational health data and real-world evidence',
  },
];

export default function EuropeanResearch() {
  return (
    <section className="european-research" aria-labelledby="european-research-title">
      <div className="european-research-inner">
        <h2 id="european-research-title">European health data research at the University of Limerick</h2>
        <div className="european-research-accent" />
        <p className="european-research-intro">
          Led by the University of Limerick and Queen's University Belfast, the eHealth Hub for Cancer works with
          European partners on cancer data standards and Ireland's readiness for the European Health Data Space.
        </p>
        <ul className="european-research-list">
          {items.map(item => (
            <li key={item.path}>
              <Link to={item.path} className="european-research-card">
                <span className="european-research-label">{item.label}</span>
                <span className="european-research-card-title">{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
