import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiFilter, FiExternalLink, FiGithub } from "react-icons/fi";
import api from "../../services/api";
import { 
  fadeInUp, 
  staggerContainer, 
  cardVariants 
} from "../../utils/animations";
import "./Projects.css";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  const filters = [
    { key: "all", label: "All Projects" },
    { key: "Robotics", label: "Robotics" },
    { key: "IoT", label: "IoT" },
    { key: "Drones", label: "Drones" },
    { key: "AI/ML", label: "AI" },
  ];

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/content/projects');
      setProjects(response.data.projects || response.data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

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

          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading projects...</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="empty-state">
              <p>{projects.length === 0 ? 'No projects added yet. Check back soon!' : 'No projects match this filter.'}</p>
            </div>
          ) : (
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
                    key={project._id}
                    className="project-card"
                    variants={cardVariants}
                    whileHover="hover"
                    layout
                  >
                    <div className="project-image">
                      {project.coverImage ? (
                        <img src={project.coverImage} alt={project.title} />
                      ) : (
                        <div className="project-placeholder">📸</div>
                      )}
                    </div>
                    <div className="project-content">
                      <span className="project-category badge">
                        {project.category}
                      </span>
                      <h3>{project.title}</h3>
                      <p>{project.description}</p>
                      {project.technologies && (
                        <div className="project-tech">
                          {project.technologies.slice(0, 4).map((t, i) => (
                            <span key={i}>{t}</span>
                          ))}
                        </div>
                      )}
                      {project.outcomes && (
                        <div className="project-outcome">
                          <strong>Outcome:</strong> {project.outcomes}
                        </div>
                      )}
                      <div className="project-links">
                        {project.demoUrl && (
                          <a href={project.demoUrl} className="btn btn-outline" target="_blank" rel="noopener noreferrer">
                            <FiExternalLink /> Demo
                          </a>
                        )}
                        {project.githubUrl && (
                          <a href={project.githubUrl} className="btn btn-secondary" target="_blank" rel="noopener noreferrer">
                            <FiGithub /> Source
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Projects;
