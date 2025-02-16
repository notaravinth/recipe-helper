import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <div className="nav-spacer"></div>
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-content">
            <div className="nav-brand">
              <Link to="/">MealMaster</Link>
            </div>
            
            <div className="nav-links-desktop">
              <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
                Home
              </Link>
              <Link to="/recipe-finder" className={`nav-link ${isActive('/recipe-finder') ? 'active' : ''}`}>
                Recipe Finder
              </Link>
              <Link to="/meal-planner" className={`nav-link ${isActive('/meal-planner') ? 'active' : ''}`}>
                Meal Planner
              </Link>
              <Link to="/grocery-list" className={`nav-link ${isActive('/grocery-list') ? 'active' : ''}`}>
                Grocery List
              </Link>
            </div>

            <button
              onClick={toggleMobileMenu}
              className="mobile-menu-button"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="hamburger-icon"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>

          <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
            <Link to="/" className={`mobile-nav-link ${isActive('/') ? 'active' : ''}`}>
              Home
            </Link>
            <Link to="/recipe-finder" className={`mobile-nav-link ${isActive('/recipe-finder') ? 'active' : ''}`}>
              Recipe Finder
            </Link>
            <Link to="/meal-planner" className={`mobile-nav-link ${isActive('/meal-planner') ? 'active' : ''}`}>
              Meal Planner
            </Link>
            <Link to="/grocery-list" className={`mobile-nav-link ${isActive('/grocery-list') ? 'active' : ''}`}>
              Grocery List
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar; 