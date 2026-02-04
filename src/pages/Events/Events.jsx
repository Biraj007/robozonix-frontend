import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiCalendar, FiMapPin, FiUsers, FiArrowRight, FiClock } from "react-icons/fi";
import api from "../../services/api";
import "./Events.css";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const eventTypes = ['All', 'Workshop', 'Seminar', 'Competition', 'Training', 'Hackathon', 'Webinar'];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/content/events');
      setEvents(response.data.events || response.data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredEvents = filter === 'All' 
    ? events 
    : events.filter(e => e.eventType === filter);

  // Fallback static data for when API is empty
  const staticPrograms = [
    {
      title: "School Programs",
      desc: "STEM education programs for K-12 students with hands-on robotics activities.",
    },
    {
      title: "College Programs",
      desc: "Internships and project collaborations for engineering students.",
    },
    {
      title: "Industrial Training",
      desc: "Corporate training programs for industry professionals.",
    },
  ];

  return (
    <div className="events-page">
      <section className="page-hero">
        <div className="container">
          <motion.div
            className="page-hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="section-subtitle">Get Involved</span>
            <h1 className="page-title">Events & Hackathons</h1>
            <p className="page-description">
              Join our events, workshops, and competitions to learn and showcase
              your skills.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="section events-section">
        <div className="container">
          <div className="event-filters">
            {eventTypes.map((type) => (
              <button
                key={type}
                className={`filter-btn ${filter === type ? 'active' : ''}`}
                onClick={() => setFilter(type)}
              >
                {type}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading events...</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="empty-state">
              <p>{events.length === 0 ? 'No events scheduled yet. Check back soon!' : 'No events match this filter.'}</p>
            </div>
          ) : (
            <div className="events-grid">
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event._id}
                  className="event-card"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                >
                  <span className="event-type badge">{event.eventType}</span>
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
                  <div className="event-meta">
                    <span>
                      <FiCalendar /> {formatDate(event.date)}
                    </span>
                    {event.location && (
                      <span>
                        <FiMapPin /> {event.location}
                      </span>
                    )}
                    {event.capacity && (
                      <span>
                        <FiUsers /> {event.registeredCount || 0}/{event.capacity}
                      </span>
                    )}
                  </div>
                  {event.price !== undefined && (
                    <div className="event-price">
                      {event.price === 0 ? 'Free' : `₹${event.price}`}
                    </div>
                  )}
                  <button className="btn btn-primary">
                    Register Now <FiArrowRight />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Programs Section */}
      <section className="section programs-section">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Collaborate</span>
            <h2 className="section-title">Training Programs</h2>
          </div>
          <div className="programs-grid">
            {staticPrograms.map((program, index) => (
              <motion.div
                key={index}
                className="program-card card"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4 }}
              >
                <h4>{program.title}</h4>
                <p>{program.desc}</p>
                <Link to="/contact" className="btn btn-outline">
                  Inquire Now
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Events;
