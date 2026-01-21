import React, { useState } from 'react';
import './Resources.css';
import { ExternalLink, Database, GraduationCap, Globe, BookOpen, Building2, Github, Archive } from 'lucide-react';

const resourcesData = [
  {
    id: 1,
    title: 'EU 1+MG Genomic Data Infrastructure – Irish Node',
    description: 'The Irish Node of the European 1+ Million Genomes Initiative (1+MG), providing access to genomic data infrastructure across Europe.',
    url: 'https://genomicdata.ie/',
    icon: 'database',
    category: 'Data Infrastructure'
  },
  {
    id: 2,
    title: 'OHDSI-Ireland All-Island Node',
    description: 'The Irish national node of the Observational Health Data Sciences and Informatics (OHDSI) network, facilitating collaborative health data research.',
    url: 'https://www.ohdsi-europe.org/index.php/national-nodes/ireland',
    secondaryUrl: 'https://www.ehealth4cancer.ie/#/ohdsi-ireland',
    secondaryLabel: 'Monthly Seminars',
    icon: 'globe',
    category: 'Health Data Network'
  },
  {
    id: 3,
    title: 'CANDLE Project (EU Horizon 2025-2028)',
    description: 'EU Horizon program supporting establishment of National Cancer Data Nodes, aligned with the European Health Data Space (EHDS).',
    url: 'https://candle-project.eu/',
    icon: 'building',
    category: 'EU Project'
  },
  {
    id: 4,
    title: 'EHDS Ireland – Primary Care',
    description: 'European Health Data Space implementation in Ireland for patient data access through MyHealth@EU and myHealth@myHands initiatives.',
    url: 'https://www.ehealthireland.ie/',
    icon: 'globe',
    category: 'Patient Access'
  },
  {
    id: 5,
    title: 'EHDS Ireland – Secondary Use',
    description: 'HIQA leading the Health Data Access Body (HDAB) and data standards for research through HealthData@EU.',
    url: 'https://www.hiqa.ie/areas-we-work/health-information/healthdataie',
    icon: 'database',
    category: 'Research Data'
  }
];

const trainingData = [
  {
    id: 1,
    title: 'Introduction to Real World Data in Cancer Clinical Research',
    institution: 'University of Limerick',
    code: 'BM6053',
    url: 'https://www.ul.ie/gps/courses/introduction-to-real-world-data-in-cancer-clinical-research-module-bm6053'
  },
  {
    id: 2,
    title: 'Data Analytics for Cancer Real World Data Research',
    institution: 'University of Limerick',
    code: 'BM6063',
    url: 'https://www.ul.ie/gps/courses/data-analytics-for-cancer-real-world-data-research-module-bm6063'
  },
  {
    id: 3,
    title: 'Real World Data Epidemiology',
    institution: 'University of Oxford (NDORMS)',
    url: 'https://www.ndorms.ox.ac.uk/study/courses/real-world-data-epidemiology'
  },
  {
    id: 4,
    title: 'EHDEN Academy',
    institution: 'European Health Data & Evidence Network',
    description: 'Training for OMOP CDM and OHDSI tools',
    url: 'https://www.ehden.eu/'
  },
  {
    id: 5,
    title: 'SNOMED CT Education',
    institution: 'SNOMED International',
    description: 'Clinical terminology training',
    url: 'https://www.snomed.org/education'
  }
];

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

function Resources() {
  const [activeSection, setActiveSection] = useState('resources');

  const getIcon = (iconName) => {
    const iconProps = { size: 22, strokeWidth: 2 };
    switch (iconName) {
      case 'database':
        return <Database {...iconProps} />;
      case 'globe':
        return <Globe {...iconProps} />;
      case 'building':
        return <Building2 {...iconProps} />;
      default:
        return <Globe {...iconProps} />;
    }
  };

  return (
    <div className="resources-page">
      <div className="resources-header">
        <h1>Resources & Training</h1>
        <p>Key resources for health data infrastructure, European initiatives, and professional development.</p>

        <div className="tab-buttons">
          <button
            className={`tab-btn ${activeSection === 'resources' ? 'active' : ''}`}
            onClick={() => setActiveSection('resources')}
          >
            <Database size={18} />
            Resources
          </button>
          <button
            className={`tab-btn ${activeSection === 'training' ? 'active' : ''}`}
            onClick={() => setActiveSection('training')}
          >
            <GraduationCap size={18} />
            Training
          </button>
          <button
            className={`tab-btn ${activeSection === 'code' ? 'active' : ''}`}
            onClick={() => setActiveSection('code')}
          >
            <Github size={18} />
            Code & Data
          </button>
        </div>
      </div>

      <div className="resources-body">
        {/* Resources Section */}
        {activeSection === 'resources' && (
          <div className="resources-grid">
            {resourcesData.map(resource => (
              <article key={resource.id} className="resource-card">
                <div className="card-header">
                  <span className="card-icon">{getIcon(resource.icon)}</span>
                  <span className="card-category">{resource.category}</span>
                </div>
                <h3>{resource.title}</h3>
                <p>{resource.description}</p>
                <div className="card-links">
                  <a href={resource.url} target="_blank" rel="noopener noreferrer" className="primary-link">
                    Visit Website <ExternalLink size={14} />
                  </a>
                  {resource.secondaryUrl && (
                    <a href={resource.secondaryUrl} target="_blank" rel="noopener noreferrer" className="secondary-link">
                      <BookOpen size={14} /> {resource.secondaryLabel}
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Training Section */}
        {activeSection === 'training' && (
          <div className="training-list">
            {trainingData.map(course => (
              <a
                key={course.id}
                href={course.url}
                target="_blank"
                rel="noopener noreferrer"
                className="training-item"
              >
                <div className="training-icon">
                  <GraduationCap size={24} />
                </div>
                <div className="training-info">
                  <h3>{course.title}</h3>
                  <p className="training-meta">
                    {course.institution}
                    {course.code && <span className="course-code">{course.code}</span>}
                  </p>
                  {course.description && <p className="training-desc">{course.description}</p>}
                </div>
                <ExternalLink size={18} className="training-arrow" />
              </a>
            ))}
          </div>
        )}

        {/* Code & Data Section */}
        {activeSection === 'code' && (
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
        )}
      </div>
    </div>
  );
}

export default Resources;
