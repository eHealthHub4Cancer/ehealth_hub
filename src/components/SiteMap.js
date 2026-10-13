import React, { useEffect, useState } from 'react';
import { getAllBlogPosts } from '../services/BlogService';
import { getAllArticles } from '../services/newsService';
import { Link } from 'react-router-dom';
import { publicPages } from '../seo/pages';
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
      if (results[0].status === 'fulfilled') links.push(...results[0].value.map(post => ({ path: `/blog/${post.id}`, title: post.title })));
      if (results[1].status === 'fulfilled') links.push(...results[1].value.filter(article => article.slug).map(article => ({ path: `/news-new/${article.slug}`, title: article.title })));
      setArticles(links);
    });
    return () => { active = false; };
  }, []);
  return <div className="public-site-map"><h1>Site Map</h1><p>Find public pages and meet our research community.</p><h2>Website pages</h2><ul>{publicPages.filter(([path]) => path !== '/sitemap').map(([path, title]) => <li key={path}><Link to={path}>{title}</Link></li>)}</ul><h2>Researcher profiles</h2>{peopleLoading && <p>Loading profiles…</p>}<ul>{(people || []).filter(person => person.slug).map(person => <li key={person.slug}><Link to={`/people/${person.slug}`}>{person.full_title_name || person.full_name}</Link></li>)}</ul>{articles.length > 0 && <><h2>Published articles</h2><ul>{articles.map(article => <li key={article.path}><Link to={article.path}>{article.title}</Link></li>)}</ul></>}</div>;
}
