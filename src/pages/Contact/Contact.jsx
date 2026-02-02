import { motion } from "framer-motion";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiSend,
  FiMessageSquare,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { 
  fadeInUp, 
  slideInLeft, 
  slideInRight 
} from "../../utils/animations";
import "./Contact.css";

const Contact = () => {
  return (
    <div className="contact-page">
      <section className="page-hero">
        <div className="container">
          <motion.div
            className="page-hero-content"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <span className="section-subtitle">Get in Touch</span>
            <h1 className="page-title">Contact Us</h1>
            <p className="page-description">
              Have questions? We'd love to hear from you. Send us a message or
              visit our lab.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section contact-section">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Form */}
            <motion.div
              className="contact-form-wrapper"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={slideInLeft}
            >
              <h2 className="section-title text-left">Send us a Message</h2>
              <form className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Phone (Optional)</label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <select className="form-select">
                    <option>General Inquiry</option>
                    <option>Membership</option>
                    <option>Courses</option>
                    <option>Partnerships</option>
                    <option>Technical Support</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Message</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Tell us how we can help..."
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary">
                  <FiSend /> Send Message
                </button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              className="contact-info"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={slideInRight}
            >
              <div className="info-card">
                <h3>Contact Information</h3>
                <div className="info-items">
                  <a href="tel:+919876543210" className="info-item">
                    <FiPhone className="info-icon" />
                    <div>
                      <strong>Phone</strong>
                      <span>+91 98765 43210</span>
                    </div>
                  </a>
                  <a href="https://wa.me/919876543210" className="info-item">
                    <FaWhatsapp className="info-icon" />
                    <div>
                      <strong>WhatsApp</strong>
                      <span>+91 98765 43210</span>
                    </div>
                  </a>
                  <a href="mailto:info@robozonix.com" className="info-item">
                    <FiMail className="info-icon" />
                    <div>
                      <strong>Email</strong>
                      <span>info@robozonix.com</span>
                    </div>
                  </a>
                  <div className="info-item">
                    <FiMapPin className="info-icon" />
                    <div>
                      <strong>Address</strong>
                      <span>
                        Robozonix Labs, Tech Park,
                        <br />
                        Sector V, Salt Lake City,
                        <br />
                        Kolkata 700091, WB
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="map-container">
                <div className="map-placeholder">
                  <FiMapPin size={40} />
                  <p>Google Maps Integration</p>
                  <span>Interactive map will be displayed here</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
