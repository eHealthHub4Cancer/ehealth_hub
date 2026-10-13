const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const pages = require('../src/seo/publicPages.json');
// Pages that still load but are hidden from the menu or duplicate other pages.
const hiddenPages = new Set(require('../src/seo/hiddenPages.json'));
const root = path.resolve(__dirname, '..');
for (const file of ['.env.production.local', '.env.local', '.env.production', '.env']) dotenv.config({ path: path.join(root, file), quiet: true });
const origin = 'https://www.ehealth4cancer.ie';
const siteName = 'eHealth Hub for Cancer';
const escape = text => String(text || '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const entities = { amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'", nbsp: ' ', rsquo: "'", lsquo: "'", rdquo: '"', ldquo: '"', ndash: '–', mdash: '—', hellip: '…' };
const accents = { acute: '\u0301', grave: '\u0300', circ: '\u0302', uml: '\u0308', tilde: '\u0303', cedil: '\u0327' };
// Decode named (incl. accented letters such as &iacute; in Irish names) and numeric entities.
const decodeEntity = (match, name) => {
  if (entities[name] !== undefined) return entities[name];
  if (/^#x[0-9a-f]+$/i.test(name)) return String.fromCodePoint(parseInt(name.slice(2), 16));
  if (/^#\d+$/.test(name)) return String.fromCodePoint(parseInt(name.slice(1), 10));
  const accented = name.match(/^([a-zA-Z])(acute|grave|circ|uml|tilde|cedil)$/);
  return accented ? (accented[1] + accents[accented[2]]).normalize('NFC') : match;
};
// Plain text from stored rich-text HTML, keeping paragraph breaks.
const textFrom = html => String(html || '')
  .replace(/<(script|style)[\s\S]*?<\/\1>/gi, '')
  .replace(/<\/(p|div|h[1-6]|li|blockquote)>|<br\s*\/?>/gi, '\n')
  .replace(/<[^>]+>/g, '')
  .replace(/&(#?\w+);/g, decodeEntity)
  .split('\n').map(line => line.replace(/\s+/g, ' ').trim()).filter(Boolean).join('\n');
// Search-result length summary (Google shows about 155 characters).
const summary = (text, fallback) => {
  const clean = textFrom(text).replace(/\n/g, ' ');
  if (!clean) return fallback;
  return clean.length <= 160 ? clean : `${clean.slice(0, 157).replace(/\s+\S*$/, '')}…`;
};
// Escaped paragraphs for the pre-rendered page body that crawlers read before the app loads.
const paragraphs = html => textFrom(html).split('\n').map(line => `<p>${escape(line)}</p>`).join('');
// YYYY-MM-DD for sitemap <lastmod>; empty when the source has no usable date.
const isoDate = value => { const date = new Date(value); return value && !isNaN(date) ? date.toISOString().slice(0, 10) : ''; };
// Article dates are free text ("April 10, 2026", "30/04/2026"); returns ISO or ''.
const articleDate = value => {
  const text = String(value || '').trim();
  const dmy = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  const date = dmy ? new Date(Date.UTC(dmy[3], dmy[2] - 1, dmy[1])) : new Date(text);
  return text && !isNaN(date) ? date.toISOString().slice(0, 10) : '';
};
const organizationRef = { '@id': `${origin}/#organization` };
// JSON-LD script tag; "<" is escaped so content can never close the script early.
const jsonLd = data => `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
const universities = [
  ['University of Limerick', 'https://www.ul.ie/'],
  ["Queen's University Belfast", 'https://www.qub.ac.uk/'],
];
// Profile links stored as "[{'name': 'LinkedIn', 'url': 'https://...'}]".
const profileLinks = value => [...String(value || '').matchAll(/'url':\s*'(https?:\/\/[^']+)'/g)].map(match => match[1]);
async function json(url, options = {}) {
  const response = await fetch(url, { ...options, signal: AbortSignal.timeout(20000) });
  if (!response.ok) throw new Error(`Public content request failed (${response.status})`);
  return response.json();
}
// The people API stores lists as Python-style strings, e.g. "['Genomics', 'Machine Learning']".
const listFrom = value => Array.isArray(value) ? value.map(String) : [...String(value || '').matchAll(/'([^']*)'|"([^"]*)"/g)].map(match => match[1] ?? match[2]).filter(Boolean);
// Fetch profile details a few at a time; a failed profile keeps its short listing entry.
async function profileDetails(api, people) {
  const details = new Map();
  for (let i = 0; i < people.length; i += 8) {
    await Promise.all(people.slice(i, i + 8).filter(person => person.slug).map(async person => {
      try { details.set(person.slug, await json(`${api}/person-info/${encodeURIComponent(person.slug)}/`)); } catch (error) { console.warn(`Profile details unavailable for ${person.slug}: ${error.message}`); }
    }));
  }
  return details;
}
async function publishedCollection(collection, field, value) {
  const project = process.env.REACT_APP_FIREBASE_PROJECT_ID;
  if (!project || project.startsWith('your_')) throw new Error('Firebase project configuration is required to build the article sitemap.');
  const result = await json(`https://firestore.googleapis.com/v1/projects/${encodeURIComponent(project)}/databases/(default)/documents:runQuery`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ structuredQuery: { from: [{ collectionId: collection }], where: { fieldFilter: { field: { fieldPath: field }, op: 'EQUAL', value } } } }),
  });
  return result.filter(row => row.document).map(row => ({ id: row.document.name.split('/').pop(), fields: row.document.fields, updated: row.document.updateTime }));
}
// Archived static news pages that now live as Firebase articles under /news/.
const archivedNews = {
  'gender-inequality-study': 'new-study-highlights-significant-gender-inequality-and-bias-in-cancer-research',
  'good-friday-cancer-legacy': 'all-island-study-highlights-the-cancer-legacy-of-the-good-friday-agreement',
  'phd-opportunity': 'phd-advert',
  'belfast-agreement-showcase': 'belfast-agreement-25-cancer-showcase',
  'ldcrc-building-together': 'ldcrc-building-together-event',
  'dell-technologies-presentation': 'prof-mark-lawler-and-dell-technologies',
  'aicri-launch': 'aicri-launch',
  'ohdsi-meeting': 'ehealth-hub-at-the-ohdsi-2022-meeting',
  'hrb-conference': 'hrb-national-conference-2022',
  'bcni-talk': 'bcni-talk',
  'rte-brainstorm': 'rte-brainstorm-article',
  'postdoctoral-application': 'postdoctoral-researcher-in-cancer-digital-health',
  'limerick-post': 'limerickpost',
};
const redirectPage = (to, title) => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=${escape(to)}"/><link rel="canonical" href="${origin}${escape(to)}"/><title>${escape(title)} | ${siteName}</title></head><body><a href="${escape(to)}">Continue to ${escape(title)}</a></body></html>`;
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
  const profiles = await profileDetails(api, people);
  for (const person of people) {
    if (!person.slug) continue;
    const info = profiles.get(person.slug) || {};
    const name = person.full_title_name || person.full_name;
    const interests = listFrom(info.research_interests);
    const bio = textFrom(info.about_user);
    records.push({
      route: `/people/${encodeURIComponent(person.slug)}`,
      lastmod: info.updated_at || person.updated_at,
      image: person.image,
      structured: {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: textFrom(person.full_name || name),
        url: `${origin}/people/${encodeURIComponent(person.slug)}/`,
        ...(person.image ? { image: person.image } : {}),
        ...(person.association ? { jobTitle: textFrom(person.association) } : {}),
        worksFor: organizationRef,
        affiliation: universities.filter(([university]) => String(person.association || info.institution || '').includes(university)).map(([university, url]) => ({ '@type': 'CollegeOrUniversity', name: university, url })),
        ...(interests.length ? { knowsAbout: interests } : {}),
        ...(profileLinks(info.social_links).length ? { sameAs: profileLinks(info.social_links) } : {}),
      },
      title: name,
      description: summary([[name, person.association].filter(Boolean).join(', '), interests.length ? `Research interests: ${interests.join(', ')}.` : bio].filter(Boolean).join('. '), name),
      body: `${person.association ? `<p><strong>${escape(person.association)}</strong></p>` : ''}${interests.length ? `<p>Research interests: ${escape(interests.join(', '))}</p>` : ''}${paragraphs(info.about_user)}`,
    });
  }
  for (const post of blogs) {
    const f = post.fields;
    const authors = textFrom(f.authors?.stringValue);
    records.push({
      route: `/blog/${encodeURIComponent(post.id)}`,
      lastmod: post.updated,
      image: f.coverImage?.stringValue,
      structured: {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: (textFrom(f.title?.stringValue) || 'Research article').slice(0, 110),
        description: summary(f.content?.stringValue, ''),
        ...(f.coverImage?.stringValue ? { image: [f.coverImage.stringValue] } : {}),
        ...(isoDate(f.publishedAt?.timestampValue || f.createdAt?.timestampValue) ? { datePublished: isoDate(f.publishedAt?.timestampValue || f.createdAt?.timestampValue) } : {}),
        ...(isoDate(post.updated) ? { dateModified: isoDate(post.updated) } : {}),
        author: authors ? authors.split(/\s*(?:,|;|\band\b|&)\s*/).filter(Boolean).map(name => ({ '@type': 'Person', name })) : organizationRef,
        publisher: organizationRef,
        mainEntityOfPage: `${origin}/blog/${encodeURIComponent(post.id)}/`,
      },
      title: textFrom(f.title?.stringValue) || 'Research article',
      description: summary(f.content?.stringValue, 'Research insights and perspectives from the eHealth Hub for Cancer.'),
      body: `${authors ? `<p><em>${escape(authors)}</em></p>` : ''}${paragraphs(f.content?.stringValue)}`,
    });
  }
  for (const article of news) {
    const f = article.fields;
    if (!f.slug?.stringValue) continue;
    const byline = [f.date?.stringValue, f.author?.stringValue].filter(Boolean).map(escape).join(' · ');
    records.push({
      route: `/news/${encodeURIComponent(f.slug.stringValue)}`,
      lastmod: article.updated,
      image: f.imageUrl?.stringValue,
      structured: {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: textFrom(f.title?.stringValue).slice(0, 110),
        description: summary(f.excerpt?.stringValue || f.content?.stringValue, ''),
        ...(f.imageUrl?.stringValue ? { image: [f.imageUrl.stringValue] } : {}),
        ...(articleDate(f.date?.stringValue) ? { datePublished: articleDate(f.date.stringValue) } : {}),
        ...(isoDate(article.updated) ? { dateModified: isoDate(article.updated) } : {}),
        ...(f.author?.stringValue ? { author: { '@type': 'Person', name: f.author.stringValue } } : { author: organizationRef }),
        publisher: organizationRef,
        mainEntityOfPage: `${origin}/news/${encodeURIComponent(f.slug.stringValue)}/`,
      },
      title: f.title?.stringValue || 'News article',
      description: summary(f.excerpt?.stringValue || f.content?.stringValue, 'News and updates from the eHealth Hub for Cancer.'),
      body: `${byline ? `<p><em>${byline}</em></p>` : ''}${paragraphs(f.content?.stringValue || f.excerpt?.stringValue)}`,
    });
  }
  // Include the static news pages that remain linked in the archive.
  const app = fs.readFileSync(path.join(root, 'src/App.js'), 'utf8');
  for (const [, route] of app.matchAll(/<Route path="(\/news-archive\/[^:"]+)"/g)) if (!archivedNews[route.split('/').pop()]) records.push({ route, title: route.split('/').pop().split('-').map(word => word[0].toUpperCase() + word.slice(1)).join(' '), description: 'Archived research news from the eHealth Hub for Cancer.' });
  const unique = [...new Map(records.map(record => [record.route, record])).values()];
  const navigation = `<nav aria-label="Website pages"><ul>${pages.filter(([route]) => !hiddenPages.has(route)).map(([route, title]) => `<li><a href="${route === '/' ? '/' : route + '/'}">${escape(title)}</a></li>`).join('')}</ul></nav>`;
  // Replacements use functions so "$&"-style patterns in titles or text are inserted literally.
  for (const record of unique) {
    const canonical = `${origin}${record.route === '/' ? '/' : record.route + '/'}`;
    let html = template.replace(/<title>.*?<\/title>/, () => `<title>${escape(record.title)} | ${siteName}</title>`);
    html = html.replace(/<meta name="description" content="[^"]*"\s*\/?\s*>/, () => `<meta name="description" content="${escape(record.description)}"/>`);
    // Swap the default logo share image for the page's own image when it has one.
    if (/^https:\/\//.test(record.image || '')) {
      html = html.replace(/<meta (?:property="og:image(?::width|:height|:alt)?"|name="twitter:image")[^>]*>/g, '')
        .replace('</head>', () => `<meta property="og:image" content="${escape(record.image)}"/><meta name="twitter:image" content="${escape(record.image)}"/></head>`);
    }
    if (record.structured) html = html.replace('</head>', () => `${jsonLd(record.structured)}</head>`);
    html = html.replace('</head>', () => `<link rel="canonical" href="${canonical}"/><meta property="og:title" content="${escape(record.title)} | ${siteName}"/><meta property="og:description" content="${escape(record.description)}"/><meta property="og:url" content="${canonical}"/></head>`);
    html = html.replace('<div id="root"></div>', () => `<div id="root"><main class="seo-loading-shell"><h1>${escape(record.title)}</h1>${record.body || `<p>${escape(record.description)}</p>`}${navigation}</main></div>`);
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
  // Send archived duplicates to their /news/ article so search engines index one copy.
  for (const [old, slug] of Object.entries(archivedNews)) {
    const folder = path.join(build, 'news-archive', old);
    fs.mkdirSync(folder, { recursive: true });
    fs.writeFileSync(path.join(folder, 'index.html'), redirectPage(`/news/${slug}/`, 'News'));
  }
  // Unknown/deep private routes still load the router via GitHub Pages' fallback.
  fs.writeFileSync(path.join(build, '404.html'), template.replace('</head>', '<meta name="robots" content="noindex"/></head>'));
  fs.writeFileSync(path.join(build, '.nojekyll'), '');
  fs.writeFileSync(path.join(build, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${unique.filter(record => !hiddenPages.has(record.route)).map(record => `  <url><loc>${escape(origin + (record.route === '/' ? '/' : record.route + '/'))}</loc>${isoDate(record.lastmod) ? `<lastmod>${isoDate(record.lastmod)}</lastmod>` : ''}</url>`).join('\n')}\n</urlset>\n`);
  fs.writeFileSync(path.join(build, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /blog-editor/\nDisallow: /blog-dashboard/\nDisallow: /blog-admin/\nDisallow: /login/\n\nSitemap: ${origin}/sitemap.xml\n`);
  console.log(`Generated ${unique.length} public page entry files and sitemap URLs. Private pages excluded.`);
}
main().catch(error => { console.error(`SEO build failed: ${error.message}`); process.exitCode = 1; });
