import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiCpu,
  FiSettings,
  FiActivity,
  FiCloud,
  FiTool,
} from "react-icons/fi";
import api from "../../services/api";
import "./Facilities.css";

const Facilities = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
      const response = await api.get('/content/facilities');
      setFacilities(response.data.facilities || response.data || []);
    } catch (error) {
      console.error('Error fetching facilities:', error);
      setFacilities([]);
    } finally {
      setLoading(false);
    }
  };

  // Static fallback data
  const staticLabs = [
    {
      icon: <FiActivity />,
      title: "Electronics Lab",
      description:
        "Fully equipped with oscilloscopes, DSO, logic analyzers, signal generators, and power supplies for circuit design and testing.",
      equipment: [
        "Oscilloscopes",
        "Logic Analyzer",
        "Signal Generators",
        "Power Supplies",
        "Multimeters",
      ],
    },
    {
      icon: <FiCpu />,
      title: "PCB Design & Fabrication Lab",
      description:
        "Design and fabricate custom PCBs with our LDI machines, chemical etching systems, and SMD soldering stations.",
      equipment: [
        "LDI Machine",
        "PCB Etching",
        "Reflow Oven",
        "SMD Workstation",
        "Pick & Place",
      ],
    },
    {
      icon: <FiSettings />,
      title: "Robotics & Automation Lab",
      description:
        "Industrial robotic arms, actuators, servo motors, and PLC systems for building automated solutions.",
      equipment: [
        "Robotic Arms",
        "Servo Motors",
        "Actuators",
        "PLC Systems",
        "Motor Controllers",
      ],
    },
    {
      icon: <FiActivity />,
      title: "Drone Design & Testing Lab",
      description:
        "Complete drone development facility with thrust test stands, flight controllers, and testing equipment.",
      equipment: [
        "Thrust Test Stand",
        "Flight Controllers",
        "ESCs",
        "Props & Motors",
        "Testing Rigs",
      ],
    },
    {
      icon: <FiCloud />,
      title: "IoT & Cloud Lab",
      description:
        "Connected infrastructure for IoT development with cloud platforms, sensors, and communication modules.",
      equipment: [
        "Cloud Servers",
        "Sensor Arrays",
        "WiFi/BLE Modules",
        "LoRa Devices",
        "Gateway Devices",
      ],
    },
    {
      icon: <FiTool />,
      title: "Mechanical & Prototyping Lab",
      description:
        "State-of-the-art fabrication tools including 3D printers, CNC machines, and laser cutters.",
      equipment: [
        "3D Printers",
        "CNC Machines",
        "Laser Cutter",
        "Hand Tools",
        "Workbenches",
      ],
    },
  ];

  // Use API data if available, otherwise use static
  const displayLabs = facilities.length > 0 ? facilities : staticLabs;

  return (
    <div className="facilities-page">
      {/* Hero */}
      <section className="page-hero">
        <div className="container">
          <motion.div
            className="page-hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="section-subtitle">Infrastructure</span>
            <h1 className="page-title">Lab Facilities</h1>
            <p className="page-description">
              World-class infrastructure equipped with industry-standard tools
              and machinery to bring your innovative ideas to life.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Labs Grid */}
      <section className="section labs-section">
        <div className="container">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading facilities...</p>
            </div>
          ) : (
            <div className="labs-grid">
              {displayLabs.map((lab, index) => (
                <motion.div
                  key={lab._id || index}
                  className="lab-card"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                >
                  <div className="lab-header">
                    <div className="lab-icon">{lab.icon || <FiTool />}</div>
                    <h3>{lab.title || lab.name}</h3>
                  </div>
                  <p className="lab-description">{lab.description}</p>

                  <div className="lab-details">
                    <div className="lab-equipment">
                      <h4>Equipment</h4>
                      <ul>
                        {(lab.equipment || []).map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Safety Standards */}
      <section className="section safety-section">
        <div className="container">
          <div className="safety-content">
            <h2 className="section-title text-left">Safety Standards</h2>
            <p>
              All our facilities adhere to strict safety protocols. Proper
              training is provided before equipment access, and safety gear is
              mandatory in all labs.
            </p>
            <ul className="safety-list">
              <li>Mandatory safety induction for all members</li>
              <li>Personal protective equipment provided</li>
              <li>Fire safety and emergency protocols</li>
              <li>Regular equipment maintenance and calibration</li>
              <li>Supervised access for beginners</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Facilities;
