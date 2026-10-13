import publicPages from "./publicPages.json";
export const SITE_NAME = 'eHealth Hub for Cancer';
export const SITE_ORIGIN = 'https://www.ehealth4cancer.ie';
export { default as publicPages } from "./publicPages.json";

export function routeMetadata(pathname) {
  const path = pathname.replace(/\/$/, '') || '/';
  const page = publicPages.find(([url]) => url === path);
  if (page) return { title: page[1], description: page[2], private: false };
  const privatePage = /^\/(admin(?:\/|$)|blog-editor(?:\/|$)|blog-dashboard$|blog-admin$|login$)/.test(path);
  if (privatePage) {
    const title = path === '/login' ? 'Sign In' : path.startsWith('/blog-editor') ? 'Blog Editor' : 'Dashboard';
    return { title, description: 'Account access and administration for the eHealth Hub for Cancer.', private: true };
  }
  if (path.startsWith('/people/')) return { title: 'Researcher Profile', description: 'Learn about a researcher, their affiliations, research interests and outputs.', dynamic: true };
  if (path.startsWith('/blog/')) return { title: 'Research Article', description: 'Read research insights from the eHealth Hub for Cancer.', dynamic: true };
  if (/^\/(news|news-new|news-archive)\//.test(path)) return { title: 'News Article', description: 'Read news and research updates from the eHealth Hub for Cancer.', dynamic: true };
  if (path === '/all-island-forum') return routeMetadata('/forum');
  return { title: 'Page', description: publicPages[0][2], private: false };
}
