import React, { useId, useState } from 'react';
import { UserRound } from 'lucide-react';
import { authorNames, authorInitials } from './blogPresentation';
import './AuthorAvatars.css';

const NamedAuthor = ({ name, unknown = false, icon = false }) => <div className="blog-named-author"><span className="blog-initials-badge" aria-hidden="true">{icon ? <UserRound size={18} aria-hidden="true" /> : unknown ? '?' : authorInitials(name)}</span><span className="blog-initials-name">{name}</span></div>;

export default function AuthorAvatars({ authors, showAll = false, icon = false }) {
  const names = authorNames(authors);
  const [expanded, setExpanded] = useState(false);
  const id = useId();
  if (icon) return <div className="blog-author-summary"><UserRound size={18} aria-hidden="true" /><span>{names.length ? names.join(', ') : 'Unknown author'}</span></div>;
  if (showAll) return <div className="blog-initials-group">{(names.length ? names : ['Unknown author']).map((name, index) => <NamedAuthor key={`${name}-${index}`} name={name} unknown={!names.length} icon={icon} />)}</div>;
  return <div className="blog-initials-group" onClick={event => event.stopPropagation()}>
    <NamedAuthor name={names[0] || 'Unknown author'} unknown={!names.length} />
    {names.length > 1 && <>
      <button type="button" className="blog-other-authors-toggle" aria-expanded={expanded} aria-controls={id} onClick={() => setExpanded(value => !value)}>
        {expanded ? 'Hide other authors' : `Other authors (${names.length - 1})`} <span aria-hidden="true">{expanded ? '▴' : '▾'}</span>
      </button>
      {expanded && <div id={id} className="blog-other-authors">{names.slice(1).map((name, index) => <NamedAuthor key={`${name}-${index}`} name={name} />)}</div>}
    </>}
  </div>;
}
