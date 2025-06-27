import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import './Navbar.css';
import logo from '../Images/logo/eHealthHub_logo.png';

function Navbar() {
  const [click, setClick] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();

  const handleClick = () => {
    setClick(!click);
    setDropdownOpen(false); // Close dropdown when main menu is toggled
  };

  const closeMenu = () => {
    setClick(false);
    setDropdownOpen(false); // Close dropdown when a menu item is clicked
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const getActiveClass = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <img src={logo} alt="eHealthHub Logo" />
        </Link>
        <div className="menu-icon" onClick={handleClick}>
          {click ? <FaTimes /> : <FaBars />}
        </div>
        <ul className={click ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <Link to="/" className={`nav-links ${getActiveClass('/')}`} onClick={closeMenu}>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className={`nav-links ${getActiveClass('/about')}`} onClick={closeMenu}>
              About
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/people" className={`nav-links ${getActiveClass('/people')}`} onClick={closeMenu}>
              People
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/projects" className={`nav-links ${getActiveClass('/projects')}`} onClick={closeMenu}>
              Projects
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/news" className={`nav-links ${getActiveClass('/news')}`} onClick={closeMenu}>
              News
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/calendar" className={`nav-links ${getActiveClass('/calendar')}`} onClick={closeMenu}>
              Events
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/blog" className={`nav-links ${getActiveClass('/blog')}`} onClick={closeMenu}>
              Blog
            </Link>
          </li>
          <li
            className="nav-item dropdown"
            onMouseEnter={() => window.innerWidth > 768 && setDropdownOpen(true)}
            onMouseLeave={() => window.innerWidth > 768 && setDropdownOpen(false)}
          >
            <span className="nav-links" onClick={toggleDropdown}>
              Output
            </span>
            <ul className={`dropdown-content ${dropdownOpen ? 'show' : ''}`}>
              <li>
                {/* <Link to="/output/talks" onClick={closeMenu}>Talks</Link> */}
              </li>
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