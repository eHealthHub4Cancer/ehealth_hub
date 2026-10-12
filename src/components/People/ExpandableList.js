import React, { Children, useEffect, useId, useState } from 'react';

export default function ExpandableList({ children, limit = 6, mobileLimit = limit, label, className, as: Container = 'div' }) {
  const [expanded, setExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(() => typeof window.matchMedia === 'function' && window.matchMedia('(max-width: 600px)').matches);
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const query = window.matchMedia('(max-width: 600px)');
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  const visibleLimit = isMobile ? mobileLimit : limit;
  const id = useId();
  const items = Children.toArray(children);
  const canExpand = items.length > visibleLimit;
  return (
    <div className="profile-expandable-list">
      <Container id={id} className={className}>{expanded ? items : items.slice(0, visibleLimit)}</Container>
      {canExpand && (
        <button type="button" className="profile-view-all" aria-expanded={expanded} aria-controls={id} aria-label={`${expanded ? 'Show fewer' : 'View all'} ${label} (${items.length})`} onClick={() => setExpanded(value => !value)}>
          {expanded ? 'Show less' : `View all (${items.length})`}
        </button>
      )}
    </div>
  );
}
