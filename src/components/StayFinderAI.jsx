import React, { useState } from "react";
import { Link } from "react-router-dom";
import { defaultProperties } from "../data/properties";
import "./StayFinderAI.css";

function StayFinderAI({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello! I'm your StayFinder AI assistant. Tell me your preferred location, budget, or requirements (e.g., 'Furnished apartment in Koramangala under ₹15,000' or 'Student PG with food'), and I'll find your perfect stay!",
      recommendations: []
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  if (!isOpen) return null;

  const handleSend = (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMessage = { sender: "user", text: query };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const q = query.toLowerCase();
      // Match properties based on user query
      let matches = defaultProperties.filter((p) => {
        const matchesLoc = p.location.toLowerCase().includes(q) || p.city.toLowerCase().includes(q);
        const matchesType = p.type.toLowerCase().includes(q);
        const matchesFood = q.includes("food") ? p.foodIncluded : true;
        const matchesBudget = q.includes("10000") || q.includes("10k") ? p.rent <= 10000 :
                              q.includes("15000") || q.includes("15k") ? p.rent <= 16000 :
                              q.includes("20000") || q.includes("20k") ? p.rent <= 20000 : true;
        return matchesLoc || matchesType || (matchesFood && matchesBudget);
      });

      if (matches.length === 0) {
        matches = defaultProperties.slice(0, 3);
      } else {
        matches = matches.slice(0, 3);
      }

      const aiResponse = {
        sender: "ai",
        text: `I found ${matches.length} curated stays matching your preferences! Here are the best options ranked by your match score:`,
        recommendations: matches
      };

      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 700);
  };

  const quickPrompts = [
    "Furnished hostel or PG in Madhapur under ₹12,000 with food",
    "Student PG near Koramangala with food",
    "Co-living hub with high-speed Wi-Fi and gym",
    "Budget hostel under ₹8,000"
  ];

  return (
    <div className="ai-modal-overlay" onClick={onClose}>
      <div className="ai-modal-container glass-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="ai-header">
          <div className="ai-title-wrap">
            <div className="ai-avatar">
              <span className="sparkle">✨</span>
            </div>
            <div>
              <h3>StayFinder AI</h3>
              <p>Your intelligent stay-finding assistant</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close modal">✕</button>
        </div>

        {/* Chat message history */}
        <div className="ai-chat-body">
          {messages.map((msg, idx) => (
            <div key={idx} className={`chat-bubble-row ${msg.sender}`}>
              {msg.sender === "ai" && (
                <div className="ai-mini-avatar">✨</div>
              )}
              <div className="bubble-content">
                <p className="bubble-text">{msg.text}</p>

                {msg.recommendations && msg.recommendations.length > 0 && (
                  <div className="ai-cards-grid">
                    {msg.recommendations.map((prop) => (
                      <div key={prop.id} className="ai-property-card glass-panel">
                        <div className="card-thumb-wrap">
                          <img src={prop.image} alt={prop.name} />
                          <span className="match-pill">{prop.matchScore}% Match</span>
                        </div>
                        <div className="card-info">
                          <h4>{prop.name}</h4>
                          <p className="loc-text">📍 {prop.location}</p>
                          <div className="price-row">
                            <span className="rent-amount">₹{prop.rent.toLocaleString()}/mo</span>
                            <span className="rating-pill">★ {prop.rating}</span>
                          </div>
                          <Link 
                            to={`/hostel/${prop.id}`} 
                            onClick={onClose} 
                            className="view-btn"
                          >
                            View Details →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="chat-bubble-row ai">
              <div className="ai-mini-avatar">✨</div>
              <div className="typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
        </div>

        {/* Quick prompt suggestions */}
        <div className="ai-quick-prompts">
          {quickPrompts.map((prompt, i) => (
            <button 
              key={i} 
              className="prompt-chip"
              onClick={() => handleSend(prompt)}
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input box */}
        <form className="ai-input-form" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
          <input
            type="text"
            placeholder="Ask StayFinder anything about properties, areas, amenities..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="send-btn" disabled={!input.trim()}>
            ➔
          </button>
        </form>
      </div>
    </div>
  );
}

export default StayFinderAI;
