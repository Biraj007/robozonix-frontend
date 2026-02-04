import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiUser, FiArrowRight, FiTag, FiSearch } from 'react-icons/fi';
import api from '../../services/api';
import './Blog.css';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Technology', 'Robotics', 'AI', 'IoT', 'Tutorials', 'News', 'Events'];

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await api.get('/content/blogs');
      setBlogs(response.data.blogs || response.data || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="blog-page">
      <section className="blog-hero">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="blog-hero-content"
        >
          <h1>Blog & Resources</h1>
          <p>Explore the latest in robotics, AI, and technology</p>
        </motion.div>
      </section>

      <section className="blog-content">
        <div className="blog-filters">
          <div className="search-box">
            <FiSearch />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="category-filters">
            {categories.map((category) => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="blog-loading">
            <div className="loading-spinner"></div>
            <p>Loading articles...</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="no-blogs">
            <p>No articles found. {blogs.length === 0 ? 'Check back soon for new content!' : 'Try a different search or category.'}</p>
          </div>
        ) : (
          <div className="blog-grid">
            {filteredBlogs.map((blog, index) => (
              <motion.article
                key={blog._id}
                className="blog-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {blog.coverImage && (
                  <div className="blog-card-image">
                    <img src={blog.coverImage} alt={blog.title} />
                  </div>
                )}
                <div className="blog-card-content">
                  <div className="blog-card-meta">
                    <span className="blog-category">{blog.category}</span>
                    <span className="blog-date">
                      <FiCalendar /> {formatDate(blog.createdAt)}
                    </span>
                  </div>
                  <h2 className="blog-card-title">{blog.title}</h2>
                  <p className="blog-card-excerpt">{blog.excerpt}</p>
                  <div className="blog-card-footer">
                    <span className="blog-author">
                      <FiUser /> {blog.authorName}
                    </span>
                    <button className="read-more-btn">
                      Read More <FiArrowRight />
                    </button>
                  </div>
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="blog-tags">
                      {blog.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="blog-tag">
                          <FiTag /> {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Blog;
