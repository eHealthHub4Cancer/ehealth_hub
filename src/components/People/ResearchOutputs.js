import React, { useId, useState } from 'react';
import { ChevronDown, ExternalLink } from 'lucide-react';
import ExpandableList from './ExpandableList';

function ResearchOutput({ link }) {
  const [expanded, setExpanded] = useState(false);
  const id = useId();
  const hasDetails = Boolean(link.authors || link.date || link.venue || link.location || link.doi || link.description);
  return (
    <article className="person-output">
      <div className="person-output-row">
        <span className="person-output-title">{link.title}</span>
        <a href={link.url} target="_blank" rel="noopener noreferrer" className="person-output-action" aria-label={`Open ${link.title} in a new tab`} title="Open in a new tab"><ExternalLink size={18} aria-hidden="true" /></a>
        {hasDetails && <button type="button" className="person-output-action" aria-expanded={expanded} aria-controls={id} aria-label={`${expanded ? 'Hide' : 'Show'} details for ${link.title}`} onClick={() => setExpanded(value => !value)}><ChevronDown size={20} aria-hidden="true" /></button>}
      </div>
      {expanded && <div id={id} className="person-output-details">
        <dl>
          {[
            ['Authors', link.authors],
            ['Date', link.date && new Date(`${link.date}T00:00:00`).toLocaleDateString('en-IE', { day: 'numeric', month: 'short', year: 'numeric' })],
            ['Venue', link.venue], ['Location', link.location], ['DOI', link.doi],
          ].filter(([, value]) => value).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
        </dl>
        {link.description && <p>{link.description}</p>}
      </div>}
    </article>
  );
}

export default function ResearchOutputs({ heading, links }) {
  const [expanded, setExpanded] = useState(false);
  const id = useId();
  return (
    <section className="content-section research-output-section">
      <h2 className="person-output-heading"><button type="button" className="person-output-toggle" aria-expanded={expanded} aria-controls={id} onClick={() => setExpanded(value => !value)}>
        <span>{heading} <span className="person-output-count">{links.length}</span></span><ChevronDown size={22} aria-hidden="true" />
      </button></h2>
      {expanded && <div id={id} className="person-output-list"><ExpandableList className="person-output-items" label={heading.toLowerCase()} limit={7} mobileLimit={5}>{links.map(link => <ResearchOutput key={link.id || link.url} link={link} />)}</ExpandableList></div>}
    </section>
  );
}
