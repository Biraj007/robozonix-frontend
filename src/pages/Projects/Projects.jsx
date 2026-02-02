import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiFilter, FiExternalLink, FiGithub } from "react-icons/fi";
import { 
  fadeInUp, 
  staggerContainer, 
  cardVariants 
} from "../../utils/animations";
import "./Projects.css";

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  const projects = [
    {
      id: 1,
      title: "Autonomous Navigation Robot",
      category: "robotics",
      tech: ["ROS", "SLAM", "LiDAR"],
      description:
        "A self-navigating robot using SLAM algorithms and LiDAR sensors.",
      outcome: "Successfully navigates indoor environments autonomously.",
    },
    {
      id: 2,
      title: "Smart Agriculture IoT System",
      category: "iot",
      tech: ["ESP32", "AWS IoT", "Sensors"],
      description:
        "Connected farming solution for monitoring soil and crop health.",
      outcome: "30% water savings through intelligent irrigation.",
    },
    {
      id: 3,
      title: "Hexacopter Drone",
      category: "drone",
      tech: ["Pixhawk", "GPS", "Telemetry"],
      description: "Custom-built hexacopter for aerial surveying and mapping.",
      outcome: "Stable 30-minute flight time with 4K camera.",
    },
    {
      id: 4,
      title: "AI Vision Quality Inspector",
      category: "ai",
      tech: ["OpenCV", "TensorFlow", "Raspberry Pi"],
      description: "Machine vision system for manufacturing defect detection.",
      outcome: "99.2% accuracy in defect detection.",
    },
    {
      id: 5,
      title: "Industrial Robotic Arm",
      category: "robotics",
      tech: ["Servo Motors", "Arduino", "Inverse Kinematics"],
      description: "6-DOF robotic arm for pick and place operations.",
      outcome: "Precision placement within 0.5mm accuracy.",
    },
    {
      id: 6,
      title: "Smart Home Automation Hub",
      category: "iot",
      tech: ["Zigbee", "MQTT", "Node.js"],
      description: "Centralized home automation system with voice control.",
      outcome: "Seamless integration of 20+ smart devices.",
    },
  ];

  const filters = [
    { key: "all", label: "All Projects" },
    { key: "robotics", label: "Robotics" },
    { key: "iot", label: "IoT" },
    { key: "drone", label: "Drones" },
    { key: "ai", label: "AI" },
  ];

  const filteredProjects =
    activeFilter === "all"
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  return (
    <div className="projects-page">
      <section className="page-hero">
        <div className="container">
          <motion.div
            className="page-hero-content"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <span className="section-subtitle">Our Work</span>
            <h1 className="page-title">Project Showcase</h1>
            <p className="page-description">
              Explore innovative projects built by our students, startups, and
              research teams.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section projects-section">
        <div className="container">
          <div className="projects-filters">
            <FiFilter className="filter-icon" />
            {filters.map((filter) => (
              <button
                key={filter.key}
                className={`filter-btn ${activeFilter === filter.key ? "active" : ""}`}
                onClick={() => setActiveFilter(filter.key)}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <motion.div 
            className="projects-grid"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            layout
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  className="project-card"
                  variants={cardVariants}
                  whileHover="hover"
                  layout
                >
                  <div className="project-image">
                    <div className="project-placeholder">📸</div>
                  </div>
                  <div className="project-content">
                    <span className="project-category badge">
                      {project.category}
                    </span>
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <div className="project-tech">
                      {project.tech.map((t, i) => (
                        <span key={i}>{t}</span>
                      ))}
                    </div>
                    <div className="project-outcome">
                      <strong>Outcome:</strong> {project.outcome}
                    </div>
                    <div className="project-links">
                      <button className="btn btn-outline">
                        <FiExternalLink /> Details
                      </button>
                      <button className="btn btn-secondary">
                        <FiGithub /> Source
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Projects;
