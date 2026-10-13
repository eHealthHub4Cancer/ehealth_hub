import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { routeMetadata, SITE_NAME, SITE_ORIGIN } from './pages';

function meta(name, content, property = false) {
  const attribute = property ? 'property' : 'name';
  let element = document.head.querySelector(`meta[${attribute}="${name}"]`);
  if (!element) { element = document.createElement('meta'); element.setAttribute(attribute, name); document.head.appendChild(element); }
  element.setAttribute('content', content);
}

const normalise = path => path.replace(/\/$/, '') || '/';
// Article and profile pages arrive pre-rendered with their own description;
// keep it for the page that was opened instead of replacing it with a generic one.
let opened = null;

export default function PageMetadata() {
  const { pathname } = useLocation();
  useEffect(() => {
    const data = routeMetadata(pathname);
    if (!opened) opened = { path: normalise(pathname), description: document.head.querySelector('meta[name="description"]')?.getAttribute('content') };
    const update = () => {
      const heading = data.dynamic ? document.querySelector('.main-content h1')?.textContent?.trim() : '';
      const isLoading = !heading || /^(loading|profile not found|not found)/i.test(heading);
      const label = !isLoading ? heading : data.title;
      const title = `${label} | ${SITE_NAME}`;
      if (document.title !== title) document.title = title;
      let canonical = document.head.querySelector('link[rel="canonical"]');
      if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
      canonical.href = `${SITE_ORIGIN}${pathname === '/' ? '/' : pathname.replace(/\/$/, '') + '/'}`;
      meta('og:url', canonical.href, true);
      const description = data.dynamic && normalise(pathname) === opened.path && opened.description ? opened.description : data.description;
      meta('description', description);
      meta('robots', data.private ? 'noindex, nofollow' : 'index, follow');
      meta('og:title', title, true);
      meta('og:description', description, true);
      meta('og:type', /^\/(blog|news|news-new)\//.test(pathname) ? 'article' : 'website', true);
      meta('twitter:card', 'summary');
      meta('twitter:title', title);
      meta('twitter:description', description);
    };
    update();
    const content = document.querySelector('.main-content');
    const observer = new MutationObserver(update);
    if (content && data.dynamic) observer.observe(content, { subtree: true, childList: true, characterData: true });
    return () => observer.disconnect();
  }, [pathname]);
  return null;
}
