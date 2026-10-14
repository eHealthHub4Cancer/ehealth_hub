import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, UserRound, ArrowUpRight } from 'lucide-react';
import './EuropeanResearch.css';
import candleLogo from '../Images/logo/CANDLE-official-light.svg';
import euFlag from '../Images/logo/eu-flag.svg';
import ohdsiIreland from '../Images/logo/OHDSI_Logo.png';

// Links our EU health data work from key pages so readers (and search engines)
// can reach these articles directly. Paths must match published news slugs.
const items = [
  {
    path: '/news/preparing-for-EHDS',
    label: 'European Health Data Space',
    logo: euFlag,
    logoAlt: "European Union flag",
    logoClass: "european-research-eu-flag",
    title: 'Preparing for the European Health Data Space',
  },
  {
    path: '/news/ul-leads-ireland-in-eu-candle-cancer-data-project',
    label: 'CANDLE',
    logo: candleLogo,
    logoAlt: "CANDLE project logo",
    title: "University of Limerick to lead Ireland's participation in the EU-funded CANDLE cancer data initiative",
  },
  {
    path: '/news/university-of-limerick-researcher-joins-european-discussions-on-personalised-cancer-prevention-and-care',
    label: 'Personalised cancer medicine',
    personalised: true,
    title: 'University of Limerick joins European discussions on personalised cancer prevention and care',
  },
  {
    path: '/ohdsi-ireland',
    label: 'OHDSI Ireland',
    logos: [{ src: ohdsiIreland, alt: 'OHDSI Ireland logo', className: 'ohdsi-ireland-mark' }],
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
          Led by the <strong>University of Limerick</strong> and <strong>Queen's University Belfast</strong>, the eHealth Hub for Cancer works with
          European partners on cancer data standards and Ireland's readiness for the European Health Data Space.
        </p>
        <ul className="european-research-list">
          {items.map(item => {
            const Icon = item.icon;
            return (
            <li key={item.path}>
              <article className="european-research-card">
              <Link to={item.path} className="european-research-card-main">
                <div className="european-research-card-header">
                  {item.personalised ? <span className="european-research-personalised-icon" aria-hidden="true"><UserRound size={30} strokeWidth={1.7} /><HeartPulse size={20} strokeWidth={1.8} /></span> : item.logos ? <span className="european-research-ohdsi-logos">{item.logos.map(mark => <img key={mark.alt} src={mark.src} alt={mark.alt} className={mark.className} />)}</span> : item.logo ? <span className={item.logoClass || "european-research-project-logo"}><img src={item.logo} alt={item.logoAlt} /></span> : <span className="european-research-icon"><Icon size={24} strokeWidth={1.8} aria-hidden="true" /></span>}
                  <ArrowUpRight size={19} className="european-research-link-icon" aria-hidden="true" />
                </div>
                <h3 className="european-research-label">{item.label}</h3>
                <p className="european-research-card-title">{item.title}</p>
              </Link>
              </article>
            </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
