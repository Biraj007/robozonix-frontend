import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiCalendar, FiMapPin, FiUsers, FiArrowRight } from "react-icons/fi";
import "./Events.css";

const Events = () => {
  const upcomingEvents = [
    {
      id: 1,
      title: "RoboHack 2026",
      type: "Hackathon",
      date: "Feb 15-16, 2026",
      location: "Robozonix Labs",
      capacity: "100 Teams",
      description: "48-hour robotics hackathon with exciting prizes.",
    },
    {
      id: 2,
      title: "Drone Racing Championship",
      type: "Competition",
      date: "Mar 5, 2026",
      location: "Outdoor Arena",
      capacity: "50 Participants",
      description: "High-speed FPV drone racing competition.",
    },
    {
      id: 3,
      title: "IoT Summit 2026",
      type: "Tech Fest",
      date: "Mar 20-21, 2026",
      location: "Robozonix Labs",
      capacity: "200 Attendees",
      description: "Annual IoT conference with industry speakers.",
    },
  ];

  const workshops = [
    {
      id: 1,
      title: "PCB Design Bootcamp",
      date: "Every Saturday",
      duration: "4 hours",
      level: "Beginner",
    },
    {
      id: 2,
      title: "ROS2 Workshop",
      date: "Feb 8, 2026",
      duration: "6 hours",
      level: "Intermediate",
    },
    {
      id: 3,
      title: "Drone Building Workshop",
      date: "Feb 22, 2026",
      duration: "8 hours",
      level: "Beginner",
    },
  ];

  const programs = [
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

      {/* Upcoming Events */}
      <section className="section events-section">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Upcoming</span>
            <h2 className="section-title">Featured Events</h2>
          </div>
          <div className="events-grid">
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={event.id}
                className="event-card"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
              >
                <span className="event-type badge">{event.type}</span>
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <div className="event-meta">
                  <span>
                    <FiCalendar /> {event.date}
                  </span>
                  <span>
                    <FiMapPin /> {event.location}
                  </span>
                  <span>
                    <FiUsers /> {event.capacity}
                  </span>
                </div>
                <button className="btn btn-primary">
                  Register Now <FiArrowRight />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Workshops */}
      <section className="section workshops-section">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Learn</span>
            <h2 className="section-title">Workshops & Bootcamps</h2>
          </div>
          <div className="workshops-grid">
            {workshops.map((workshop, index) => (
              <motion.div
                key={workshop.id}
                className="workshop-card card"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4 }}
              >
                <span className={`badge ${workshop.level.toLowerCase()}`}>
                  {workshop.level}
                </span>
                <h4>{workshop.title}</h4>
                <div className="workshop-meta">
                  <span>
                    <FiCalendar /> {workshop.date}
                  </span>
                  <span>Duration: {workshop.duration}</span>
                </div>
                <button className="btn btn-outline">Learn More</button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="section programs-section">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Collaborate</span>
            <h2 className="section-title">Training Programs</h2>
          </div>
          <div className="programs-grid">
            {programs.map((program, index) => (
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
