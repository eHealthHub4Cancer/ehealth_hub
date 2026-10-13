import { marked } from 'marked';
import DOMPurify from 'dompurify';

export function blogPreview(content, maxLength = 120) {
  if (!content) return 'No preview available';
  const container = document.createElement('div');
  container.innerHTML = DOMPurify.sanitize(marked.parse(String(content)), { FORBID_TAGS: ['script', 'style'] });
  container.querySelectorAll('br').forEach(node => node.replaceWith(document.createTextNode(' ')));
  container.querySelectorAll('p, div, li, h1, h2, h3, h4, h5, h6, blockquote').forEach(node => node.appendChild(document.createTextNode(' ')));
  const text = (container.textContent || '').replace(/\s+/g, ' ').trim();
  return text ? (text.length > maxLength ? `${text.slice(0, maxLength).trimEnd()}…` : text) : 'No preview available';
}

export function authorNames(authors) {
  return (Array.isArray(authors) ? authors : String(authors || '').split(/\s*(?:,|;|&|\band\b|\n)\s*/i)).map(name => String(name).trim()).filter(Boolean);
}

export function authorInitials(name) {
  const parts = name.replace(/^(?:(?:prof(?:essor)?|dr|mr|mrs|ms)\.?\s+)+/i, '').trim().split(/\s+/).filter(Boolean);
  return parts.length ? (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase() : '?';
}
