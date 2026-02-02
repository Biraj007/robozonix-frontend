import { motion } from "framer-motion";
import {
  FiCpu,
  FiZap,
  FiSettings,
  FiActivity,
  FiCloud,
  FiTool,
} from "react-icons/fi";
import "./Facilities.css";

const Facilities = () => {
  const labs = [
    {
      icon: <FiZap />,
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
      useCases: ["Circuit Design", "Testing & Debugging", "Signal Analysis"],
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
      useCases: ["PCB Prototyping", "SMD Assembly", "Custom Electronics"],
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
      useCases: ["Robot Programming", "Automation", "Motion Control"],
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
      useCases: ["Drone Design", "Flight Testing", "UAV Development"],
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
      useCases: ["IoT Prototyping", "Cloud Integration", "Smart Systems"],
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
      useCases: ["Rapid Prototyping", "Custom Parts", "Mechanical Design"],
    },
  ];

  const machinery = [
    { name: "Oscilloscopes & DSO", category: "Testing" },
    { name: "Logic Analyzer", category: "Testing" },
    { name: "LDI Machine", category: "Fabrication" },
    { name: "PCB Etching System", category: "Fabrication" },
    { name: "Robotic Arms & Actuators", category: "Robotics" },
    { name: "CNC Machine", category: "Fabrication" },
    { name: "Laser Cutter", category: "Fabrication" },
    { name: "3D Printers (FDM/SLA)", category: "Fabrication" },
    { name: "Drone Thrust Test Stand", category: "Testing" },
    { name: "Sensors & Controllers", category: "Electronics" },
    { name: "Reflow Oven", category: "Fabrication" },
    { name: "SMD Workstation", category: "Electronics" },
  ];

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
          <div className="labs-grid">
            {labs.map((lab, index) => (
              <motion.div
                key={index}
                className="lab-card"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
              >
                <div className="lab-header">
                  <div className="lab-icon">{lab.icon}</div>
                  <h3>{lab.title}</h3>
                </div>
                <p className="lab-description">{lab.description}</p>

                <div className="lab-details">
                  <div className="lab-equipment">
                    <h4>Equipment</h4>
                    <ul>
                      {lab.equipment.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="lab-usecases">
                    <h4>Industry Use-Cases</h4>
                    <div className="usecase-tags">
                      {lab.useCases.map((useCase, i) => (
                        <span key={i} className="badge">
                          {useCase}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Machinery Section */}
      <section className="section machinery-section">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Equipment</span>
            <h2 className="section-title">Machinery & Instruments</h2>
            <p className="section-description">
              Our labs are equipped with professional-grade equipment for all
              your project needs.
            </p>
          </div>

          <div className="machinery-grid">
            {machinery.map((item, index) => (
              <motion.div
                key={index}
                className="machinery-item"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.03, duration: 0.3 }}
              >
                <span className="machinery-name">{item.name}</span>
                <span className="machinery-category badge">
                  {item.category}
                </span>
              </motion.div>
            ))}
          </div>
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
