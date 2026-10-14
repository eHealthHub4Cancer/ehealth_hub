import React, { useEffect, useState } from 'react';
import { getAllBlogPosts } from '../services/BlogService';
import { getAllArticles } from '../services/newsService';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, Users, Newspaper, BookOpen, ChevronDown } from 'lucide-react';
import { publicPages } from '../seo/pages';
import hiddenPages from '../seo/hiddenPages.json';
import { useGlobalData } from './globaldatacontext';
import './SiteMap.css';

export default function SiteMap() {
  const { people, peopleLoading } = useGlobalData();
  const [articles, setArticles] = useState([]);
  useEffect(() => {
    let active = true;
    Promise.allSettled([getAllBlogPosts('published'), getAllArticles(true)]).then(results => {
      if (!active) return;
      const links = [];
      if (results[0].status === 'fulfilled') links.push(...results[0].value.map(post => ({ path: `/blog/${post.id}`, title: post.title, type: 'blog' })));
      if (results[1].status === 'fulfilled') links.push(...results[1].value.filter(article => article.slug).map(article => ({ path: `/news/${article.slug}`, title: article.title, type: 'news' })));
      setArticles(links);
    });
    return () => { active = false; };
  }, []);
  const pages = publicPages.filter(([path]) => path !== '/sitemap' && !hiddenPages.includes(path));
  const profiles = (people || []).filter(person => person.slug)
    .map(person => ({ path: `/people/${person.slug}`, title: person.full_title_name || person.full_name }))
    .sort((a, b) => (a.title || '').localeCompare(b.title || ''));
  const sections = [
    { id: 'pages', title: 'Explore the website', description: 'The hub, our research, events and resources.', Icon: Compass, links: pages.map(([path, title]) => ({ path, title: path === '/' ? 'Home' : title })) },
    { id: 'profiles', title: 'Researcher profiles', description: 'Meet the people behind our research.', Icon: Users, links: profiles, loading: peopleLoading },
    { id: 'news', title: 'News', description: 'Updates from the hub and our partners.', Icon: Newspaper, links: articles.filter(article => article.type === 'news') },
    { id: 'blog', title: 'Research blog', description: 'Perspectives from our research community.', Icon: BookOpen, links: articles.filter(article => article.type === 'blog') },
  ];

  return (
    <div className="public-site-map">
      <header className="sitemap-intro">
        <span className="sitemap-eyebrow">Explore eHealth Hub</span>
        <h1>Site Map</h1>
        <p>Find your way around our research, people and latest updates.</p>
      </header>
      <nav className="sitemap-jump-links" aria-label="Site map sections">
        {sections.filter(section => section.links.length || section.loading).map(({ id, title }) => (
          <a key={id} href={`#sitemap-${id}`} onClick={() => {
            const section = document.getElementById(`sitemap-${id}`);
            if (section) section.open = true;
          }}>{title}</a>
        ))}
      </nav>
      <div className="sitemap-sections">
        {sections.filter(section => section.links.length || section.loading).map(({ id, title, description, Icon, links, loading }) => (
          <details className="sitemap-section" id={`sitemap-${id}`} key={id} open={id === 'pages'} aria-labelledby={`sitemap-heading-${id}`}>
            <summary className="sitemap-section-header">
              <span className="sitemap-section-icon"><Icon size={24} aria-hidden="true" /></span>
              <div><h2 id={`sitemap-heading-${id}`}>{title}</h2><p>{description}</p></div>
              {!loading && <span className="sitemap-count" aria-label={`${links.length} links`}>{links.length}</span>}
              <ChevronDown className="sitemap-chevron" size={20} aria-hidden="true" />
            </summary>
            {loading && <p role="status">Loading profiles…</p>}
            <ul>{links.map(({ path, title: linkTitle }) => (
              <li key={path}><Link to={path}><span>{linkTitle}</span><ArrowRight size={17} aria-hidden="true" /></Link></li>
            ))}</ul>
          </details>
        ))}
      </div>
    </div>
  );
}
