import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiCheck, FiArrowRight } from "react-icons/fi";
import "./Membership.css";

const Membership = () => {
  const plans = [
    {
      name: "Student Plan",
      price: "₹999",
      period: "/month",
      description: "Perfect for students starting their robotics journey.",
      features: [
        "10 hours lab access/month",
        "Basic machinery access",
        "Community support",
        "Online resources",
        "Workshop discounts",
      ],
      highlighted: false,
    },
    {
      name: "Pro Maker Plan",
      price: "₹2,499",
      period: "/month",
      description: "For serious makers and hobbyists.",
      features: [
        "30 hours lab access/month",
        "All machinery access",
        "Expert mentorship (2hrs)",
        "Priority equipment booking",
        "Course discounts (20%)",
      ],
      highlighted: true,
    },
    {
      name: "Startup Plan",
      price: "₹4,999",
      period: "/month",
      description: "For startups building prototypes and MVPs.",
      features: [
        "Unlimited lab access",
        "All machinery + priority",
        "Dedicated mentor support",
        "Incubation support",
        "Pitch day access",
      ],
      highlighted: false,
    },
    {
      name: "Institutional",
      price: "Custom",
      period: "",
      description: "For colleges and organizations.",
      features: [
        "Bulk student access",
        "Custom training programs",
        "On-site workshops",
        "Equipment on-loan",
        "Dedicated coordinator",
      ],
      highlighted: false,
    },
  ];

  return (
    <div className="membership-page">
      <section className="page-hero">
        <div className="container">
          <motion.div
            className="page-hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="section-subtitle">Join Us</span>
            <h1 className="page-title">Membership Plans</h1>
            <p className="page-description">
              Choose the plan that fits your needs and start building today.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section plans-section">
        <div className="container">
          <div className="plans-grid">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                className={`plan-card ${plan.highlighted ? "highlighted" : ""}`}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
              >
                {plan.highlighted && (
                  <span className="plan-badge">Most Popular</span>
                )}
                <h3 className="plan-name">{plan.name}</h3>
                <div className="plan-price">
                  <span className="price">{plan.price}</span>
                  <span className="period">{plan.period}</span>
                </div>
                <p className="plan-description">{plan.description}</p>
                <ul className="plan-features">
                  {plan.features.map((feature, i) => (
                    <li key={i}>
                      <FiCheck /> {feature}
                    </li>
                  ))}
                </ul>
                <button
                  className={`btn ${plan.highlighted ? "btn-primary" : "btn-secondary"}`}
                >
                  Subscribe Now <FiArrowRight />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section comparison-section">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Payment</span>
            <h2 className="section-title">Payment Gateway</h2>
            <p className="section-description">
              Secure payment integration coming soon. Contact us for manual
              enrollment.
            </p>
          </div>
          <div className="payment-notice">
            <p>
              💳 Payment gateway integration will be available soon. For now,
              please <Link to="/contact">contact us</Link> to subscribe
              manually.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Membership;
