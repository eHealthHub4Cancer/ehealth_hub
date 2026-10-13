const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const pages = require('../src/seo/publicPages.json');
const root = path.resolve(__dirname, '..');
for (const file of ['.env.production.local', '.env.local', '.env.production', '.env']) dotenv.config({ path: path.join(root, file), quiet: true });
const origin = 'https://www.ehealth4cancer.ie';
const siteName = 'eHealth Hub for Cancer';
const escape = text => String(text || '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
async function json(url, options = {}) {
  const response = await fetch(url, { ...options, signal: AbortSignal.timeout(20000) });
  if (!response.ok) throw new Error(`Public content request failed (${response.status})`);
  return response.json();
}
async function publishedCollection(collection, field, value) {
  const project = process.env.REACT_APP_FIREBASE_PROJECT_ID;
  if (!project || project.startsWith('your_')) throw new Error('Firebase project configuration is required to build the article sitemap.');
  const result = await json(`https://firestore.googleapis.com/v1/projects/${encodeURIComponent(project)}/databases/(default)/documents:runQuery`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ structuredQuery: { from: [{ collectionId: collection }], where: { fieldFilter: { field: { fieldPath: field }, op: 'EQUAL', value } } } }),
  });
  return result.filter(row => row.document).map(row => ({ id: row.document.name.split('/').pop(), fields: row.document.fields }));
}
async function main() {
  const build = path.join(root, 'build');
  const template = fs.readFileSync(path.join(build, 'index.html'), 'utf8')
    .replace(/<link rel="canonical"[^>]*>/g, '')
    .replace(/<meta property="og:(?:title|description|url)"[^>]*>/g, '')
    .replace(/<div id="root">[\s\S]*?<\/div>/, '<div id="root"></div>');
  const records = pages.map(([route, title, description]) => ({ route, title, description }));
  const apiSource = fs.readFileSync(path.join(root, 'src/components/api/config.js'), 'utf8');
  const api = apiSource.match(/^const API_ROOT = "([^"]+)"/m)?.[1];
  if (!api || /localhost|127\.0\.0\.1/.test(api)) throw new Error('Set API_ROOT to the production API before building a deployment.');
  const [people, blogs, news] = await Promise.all([
    json(`${api}/people/`),
    publishedCollection('blogPosts', 'status', { stringValue: 'published' }),
    publishedCollection('news_articles', 'published', { booleanValue: true }),
  ]);
  if (!Array.isArray(people)) throw new Error('People API must return a public profile list.');
  for (const person of people) if (person.slug) records.push({ route: `/people/${encodeURIComponent(person.slug)}`, title: person.full_title_name || person.full_name, description: [person.full_title_name || person.full_name, person.association].filter(Boolean).join(' — ') });
  for (const post of blogs) records.push({ route: `/blog/${encodeURIComponent(post.id)}`, title: post.fields.title?.stringValue || 'Research article', description: 'Research insights and perspectives from the eHealth Hub for Cancer.' });
  for (const article of news) if (article.fields.slug?.stringValue) records.push({ route: `/news/${encodeURIComponent(article.fields.slug.stringValue)}`, title: article.fields.title?.stringValue || 'News article', description: 'News and updates from the eHealth Hub for Cancer.' });
  // Include the static news pages that remain linked in the archive.
  const app = fs.readFileSync(path.join(root, 'src/App.js'), 'utf8');
  for (const [, route] of app.matchAll(/<Route path="(\/news-archive\/[^:"]+)"/g)) records.push({ route, title: route.split('/').pop().split('-').map(word => word[0].toUpperCase() + word.slice(1)).join(' '), description: 'Archived research news from the eHealth Hub for Cancer.' });
  const unique = [...new Map(records.map(record => [record.route, record])).values()];
  const navigation = `<nav aria-label="Website pages"><ul>${pages.map(([route, title]) => `<li><a href="${route === '/' ? '/' : route + '/'}">${escape(title)}</a></li>`).join('')}</ul></nav>`;
  for (const record of unique) {
    const canonical = `${origin}${record.route === '/' ? '/' : record.route + '/'}`;
    let html = template.replace(/<title>.*?<\/title>/, `<title>${escape(record.title)} | ${siteName}</title>`);
    html = html.replace(/<meta name="description" content="[^"]*"\s*\/?\s*>/, `<meta name="description" content="${escape(record.description)}"/>`);
    html = html.replace('</head>', `<link rel="canonical" href="${canonical}"/><meta property="og:title" content="${escape(record.title)} | ${siteName}"/><meta property="og:description" content="${escape(record.description)}"/><meta property="og:url" content="${canonical}"/></head>`);
    html = html.replace('<div id="root"></div>', `<div id="root"><main class="seo-loading-shell"><h1>${escape(record.title)}</h1><p>${escape(record.description)}</p>${navigation}</main></div>`);
    const folder = path.join(build, record.route.slice(1));
    fs.mkdirSync(folder, { recursive: true });
    fs.writeFileSync(path.join(folder, 'index.html'), html);
  }
  // Preserve previously published news-new URLs without duplicate sitemap entries.
  for (const record of unique.filter(record => record.route === '/news' || record.route.startsWith('/news/'))) {
    const legacy = record.route.replace('/news', '/news-new');
    const folder = path.join(build, legacy.slice(1));
    fs.mkdirSync(folder, { recursive: true });
    fs.writeFileSync(path.join(folder, 'index.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=${escape(record.route + '/')}"/><link rel="canonical" href="${origin}${escape(record.route + '/')}"/><title>News | ${siteName}</title></head><body><a href="${escape(record.route + '/')}">Continue to News</a></body></html>`);
  }
  // Unknown/deep private routes still load the router via GitHub Pages' fallback.
  fs.writeFileSync(path.join(build, '404.html'), template.replace('</head>', '<meta name="robots" content="noindex"/></head>'));
  fs.writeFileSync(path.join(build, '.nojekyll'), '');
  fs.writeFileSync(path.join(build, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${unique.map(record => `  <url><loc>${escape(origin + (record.route === '/' ? '/' : record.route + '/'))}</loc></url>`).join('\n')}\n</urlset>\n`);
  fs.writeFileSync(path.join(build, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /blog-editor/\nDisallow: /blog-dashboard/\nDisallow: /blog-admin/\nDisallow: /login/\n\nSitemap: ${origin}/sitemap.xml\n`);
  console.log(`Generated ${unique.length} public page entry files and sitemap URLs. Private pages excluded.`);
}
main().catch(error => { console.error(`SEO build failed: ${error.message}`); process.exitCode = 1; });
