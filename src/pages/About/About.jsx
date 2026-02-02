import { motion } from "framer-motion";
import {
  FiTarget,
  FiEye,
  FiHeart,
  FiUsers,
  FiBookOpen,
  FiAward,
  FiBriefcase,
  FiCode,
} from "react-icons/fi";
import { 
  fadeInUp, 
  staggerContainer, 
  cardVariants, 
  slideInLeft, 
  slideInRight,
  scaleUp,
  fadeIn
} from "../../utils/animations";
import "./About.css";

const About = () => {
  const targetAudience = [
    {
      icon: <FiBookOpen />,
      title: "Students",
      desc: "Engineering and tech students looking to gain hands-on experience",
    },
    {
      icon: <FiBriefcase />,
      title: "Startups",
      desc: "Tech startups building hardware prototypes and MVPs",
    },
    {
      icon: <FiCode />,
      title: "Researchers",
      desc: "Academic researchers working on cutting-edge robotics projects",
    },
    {
      icon: <FiHeart />,
      title: "Hobbyists",
      desc: "Passionate makers and DIY enthusiasts",
    },
  ];

  const values = [
    {
      title: "Innovation",
      desc: "Pushing the boundaries of what's possible in robotics and automation",
    },
    {
      title: "Collaboration",
      desc: "Building a community where ideas are shared and nurtured",
    },
    {
      title: "Excellence",
      desc: "Maintaining the highest standards in education and equipment",
    },
    {
      title: "Accessibility",
      desc: "Making advanced technology accessible to everyone",
    },
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="page-hero">
        <div className="container">
          <motion.div
            className="page-hero-content"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <span className="section-subtitle">About Us</span>
            <h1 className="page-title">Who We Are</h1>
            <p className="page-description">
              Robozonix Labs is a premier robotics and technology innovation
              center dedicated to empowering the next generation of engineers,
              makers, and entrepreneurs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="section vision-mission">
        <div className="container">
          <div className="vm-grid">
            <motion.div
              className="vm-card"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={slideInLeft}
            >
              <div className="vm-icon">
                <FiEye />
              </div>
              <h3>Our Vision</h3>
              <p>
                To be the leading hub for robotics innovation in India,
                fostering a community where technology meets creativity to solve
                real-world challenges.
              </p>
            </motion.div>

            <motion.div
              className="vm-card"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={slideInRight}
            >
              <div className="vm-icon">
                <FiTarget />
              </div>
              <h3>Our Mission</h3>
              <p>
                To provide world-class infrastructure, mentorship, and resources
                that enable students and innovators to transform their ideas
                into impactful products.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What Makes Us Unique */}
      <section className="section unique-section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
          >
            <span className="section-subtitle">Why Choose Us</span>
            <h2 className="section-title">What Makes Us Unique</h2>
          </motion.div>

          <motion.div 
            className="unique-grid"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div className="unique-item" variants={cardVariants}>
              <span className="unique-number">01</span>
              <h4>Industry-Grade Equipment</h4>
              <p>
                Access to professional-grade machinery and instruments used in
                real-world applications.
              </p>
            </motion.div>

            <motion.div className="unique-item" variants={cardVariants}>
              <span className="unique-number">02</span>
              <h4>Expert Mentorship</h4>
              <p>
                Learn from experienced professionals and industry experts who
                guide your journey.
              </p>
            </motion.div>

            <motion.div className="unique-item" variants={cardVariants}>
              <span className="unique-number">03</span>
              <h4>Hands-On Learning</h4>
              <p>
                Practical, project-based education that goes beyond traditional
                classroom learning.
              </p>
            </motion.div>

            <motion.div className="unique-item" variants={cardVariants}>
              <span className="unique-number">04</span>
              <h4>Startup Support</h4>
              <p>
                End-to-end support for startups from prototyping to product
                launch.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Target Audience */}
      <section className="section audience-section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
          >
            <span className="section-subtitle">Who We Serve</span>
            <h2 className="section-title">Target Audience</h2>
            <p className="section-description">
              We cater to a diverse range of individuals and organizations
              passionate about technology.
            </p>
          </motion.div>

          <motion.div 
            className="audience-grid"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {targetAudience.map((item, index) => (
              <motion.div
                key={index}
                className="audience-card card"
                variants={cardVariants}
                whileHover="hover"
              >
                <div className="card-icon">{item.icon}</div>
                <h3 className="card-title">{item.title}</h3>
                <p className="card-description">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Values */}
      <section className="section values-section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
          >
            <span className="section-subtitle">Our Core</span>
            <h2 className="section-title">Our Values</h2>
          </motion.div>

          <motion.div 
            className="values-grid"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                className="value-item"
                variants={scaleUp}
              >
                <h4>{value.title}</h4>
                <p>{value.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Founder Story */}
      <section className="section founder-section">
        <div className="container">
          <div className="founder-content">
            <motion.div
              className="founder-image"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={slideInLeft}
            >
              <div className="founder-placeholder">
                <FiUsers size={80} />
              </div>
            </motion.div>
            <motion.div
              className="founder-text"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={slideInRight}
            >
              <span className="section-subtitle">Our Story</span>
              <h2 className="section-title">The Lab Story</h2>
              <p>
                Robozonix Labs was founded with a simple yet powerful vision: to
                democratize access to advanced robotics technology and
                education. What started as a small workshop has grown into a
                comprehensive innovation hub.
              </p>
              <p>
                Our founders, passionate engineers and educators, recognized the
                gap between theoretical knowledge and practical skills in the
                Indian education system. They envisioned a space where students
                could get their hands dirty, experiment freely, and learn by
                doing.
              </p>
              <p>
                Today, we continue to expand our facilities, courses, and
                community, staying true to our founding mission of nurturing the
                next generation of innovators.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
