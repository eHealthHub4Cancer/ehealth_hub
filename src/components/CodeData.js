import React from 'react';
import { Github, Archive, ExternalLink } from 'lucide-react';
import './Resources.css';

const codeDataLinks = [
  {
    id: 1,
    title: 'GitHub Repository',
    description: 'Access our open-source code, tools, and projects developed by the eHealth-Hub for Cancer research team.',
    url: 'https://github.com/eHealthHub4Cancer',
    icon: 'github'
  },
  {
    id: 2,
    title: 'Zenodo Community',
    description: 'Browse and download our published datasets, research outputs, and archived materials with DOIs for citation.',
    url: 'https://zenodo.org/communities/ehealth4cancer/records?q=&l=list&p=1&s=10&sort=newest',
    icon: 'archive'
  }
];

export default function CodeData() {
  return (
    <div className="resources-page">
      <header className="resources-header">
        <h1>Code &amp; Data</h1>
        <p>Explore the code, datasets and archived research outputs from eHealthHub for Cancer.</p>
      </header>
          <div className="code-data-section">
            <div className="code-data-grid">
              {codeDataLinks.map(link => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`code-data-card ${link.icon}`}
                >
                  <div className="code-data-icon">
                    {link.icon === 'github' ? <Github size={40} /> : <Archive size={40} />}
                  </div>
                  <div className="code-data-content">
                    <h3>{link.title}</h3>
                    <p>{link.description}</p>
                  </div>
                  <div className="code-data-action">
                    <span>Visit</span>
                    <ExternalLink size={16} />
                  </div>
                </a>
              ))}
            </div>
          </div>
    </div>
  );
}
