import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiCpu,
  FiUsers,
  FiAward,
  FiCode,
  FiTool,
  FiGlobe,
  FiLayers,
  FiSettings,
  FiActivity,
} from "react-icons/fi";
import { 
  fadeInUp, 
  staggerContainer, 
  cardVariants, 
  slideInLeft, 
  slideInRight 
} from "../../utils/animations";
import "./Home.css";

const Home = () => {
  // Domains data
  const domains = [
    {
      icon: <FiCpu />,
      title: "Robotics",
      desc: "Build autonomous robots and mechatronic systems",
    },
    {
      icon: <FiGlobe />,
      title: "Internet of Things",
      desc: "Connect and automate with IoT solutions",
    },
    {
      icon: <FiActivity />,
      title: "Drone & UAV",
      desc: "Design and test aerial systems",
    },
    {
      icon: <FiCode />,
      title: "AI & ML",
      desc: "Implement intelligent robotics solutions",
    },
    {
      icon: <FiLayers />,
      title: "Embedded Systems",
      desc: "Program microcontrollers and hardware",
    },
    {
      icon: <FiSettings />,
      title: "Industrial Automation",
      desc: "Automate manufacturing processes",
    },
  ];

  // Facilities data
  const facilities = [
    {
      title: "Electronics Lab",
      desc: "Oscilloscopes, signal analyzers, and testing equipment",
    },
    {
      title: "PCB Design Lab",
      desc: "Design and fabrication with LDI and etching machines",
    },
    {
      title: "Robotics Lab",
      desc: "Robotic arms, actuators, and automation tools",
    },
    {
      title: "Drone Testing Lab",
      desc: "Thrust test stands and flight controllers",
    },
    { title: "IoT & Cloud Lab", desc: "Cloud platforms and sensor networks" },
    {
      title: "Prototyping Lab",
      desc: "3D printers, CNC machines, and laser cutters",
    },
  ];

  // Stats data
  const stats = [
    { value: "500+", label: "Students Trained" },
    { value: "150+", label: "Projects Completed" },
    { value: "25+", label: "Startups Supported" },
    { value: "50+", label: "Workshops Conducted" },
  ];

  // Courses preview
  const courses = [
    { title: "Robotics with ROS", duration: "8 Weeks", level: "Intermediate" },
    { title: "Drone Design & Flight", duration: "6 Weeks", level: "Beginner" },
    { title: "IoT with Cloud", duration: "4 Weeks", level: "Beginner" },
    { title: "Embedded Systems", duration: "10 Weeks", level: "Advanced" },
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <motion.div
            className="hero-text"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <span className="hero-badge">Welcome to the Future</span>
            <h1 className="hero-title">
              <span className="gradient-text">Build</span> •
              <span className="gradient-text"> Innovate</span> •
              <span className="gradient-text"> Automate</span>
            </h1>
            <p className="hero-description">
              Robozonix Labs is a cutting-edge robotics and technology lab
              empowering students, startups, and innovators to transform their
              ideas into reality.
            </p>
            <div className="hero-actions">
              <Link to="/membership" className="btn btn-primary">
                Join Membership
                <FiArrowRight />
              </Link>
              <Link to="/about" className="btn btn-secondary">
                Explore Lab
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Domains Section */}
      <section className="section domains-section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <span className="section-subtitle">What We Do</span>
            <h2 className="section-title">Domains We Work In</h2>
            <p className="section-description">
              Explore the cutting-edge technology domains where we empower
              innovators to build and create.
            </p>
          </motion.div>

          <motion.div 
            className="domains-grid"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {domains.map((domain, index) => (
              <motion.div
                key={index}
                className="domain-card card"
                variants={cardVariants}
                whileHover="hover"
              >
                <div className="card-icon">{domain.icon}</div>
                <h3 className="card-title">{domain.title}</h3>
                <p className="card-description">{domain.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Facilities Preview */}
      <section className="section facilities-preview">
        <div className="container">
          <div className="facilities-content">
            <motion.div 
              className="facilities-text"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={slideInLeft}
            >
              <span className="section-subtitle">Our Infrastructure</span>
              <h2 className="section-title">World-Class Facilities</h2>
              <p className="section-description">
                Access state-of-the-art labs equipped with industry-standard
                tools and machinery to bring your projects to life.
              </p>
              <Link to="/facilities" className="btn btn-secondary">
                View All Facilities
                <FiArrowRight />
              </Link>
            </motion.div>
            <motion.div 
              className="facilities-list"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {facilities.map((facility, index) => (
                <motion.div
                  key={index}
                  className="facility-item"
                  variants={cardVariants}
                  whileHover="hover"
                >
                  <FiTool className="facility-icon" />
                  <div>
                    <h4>{facility.title}</h4>
                    <p>{facility.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Courses Preview */}
      <section className="section courses-preview">
        <div className="container">
          <motion.div 
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
          >
            <span className="section-subtitle">Learn & Grow</span>
            <h2 className="section-title">Certification Programs</h2>
            <p className="section-description">
              From beginner to advanced, our courses cover all aspects of
              robotics and automation.
            </p>
          </motion.div>

          <motion.div 
            className="courses-grid"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {courses.map((course, index) => (
              <motion.div
                key={index}
                className="course-card card"
                variants={cardVariants}
                whileHover="hover"
              >
                <span
                  className={`course-level badge ${course.level.toLowerCase()}`}
                >
                  {course.level}
                </span>
                <h3 className="card-title">{course.title}</h3>
                <div className="course-meta">
                  <span>Duration: {course.duration}</span>
                </div>
                <Link to="/courses" className="btn btn-outline">
                  Learn More
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <div className="section-cta">
            <Link to="/courses" className="btn btn-primary">
              View All Courses
              <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your Journey?</h2>
            <p>
              Join Robozonix Labs today and be part of the robotics revolution.
            </p>
            <div className="cta-actions">
              <Link to="/membership" className="btn btn-primary">
                Join Now
                <FiArrowRight />
              </Link>
              <Link to="/contact" className="btn btn-secondary">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
