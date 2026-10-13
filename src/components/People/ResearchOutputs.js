import React, { useId, useState } from 'react';
import { ChevronDown, ExternalLink } from 'lucide-react';
import ExpandableList from './ExpandableList';

const categories = [
  ['publication', 'Publications', 'Publication'],
  ['poster', 'Posters', 'Poster'],
  ['presentation', 'Presentations', 'Presentation'],
  ['talk', 'Talks', 'Talk'],
  ['other', 'Other Outputs', 'Other output'],
];

function ResearchOutput({ link }) {
  const [expanded, setExpanded] = useState(false);
  const id = useId();
  const hasDetails = Boolean(link.authors || link.date || link.venue || link.location || link.doi || link.description);
  return (
    <article className="person-output">
      <div className="person-output-row">
        <div className="person-output-title-block"><span className="person-output-type">{categories.find(([category]) => category === link.category)?.[2] || 'Other output'}</span><span className="person-output-title">{link.title}</span></div>
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

export default function ResearchOutputs({ links }) {
  const validLinks = links.filter(link => /^https?:\/\//i.test(link.url)).map(link => ({ ...link, category: link.category || 'publication' }));
  const available = categories.filter(([category]) => validLinks.some(link => link.category === category));
  const [selected, setSelected] = useState(null);
  const activeCategories = selected === null ? available.slice(0, 1).map(([category]) => category) : selected;
  const filtered = validLinks.filter(link => activeCategories.includes(link.category));
  const toggleCategory = category => setSelected(previous => {
    const current = previous === null ? available.slice(0, 1).map(([value]) => value) : previous;
    return current.includes(category) ? current.filter(value => value !== category) : [...current, category];
  });
  const [expanded, setExpanded] = useState(false);
  const id = useId();
  if (!available.length) return null;
  return (
    <section className="content-section research-output-section">
      <h2 className="person-output-heading"><button type="button" className="person-output-toggle" aria-expanded={expanded} aria-controls={id} onClick={() => setExpanded(value => !value)}>
        <span>Research Outputs <span className="person-output-count">{validLinks.length}</span></span><ChevronDown size={22} aria-hidden="true" />
      </button></h2>
      {expanded && <div id={id} className="person-output-list">
        <div className="person-output-filters" role="group" aria-label="Output category">
          {available.map(([category, label]) => <button type="button" key={category} className="person-output-filter" aria-pressed={activeCategories.includes(category)} onClick={() => toggleCategory(category)}>{label}<span>{validLinks.filter(link => link.category === category).length}</span></button>)}
        </div>
        {filtered.length === 0 && <p className="person-output-empty">Select a category above to view research outputs.</p>}
        <ExpandableList key={activeCategories.join(',')} className="person-output-items" label="research outputs" limit={7} mobileLimit={5}>{filtered.map(link => <ResearchOutput key={link.id || link.url} link={link} />)}</ExpandableList>
      </div>}
    </section>
  );
}
