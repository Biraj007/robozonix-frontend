import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiSearch } from "react-icons/fi";
import { 
  fadeInUp, 
  staggerContainer 
} from "../../utils/animations";
import "./FAQs.css";

const FAQs = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [openFaq, setOpenFaq] = useState(null);

  const categories = [
    "all",
    "Membership",
    "Courses",
    "Lab Access",
    "Safety",
    "Payment",
  ];

  const faqs = [
    {
      id: 1,
      category: "Membership",
      q: "How do I become a member?",
      a: "You can sign up for membership through our website by selecting a plan that suits your needs. After registration and payment, you'll receive access credentials within 24 hours.",
    },
    {
      id: 2,
      category: "Membership",
      q: "Can I upgrade my membership plan?",
      a: "Yes! You can upgrade your plan anytime from your dashboard. The price difference will be prorated for the remaining period.",
    },
    {
      id: 3,
      category: "Courses",
      q: "Are the courses online or offline?",
      a: "We offer both online and offline modes. Some courses are available in hybrid format combining live sessions with practical lab work.",
    },
    {
      id: 4,
      category: "Courses",
      q: "Do I get a certificate after completion?",
      a: "Yes, all our certification programs include a completion certificate recognized by industry partners and valid for professional portfolios.",
    },
    {
      id: 5,
      category: "Lab Access",
      q: "What are the lab timings?",
      a: "Our labs are open Monday to Saturday, 9 AM to 9 PM. Pro Maker and Startup members get access to after-hours slots upon request.",
    },
    {
      id: 6,
      category: "Lab Access",
      q: "Do I need prior experience to use the labs?",
      a: "Beginners are welcome! We provide mandatory safety inductions and optional training sessions for all equipment before you start.",
    },
    {
      id: 7,
      category: "Safety",
      q: "What safety measures are in place?",
      a: "All members undergo safety induction. PPE is provided, and equipment usage is supervised for beginners. Fire safety and first aid facilities are available.",
    },
    {
      id: 8,
      category: "Payment",
      q: "What payment methods do you accept?",
      a: "We accept UPI, credit/debit cards, net banking, and wallet payments. EMI options are available for courses above ₹5,000.",
    },
    {
      id: 9,
      category: "Payment",
      q: "What is your refund policy?",
      a: "We offer a 7-day refund policy for memberships and course registrations. Partial refunds are available beyond 7 days based on usage.",
    },
  ];

  const filteredFaqs =
    activeCategory === "all"
      ? faqs
      : faqs.filter((f) => f.category === activeCategory);

  return (
    <div className="faqs-page">
      <section className="page-hero">
        <div className="container">
          <motion.div
            className="page-hero-content"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <span className="section-subtitle">Help Center</span>
            <h1 className="page-title">Frequently Asked Questions</h1>
            <p className="page-description">
              Find answers to common questions about memberships, courses, lab
              access, and more.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section faqs-section">
        <div className="container">
          {/* Search & Filters */}
          <div className="faqs-header">
            <div className="faqs-search">
              <FiSearch />
              <input type="text" placeholder="Search FAQs..." />
            </div>
            <div className="faqs-filters">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`filter-btn ${activeCategory === cat ? "active" : ""}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat === "all" ? "All Topics" : cat}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Accordion */}
          <motion.div 
            className="faqs-list"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            <AnimatePresence mode="popLayout">
              {filteredFaqs.map((faq) => (
                <motion.div
                  key={faq.id}
                  className={`faq-item ${openFaq === faq.id ? "open" : ""}`}
                  variants={fadeInUp}
                  layout
                >
                  <button
                    className="faq-question"
                    onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                  >
                    <span className="faq-category badge">{faq.category}</span>
                    <span className="faq-text">{faq.q}</span>
                    <FiChevronDown className="faq-icon" />
                  </button>
                  <AnimatePresence>
                    {openFaq === faq.id && (
                      <motion.div
                        className="faq-answer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <p>{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FAQs;
