import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiBook, FiClock, FiUsers, FiDollarSign, FiStar } from "react-icons/fi";
import api from "../../services/api";
import "./Courses.css";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const categories = ['All', 'Robotics', 'IoT', 'AI/ML', 'Embedded Systems', 'Drones', '3D Printing', 'Programming'];

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/content/courses');
      setCourses(response.data.courses || response.data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = filter === 'All' 
    ? courses 
    : courses.filter(c => c.category === filter);

  const getLevelClass = (level) => {
    switch(level) {
      case 'Beginner': return 'badge-green';
      case 'Intermediate': return 'badge-yellow';
      case 'Advanced': return 'badge-red';
      default: return '';
    }
  };

  return (
    <div className="courses-page">
      <section className="page-hero">
        <div className="container">
          <motion.div
            className="page-hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="section-subtitle">Learn</span>
            <h1 className="page-title">Courses & Certification</h1>
            <p className="page-description">
              Master cutting-edge technologies with our industry-focused courses
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section courses-section">
        <div className="container">
          <div className="course-filters">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`filter-btn ${filter === cat ? 'active' : ''}`}
                onClick={() => setFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading courses...</p>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="empty-state">
              <FiBook size={48} />
              <h3>No courses available yet</h3>
              <p>We're working on exciting new courses. Check back soon!</p>
            </div>
          ) : (
            <div className="courses-grid">
              {filteredCourses.map((course, index) => (
                <motion.div
                  key={course._id}
                  className="course-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  {course.coverImage && (
                    <div className="course-image">
                      <img src={course.coverImage} alt={course.title} />
                    </div>
                  )}
                  <div className="course-content">
                    <div className="course-header">
                      <span className="course-category">{course.category}</span>
                      <span className={`course-level ${getLevelClass(course.level)}`}>
                        {course.level}
                      </span>
                    </div>
                    <h3>{course.title}</h3>
                    <p>{course.description}</p>
                    <div className="course-meta">
                      <span><FiClock /> {course.duration}</span>
                      {course.instructor && <span><FiUsers /> {course.instructor}</span>}
                    </div>
                    <div className="course-footer">
                      <div className="course-price">
                        {course.price === 0 ? (
                          <span className="free">Free</span>
                        ) : (
                          <span>₹{course.price}</span>
                        )}
                      </div>
                      <button className="btn btn-primary">Enroll Now</button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Courses;
