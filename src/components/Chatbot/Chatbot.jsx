import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageCircle, FiX, FiSend, FiUser } from 'react-icons/fi';
import { BsRobot } from 'react-icons/bs';
import './Chatbot.css';

// Default FAQ Data (fallback if API fails)
const defaultFaqData = [
  {
    keywords: ['hello', 'hi', 'hey', 'good morning', 'good evening'],
    response: "Hello! 👋 Welcome to Robozonix Labs! I'm your virtual assistant. How can I help you today?",
  },
  {
    keywords: ['membership', 'plans', 'pricing', 'cost', 'price', 'fee'],
    response: "We offer 4 membership plans:\n\n🆓 **Free** - Basic access\n💎 **Basic** - ₹999/month\n⭐ **Standard** - ₹1,999/month\n👑 **Premium** - ₹4,999/month\n\nVisit our Membership page for full details!",
  },
  {
    keywords: ['contact', 'email', 'phone'],
    response: "You can reach us at:\n\n📧 info@robozonix.com\n📞 +91 98765 43210\n\nOr visit our Contact page!",
  },
];

const defaultQuickReplies = [
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
  
  // Dynamic data from API
  const [faqData, setFaqData] = useState(defaultFaqData);
  const [quickReplies, setQuickReplies] = useState(defaultQuickReplies);

  // Fetch chatbot responses from API
  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const res = await fetch('/api/content/chatbot');
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setFaqData(data);
            // Extract quick replies
            const qr = data
              .filter(item => item.isQuickReply && item.quickReplyLabel)
              .map(item => item.quickReplyLabel);
            if (qr.length > 0) setQuickReplies(qr);
          }
        }
      } catch (err) {
        console.log('Using default chatbot responses');
      }
    };
    fetchResponses();
  }, []);

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
