import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { routeMetadata, SITE_NAME, SITE_ORIGIN } from './pages';

function meta(name, content, property = false) {
  const attribute = property ? 'property' : 'name';
  let element = document.head.querySelector(`meta[${attribute}="${name}"]`);
  if (!element) { element = document.createElement('meta'); element.setAttribute(attribute, name); document.head.appendChild(element); }
  element.setAttribute('content', content);
}

export default function PageMetadata() {
  const { pathname } = useLocation();
  useEffect(() => {
    const data = routeMetadata(pathname);
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
      meta('description', data.description);
      meta('robots', data.private ? 'noindex, nofollow' : 'index, follow');
      meta('og:title', title, true);
      meta('og:description', data.description, true);
      meta('og:type', /^\/(blog|news|news-new)\//.test(pathname) ? 'article' : 'website', true);
      meta('twitter:card', 'summary');
      meta('twitter:title', title);
      meta('twitter:description', data.description);
    };
    update();
    const content = document.querySelector('.main-content');
    const observer = new MutationObserver(update);
    if (content && data.dynamic) observer.observe(content, { subtree: true, childList: true, characterData: true });
    return () => observer.disconnect();
  }, [pathname]);
  return null;
}
