import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiUser, FiSettings } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import logoFull from "../../assets/images/Robozonix-full-logo.webp";
import logoShort from "../../assets/images/Robozonix-short-logo.webp";
import "./Header.css";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Facilities", path: "/facilities" },
    { name: "Courses", path: "/courses" },
    { name: "Projects", path: "/projects" },
    { name: "Membership", path: "/membership" },
    { name: "Events", path: "/events" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Get user's first name for display
  const firstName = user?.name?.split(" ")[0] || "User";

  return (
    <header className={`header ${isScrolled ? "header-scrolled" : ""}`}>
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="header-logo">
          <img src={logoFull} alt="Robozonix Labs" className="logo-image logo-full" />
          <img src={logoShort} alt="Robozonix" className="logo-image logo-short" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="header-nav desktop-nav">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? "active" : ""}`}
            >
              {link.name}
              {location.pathname === link.path && (
                <motion.div
                  className="nav-indicator"
                  layoutId="nav-indicator"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Right Section - Conditional based on auth state */}
        <div className="header-right">
          {isAuthenticated ? (
            <>
              {/* Admin Dashboard Link - only for admin/editor roles */}
              {(user?.role === 'admin' || user?.role === 'editor') && (
                <Link to="/admin" className="nav-link admin-link">
                  <span>Admin</span>
                </Link>
              )}
              <Link to="/dashboard" className="nav-link dashboard-link">
                <FiUser />
                <span>{firstName}</span>
              </Link>
              <Link to="/dashboard" className="btn btn-primary join-btn">
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link login-link">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary join-btn">
                Join Lab
              </Link>
            </>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="mobile-nav">
          {navLinks.map((link, index) => (
            <Link
              key={link.path}
              to={link.path}
              className={`mobile-nav-link ${location.pathname === link.path ? "active" : ""}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="mobile-nav-actions">
            {isAuthenticated ? (
              <>
                {(user?.role === 'admin' || user?.role === 'editor') && (
                  <Link to="/admin" className="btn btn-secondary" onClick={() => setIsMobileMenuOpen(false)}>
                    Admin
                  </Link>
                )}
                <Link to="/dashboard" className="btn btn-primary" onClick={() => setIsMobileMenuOpen(false)}>
                  <FiUser /> Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary" onClick={() => setIsMobileMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary" onClick={() => setIsMobileMenuOpen(false)}>
                  Join Lab
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
