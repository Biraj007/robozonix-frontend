import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiClock } from "react-icons/fi";
import "./ComingSoon.css";

const ComingSoon = ({ title, subtitle = "This Page is Under Construction", description = "We're working hard to bring you something amazing. Stay tuned!" }) => {
  return (
    <div className="coming-soon-page">
      <section className="page-hero">
        <div className="container">
          <motion.div
            className="page-hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="section-subtitle">Coming Soon</span>
            <h1 className="page-title">{title}</h1>
            <p className="page-description">
              {subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section coming-soon-content">
        <div className="container">
          <motion.div 
            className="coming-soon-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="clock-icon">
              <FiClock size={60} />
            </div>
            <h2>{description}</h2>
            <p>
              In the meantime, feel free to explore our other pages or contact us for more information.
            </p>
            <Link to="/" className="btn btn-primary">
              Back to Home
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ComingSoon;
