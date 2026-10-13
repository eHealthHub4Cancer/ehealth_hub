import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaChevronDown } from 'react-icons/fa';
import './Navbar.css';
import logo from '../Images/logo/eHealthHub_logo.png';
import nsrp_logo from '../Images/logo/NSRP_Correct.jpg'

function Navbar() {
  const [click, setClick] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [ohdsiDropdownOpen, setOhdsiDropdownOpen] = useState(false); // NEW STATE
  const location = useLocation();

  const handleClick = () => {
    setClick(!click);
    setAboutDropdownOpen(false);
    setDropdownOpen(false); // Close dropdown when main menu is toggled
    setOhdsiDropdownOpen(false); // Close OHDSI dropdown too
  };

  const closeMenu = () => {
    setClick(false);
    setAboutDropdownOpen(false);
    setDropdownOpen(false); // Close dropdown when a menu item is clicked
    setOhdsiDropdownOpen(false); // Close OHDSI dropdown too
  };

  const toggleDropdown = () => {
    setAboutDropdownOpen(false);
    setDropdownOpen(!dropdownOpen);
    setOhdsiDropdownOpen(false);
  };

  const getActiveClass = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar" onKeyDown={event => { if (event.key === "Escape") { setAboutDropdownOpen(false); setDropdownOpen(false); setOhdsiDropdownOpen(false); } }}>
      <div className="navbar-container">
        <div className="navbar-logos">
          <Link to="/" className="navbar-logo ehealth-logo" onClick={closeMenu}>
            <img src={logo} alt="eHealthHub Logo" />
          </Link>
          <a 
            href="https://hea.ie/policy/research-policy/north-south-research-programme/" 
            className="navbar-logo nsrp-logo" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <img src={nsrp_logo} alt="NSRP Logo" />
          </a>
        </div>
        <button type="button" className="menu-icon" onClick={handleClick} aria-label={click ? "Close navigation" : "Open navigation"} aria-expanded={click} aria-controls="main-navigation">
          {click ? <FaTimes /> : <FaBars />}
        </button>
        <ul id="main-navigation" className={click ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <Link to="/" className={`nav-links ${getActiveClass('/')}`} onClick={closeMenu}>
              Home
            </Link>
          </li>
          <li className="nav-item dropdown"
            onMouseEnter={() => { if (window.innerWidth > 1100) { setAboutDropdownOpen(true); setDropdownOpen(false); setOhdsiDropdownOpen(false); } }}
            onMouseLeave={() => window.innerWidth > 1100 && setAboutDropdownOpen(false)}>
            <div className="nav-dropdown-row">
              <Link to="/about" className={`nav-links ${location.pathname === '/about' || location.pathname.startsWith('/people') ? 'active' : ''}`} onClick={closeMenu}>About Us</Link>
              <button type="button" className="nav-dropdown-toggle" aria-label="About Us submenu" aria-expanded={aboutDropdownOpen} aria-controls="about-submenu" onClick={() => { setAboutDropdownOpen(value => !value); setDropdownOpen(false); setOhdsiDropdownOpen(false); }}>
                <FaChevronDown aria-hidden="true" />
              </button>
            </div>
            <ul id="about-submenu" className={`dropdown-content ${aboutDropdownOpen ? 'show' : ''}`}>
              <li><Link to="/about" onClick={closeMenu}>About eHealth Hub</Link></li>
              <li><Link to="/people" onClick={closeMenu}>Meet the Team</Link></li>
            </ul>
          </li>

          {/* OHDSI Ireland with Dropdown - UPDATED */}
          <li
            className="nav-item dropdown"
            onMouseEnter={() => window.innerWidth > 1100 && setOhdsiDropdownOpen(true)}
            onMouseLeave={() => window.innerWidth > 1100 && setOhdsiDropdownOpen(false)}
          >
            <div className="nav-dropdown-row">
            <Link 
              to="/ohdsi-ireland" 
              className={`nav-links ${getActiveClass('/ohdsi-ireland')}`}
              onClick={closeMenu}
            >
              OHDSI Ireland
            </Link>
            <button type="button" className="nav-dropdown-toggle" aria-label="OHDSI Ireland submenu" aria-expanded={ohdsiDropdownOpen} aria-controls="ohdsi-submenu" onClick={() => { setOhdsiDropdownOpen(value => !value); setDropdownOpen(false); setAboutDropdownOpen(false); }}>
              <FaChevronDown aria-hidden="true" />
            </button>
            </div>
            <ul id="ohdsi-submenu" className={`dropdown-content ${ohdsiDropdownOpen ? 'show' : ''}`}>
              <li>
                <Link to="/ohdsi-ireland/seminars" onClick={closeMenu}>Seminar Series</Link>
              </li>
            </ul>
          </li>
          
          <li className="nav-item">
            <Link to="/news" className={`nav-links ${getActiveClass('/news')}`} onClick={closeMenu}>
              News
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/forum" className={`nav-links ${getActiveClass('/forum')}`} onClick={closeMenu}>
              Events
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/calendar" className={`nav-links ${getActiveClass('/calendar')}`} onClick={closeMenu}>
              Calendar
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/blog" className={`nav-links ${getActiveClass('/blog')}`} onClick={closeMenu}>
              Blog
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/resources" className={`nav-links ${getActiveClass('/resources')}`} onClick={closeMenu}>
              Resources
            </Link>
          </li>
          <li
            className="nav-item dropdown"
            onMouseEnter={() => window.innerWidth > 1100 && setDropdownOpen(true)}
            onMouseLeave={() => window.innerWidth > 1100 && setDropdownOpen(false)}
          >
            <button type="button" className="nav-links nav-dropdown-trigger" onClick={toggleDropdown} aria-expanded={dropdownOpen} aria-controls="output-submenu">
              Output <FaChevronDown className="nav-dropdown-chevron" aria-hidden="true" />
            </button>
            <ul id="output-submenu" className={`dropdown-content ${dropdownOpen ? 'show' : ''}`}>
              <li>
                <Link to="/output/publications" onClick={closeMenu}>Publications</Link>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;