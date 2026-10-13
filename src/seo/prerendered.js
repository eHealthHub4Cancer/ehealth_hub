import React from 'react';

// Pages built by scripts/build-seo.cjs arrive with their title and text already in #root.
// React replaces that on start-up, so keep a copy (minus the page-links nav) for the page
// that was opened, letting it stay visible to readers and search engines while data loads.
const normalise = path => path.replace(/\/$/, '') || '/';
const shell = typeof document !== 'undefined' ? document.querySelector('#root .seo-loading-shell') : null;
const openedPath = typeof window !== 'undefined' ? normalise(window.location.pathname) : null;
const openedHtml = (() => {
  if (!shell) return null;
  const copy = shell.cloneNode(true);
  copy.querySelectorAll('nav').forEach(nav => nav.remove());
  return copy.innerHTML.trim() || null;
})();

export function prerenderedHtml(pathname = window.location.pathname) {
  return openedHtml && normalise(pathname) === openedPath ? openedHtml : null;
}

// Content is generated and escaped at build time from our own data.
export function PrerenderedContent({ html }) {
  return <main className="seo-loading-shell" dangerouslySetInnerHTML={{ __html: html }} />;
}
