import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import './Navbar.css';
import logo from '../Images/logo/eHealthHub_logo.png';
import nsrpLogo from '../Images/logo/NSRP_Correct.jpg';

const items = [
  { label: 'Home', path: '/' },
  { label: 'About Us', children: [{ label: 'About eHealth Hub', path: '/about' }, { label: 'Meet the Team', path: '/people' }] },
  { label: 'OHDSI Ireland', children: [{ label: 'About the Node', path: '/ohdsi-ireland' }, { label: 'Seminar Series', path: '/ohdsi-ireland/seminars' }] },
  { label: 'News', path: '/news' },
  { label: 'Events', children: [{ label: 'All-Island Forum', path: '/forum' }, { label: 'Calendar', path: '/calendar' }] },
  { label: 'Blog', path: '/blog' },
  { label: 'Resources', path: '/resources' },
  { label: 'Impact', children: [{ label: 'Publications', path: '/output/publications' }, { label: 'Code & Data', path: '/output/code-data' }] },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [mobile, setMobile] = useState(() => typeof window.matchMedia === 'function' && window.matchMedia('(max-width: 1100px)').matches);
  const trigger = useRef(null);
  const panel = useRef(null);
  const closeButton = useRef(null);
  const location = useLocation();
  const close = () => { setOpen(false); setExpanded(null); };
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const media = window.matchMedia('(max-width: 1100px)');
    const update = () => { setMobile(media.matches); setOpen(false); setExpanded(null); };
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => { setOpen(false); setExpanded(null); }, [location.pathname]);
  useEffect(() => {
    const outside = event => {
      if (!panel.current?.contains(event.target) && !trigger.current?.contains(event.target)) { setOpen(false); setExpanded(null); }
    };
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, []);
  useEffect(() => {
    if (!open || !mobile) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButton.current?.focus();
    return () => { document.body.style.overflow = previousOverflow; trigger.current?.focus(); };
  }, [open, mobile]);
  const onKeyDown = event => {
    if (event.key === 'Escape') { close(); trigger.current?.focus(); }
    if (event.key !== 'Tab' || !open || !mobile) return;
    const controls = [...panel.current.querySelectorAll('a, button')].filter(element => !element.closest('[hidden]'));
    const first = controls[0], last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  };
  const isActive = path => path === '/' ? location.pathname === '/' : location.pathname === path || location.pathname.startsWith(`${path}/`);
  return <nav className="navbar" aria-label="Main navigation" onKeyDown={onKeyDown}>
    <div className="navbar-container">
      <div className="navbar-logos">
        <Link to="/" className="navbar-logo" onClick={close}><img src={logo} alt="eHealthHub Logo" /></Link>
        <a href="https://hea.ie/policy/research-policy/north-south-research-programme/" className="navbar-logo" target="_blank" rel="noopener noreferrer"><img src={nsrpLogo} alt="NSRP Logo" /></a>
      </div>
      <button ref={trigger} type="button" className="menu-icon" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="main-navigation" onClick={() => { setOpen(value => !value); setExpanded(null); }}><Menu size={25} aria-hidden="true" /></button>
      {open && <div className="navigation-backdrop" aria-hidden="true" onClick={close} />}
      <div ref={panel} id="main-navigation" className={`navigation-panel${open ? ' is-open' : ''}`} role={mobile && open ? 'dialog' : undefined} aria-modal={mobile && open ? 'true' : undefined} aria-label={mobile && open ? 'Navigation' : undefined}>
        <div className="navigation-drawer-header"><button ref={closeButton} type="button" aria-label="Close menu" onClick={close}><X size={23} aria-hidden="true" /></button></div>
        <ul className="nav-menu">{items.map((item, index) => {
          const active = item.children ? item.children.some(child => isActive(child.path)) : isActive(item.path);
          const isExpanded = expanded === item.label;
          const id = `navigation-submenu-${index}`;
          return <li key={item.label} className="nav-item"
            onMouseEnter={() => { if (!mobile && item.children) setExpanded(item.label); }}
            onMouseLeave={() => { if (!mobile && item.children) setExpanded(null); }}>
            {item.children ? <>
              <button type="button" className={`nav-links nav-parent${active ? ' active' : ''}`} aria-expanded={isExpanded} aria-controls={id} onClick={() => setExpanded(isExpanded ? null : item.label)}>{item.label}<ChevronDown size={16} aria-hidden="true" /></button>
              <ul id={id} className="dropdown-content" hidden={!isExpanded}>{item.children.map(child => <li key={child.path}><Link to={child.path} aria-current={isActive(child.path) ? 'page' : undefined} onClick={close}>{child.label}</Link></li>)}</ul>
            </> : <Link to={item.path} className={`nav-links${active ? ' active' : ''}`} aria-current={active ? 'page' : undefined} onClick={close}>{item.label}</Link>}
          </li>;
        })}</ul>
      </div>
    </div>
  </nav>;
}
