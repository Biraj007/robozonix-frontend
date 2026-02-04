import { Link } from "react-router-dom";
import { FiMail, FiPhone, FiMapPin, FiSend } from "react-icons/fi";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaGithub,
} from "react-icons/fa";
import logoFull from "../../assets/images/Robozonix-full-logo.webp";
import "./Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Our Facilities", path: "/facilities" },
    { name: "Courses", path: "/courses" },
    { name: "Projects", path: "/projects" },
    { name: "Membership", path: "/membership" },
  ];

  const resourceLinks = [
    { name: "Events", path: "/events" },
    { name: "Blog", path: "/blog" },
    { name: "Gallery", path: "/gallery" },
    { name: "FAQs", path: "/faqs" },
    { name: "Contact", path: "/contact" },
    { name: "Support", path: "/contact" },
  ];

  const legalLinks = [
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Terms of Service", path: "/terms" },
    { name: "Refund Policy", path: "/refund" },
  ];

  const socialLinks = [
    { icon: <FaFacebookF />, url: "#", label: "Facebook" },
    { icon: <FaTwitter />, url: "#", label: "Twitter" },
    { icon: <FaInstagram />, url: "#", label: "Instagram" },
    { icon: <FaLinkedinIn />, url: "#", label: "LinkedIn" },
    { icon: <FaYoutube />, url: "#", label: "YouTube" },
    { icon: <FaGithub />, url: "#", label: "GitHub" },
  ];

  return (
    <footer className="footer">
      {/* Newsletter Section */}
      <div className="footer-newsletter">
        <div className="container">
          <div className="newsletter-content">
            <div className="newsletter-text">
              <h3>Stay Updated with Robozonix</h3>
              <p>
                Subscribe to our newsletter for the latest updates on courses,
                events, and tech insights.
              </p>
            </div>
            <form
              className="newsletter-form"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="newsletter-input-wrapper">
                <FiMail className="input-icon" />
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="newsletter-input"
                />
              </div>
              <button type="submit" className="btn btn-primary newsletter-btn">
                <FiSend />
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            {/* Brand Column */}
            <div className="footer-brand">
              <Link to="/" className="footer-logo">
                <img src={logoFull} alt="Robozonix Labs" className="footer-logo-image" />
              </Link>
              <p className="footer-description">
                A cutting-edge robotics and technology lab empowering students,
                startups, and innovators to build, learn, and create the future.
              </p>
              <div className="footer-contact-info">
                <a href="tel:+919876543210" className="contact-item">
                  <FiPhone />
                  <span>+91 98765 43210</span>
                </a>
                <a href="mailto:info@robozonix.com" className="contact-item">
                  <FiMail />
                  <span>info@robozonix.com</span>
                </a>
                <div className="contact-item">
                  <FiMapPin />
                  <span>Kolkata, West Bengal, India</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-column">
              <h4 className="footer-heading">Quick Links</h4>
              <ul className="footer-links">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link to={link.path}>{link.name}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div className="footer-column">
              <h4 className="footer-heading">Resources</h4>
              <ul className="footer-links">
                {resourceLinks.map((link) => (
                  <li key={link.name}>
                    <Link to={link.path}>{link.name}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social & Legal */}
            <div className="footer-column">
              <h4 className="footer-heading">Connect With Us</h4>
              <div className="social-links">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.url}
                    className="social-link"
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
              <h4 className="footer-heading" style={{ marginTop: "24px" }}>
                Legal
              </h4>
              <ul className="footer-links">
                {legalLinks.map((link) => (
                  <li key={link.name}>
                    <Link to={link.path}>{link.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <p className="copyright">
              © {currentYear} Robozonix Labs. All rights reserved.
            </p>
            <p className="made-with">
              Made with <span className="heart">❤</span> by <span className="author-signature">Biraj ♾️</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
