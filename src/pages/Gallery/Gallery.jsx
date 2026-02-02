import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiChevronLeft, FiChevronRight, FiPlay } from "react-icons/fi";
import { 
  fadeInUp, 
  staggerContainer, 
  scaleUp 
} from "../../utils/animations";
import "./Gallery.css";

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");

  const categories = [
    "all",
    "Lab Photos",
    "Events",
    "Workshops",
    "Student Activities",
  ];

  const images = [
    {
      id: 1,
      category: "Lab Photos",
      title: "Electronics Lab Setup",
      type: "image",
    },
    { id: 2, category: "Events", title: "RoboHack 2025 Finals", type: "image" },
    {
      id: 3,
      category: "Workshops",
      title: "PCB Design Workshop",
      type: "image",
    },
    {
      id: 4,
      category: "Student Activities",
      title: "Drone Testing Session",
      type: "image",
    },
    { id: 5, category: "Lab Photos", title: "3D Printers Hall", type: "image" },
    { id: 6, category: "Events", title: "IoT Summit 2025", type: "image" },
    { id: 7, category: "Workshops", title: "ROS2 Training", type: "image" },
    {
      id: 8,
      category: "Student Activities",
      title: "Robot Assembly",
      type: "image",
    },
    {
      id: 9,
      category: "Lab Photos",
      title: "CNC Machine in Action",
      type: "video",
    },
    { id: 10, category: "Events", title: "Drone Racing", type: "video" },
    {
      id: 11,
      category: "Workshops",
      title: "Soldering Session",
      type: "image",
    },
    {
      id: 12,
      category: "Student Activities",
      title: "Project Presentations",
      type: "image",
    },
  ];

  const filteredImages =
    activeFilter === "all"
      ? images
      : images.filter((img) => img.category === activeFilter);

  return (
    <div className="gallery-page">
      <section className="page-hero">
        <div className="container">
          <motion.div
            className="page-hero-content"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <span className="section-subtitle">Visual Journey</span>
            <h1 className="page-title">Gallery & Media</h1>
            <p className="page-description">
              Explore our lab, events, workshops, and student activities through
              photos and videos.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section gallery-section">
        <div className="container">
          {/* Filters */}
          <div className="gallery-filters">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`filter-btn ${activeFilter === cat ? "active" : ""}`}
                onClick={() => setActiveFilter(cat)}
              >
                {cat === "all" ? "All" : cat}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          <motion.div 
            className="gallery-grid"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            layout
          >
            <AnimatePresence mode="popLayout">
              {filteredImages.map((item) => (
                <motion.div
                  key={item.id}
                  className="gallery-item"
                  variants={scaleUp}
                  onClick={() => setSelectedImage(item)}
                  layout
                >
                  <div className="gallery-image">
                    <div className="gallery-placeholder">
                      {item.type === "video" ? <FiPlay size={40} /> : "📷"}
                    </div>
                    <div className="gallery-overlay">
                      <span className="gallery-category">{item.category}</span>
                      <h4>{item.title}</h4>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            className="lightbox" 
            onClick={() => setSelectedImage(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button className="lightbox-close">
              <FiX />
            </button>
            <motion.div
              className="lightbox-content"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="lightbox-image">
                <div className="lightbox-placeholder">
                  {selectedImage.type === "video" ? <FiPlay size={60} /> : "📷"}
                </div>
              </div>
              <div className="lightbox-info">
                <span className="gallery-category badge">
                  {selectedImage.category}
                </span>
                <h3>{selectedImage.title}</h3>
              </div>
            </motion.div>
            <button className="lightbox-nav prev">
              <FiChevronLeft />
            </button>
            <button className="lightbox-nav next">
              <FiChevronRight />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
