import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageCircle, FiX, FiSend, FiUser } from 'react-icons/fi';
import { BsRobot } from 'react-icons/bs';
import './Chatbot.css';

// FAQ Data for Robozonix
const faqData = [
  {
    keywords: ['hello', 'hi', 'hey', 'good morning', 'good evening'],
    response: "Hello! 👋 Welcome to Robozonix Labs! I'm your virtual assistant. How can I help you today?",
  },
  {
    keywords: ['membership', 'plans', 'pricing', 'cost', 'price', 'fee'],
    response: "We offer 4 membership plans:\n\n🆓 **Free** - Basic access\n💎 **Basic** - ₹999/month\n⭐ **Standard** - ₹1,999/month\n👑 **Premium** - ₹4,999/month\n\nVisit our Membership page for full details!",
  },
  {
    keywords: ['lab', 'hours', 'timing', 'open', 'close', 'schedule'],
    response: "Our labs are open:\n\n📅 Monday - Saturday\n🕐 9:00 AM - 9:00 PM\n\nPremium members get 24/7 access!",
  },
  {
    keywords: ['course', 'courses', 'training', 'learn', 'class', 'workshop'],
    response: "We offer courses in:\n\n🤖 Robotics & ROS\n🚁 Drone Design & Flight\n🔧 3D Printing & CAD\n💻 IoT & Electronics\n🧠 AI & Machine Learning\n\nCheck our Courses page for details!",
  },
  {
    keywords: ['facilities', 'equipment', 'tools', 'machines', 'lab'],
    response: "Our facilities include:\n\n🔧 Robotics Lab\n⚡ Electronics Lab\n🖨️ 3D Printing Lab\n🚁 Drone Testing Area\n💻 Computer Lab\n\nAll equipped with industry-grade tools!",
  },
  {
    keywords: ['contact', 'email', 'phone', 'call', 'reach', 'address', 'location'],
    response: "You can reach us at:\n\n📧 info@robozonix.com\n📞 +91 98765 43210\n📍 Kolkata, West Bengal, India\n\nOr visit our Contact page!",
  },
  {
    keywords: ['certificate', 'certification', 'certified'],
    response: "Yes! All our courses include:\n\n📜 Industry-recognized certificates\n✅ Completion badges\n🏆 Skills verification\n\nCertificates are valid worldwide!",
  },
  {
    keywords: ['register', 'signup', 'join', 'account', 'create'],
    response: "To join Robozonix Labs:\n\n1️⃣ Click 'Join Lab' button\n2️⃣ Fill your details\n3️⃣ Choose a membership plan\n4️⃣ Start learning!\n\nIt takes less than 2 minutes!",
  },
  {
    keywords: ['project', 'projects', 'build', 'make', 'create'],
    response: "Members can work on exciting projects like:\n\n🤖 Autonomous Robots\n🚁 Custom Drones\n🏠 Smart Home Systems\n🎮 Robotic Arms\n\nWe provide guidance and resources!",
  },
  {
    keywords: ['event', 'events', 'hackathon', 'competition', 'workshop'],
    response: "We host regular events:\n\n🏆 Monthly Hackathons\n📚 Weekend Workshops\n🎤 Tech Talks\n🤝 Networking Sessions\n\nCheck our Events page for upcoming ones!",
  },
  {
    keywords: ['thank', 'thanks', 'bye', 'goodbye'],
    response: "You're welcome! 😊 Feel free to ask if you have more questions. Happy building! 🚀",
  },
];

// Quick reply suggestions
const quickReplies = [
  'Membership Plans',
  'Lab Timings',
  'Available Courses',
  'Contact Info',
];

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: "Hi! 👋 I'm RoboBot, your Robozonix assistant. How can I help you today?",
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const findResponse = (input) => {
    const lowerInput = input.toLowerCase();
    
    for (const faq of faqData) {
      if (faq.keywords.some(keyword => lowerInput.includes(keyword))) {
        return faq.response;
      }
    }
    
    return "I'm not sure about that. You can:\n\n• Ask about memberships, courses, or facilities\n• Contact us at info@robozonix.com\n• Visit our Contact page for more help\n\nWhat else would you like to know?";
  };

  const handleSend = (text = inputValue) => {
    if (!text.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { type: 'user', text }]);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const response = findResponse(text);
      setMessages(prev => [...prev, { type: 'bot', text: response }]);
      setIsTyping(false);
    }, 800 + Math.random() * 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        className={`chatbot-toggle ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Toggle chat"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <FiX size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <BsRobot size={26} />
            </motion.div>
          )}
        </AnimatePresence>
        {!isOpen && (
          <span className="chat-badge">1</span>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chatbot-window"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="chatbot-header">
              <div className="chatbot-header-info">
                <div className="chatbot-avatar">
                  <BsRobot size={20} />
                </div>
                <div>
                  <h4>RoboBot</h4>
                  <span className="status">● Online</span>
                </div>
              </div>
              <button className="close-btn" onClick={() => setIsOpen(false)}>
                <FiX />
              </button>
            </div>

            {/* Messages */}
            <div className="chatbot-messages">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  className={`message ${msg.type}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {msg.type === 'bot' && (
                    <div className="message-avatar">
                      <BsRobot />
                    </div>
                  )}
                  <div className="message-content">
                    {msg.text.split('\n').map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                  {msg.type === 'user' && (
                    <div className="message-avatar user-avatar">
                      <FiUser />
                    </div>
                  )}
                </motion.div>
              ))}
              
              {isTyping && (
                <div className="message bot">
                  <div className="message-avatar">
                    <BsRobot />
                  </div>
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            <div className="quick-replies">
              {quickReplies.map((reply, index) => (
                <button
                  key={index}
                  className="quick-reply-btn"
                  onClick={() => handleSend(reply)}
                >
                  {reply}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="chatbot-input">
              <input
                type="text"
                placeholder="Type a message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button 
                className="send-btn" 
                onClick={() => handleSend()}
                disabled={!inputValue.trim()}
              >
                <FiSend />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
