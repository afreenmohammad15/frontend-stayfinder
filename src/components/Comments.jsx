import React, { useState } from "react";
import "./Comments.css";

const initialComments = [
  {
    id: 1,
    author: "Afreen K.",
    avatar: "A",
    avatarBg: "#8C1D40",
    text: "Lived here for 6 months during my internship at Koramangala. The high-speed Wi-Fi never failed and the food was consistently fresh and homely!",
    date: "2 days ago",
    rating: 5,
    tag: "Verified Resident"
  },
  {
    id: 2,
    author: "Rohan Varma",
    avatar: "R",
    avatarBg: "#10B981",
    text: "Very peaceful study ambiance. The owner responds within minutes whenever anything needs fixing. Highly recommend for students.",
    date: "1 week ago",
    rating: 5,
    tag: "Verified Student"
  }
];

const Comments = () => {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [rating, setRating] = useState(5);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim() === "" || authorName.trim() === "") return;

    const colors = ["#8C1D40", "#D97706", "#2563EB", "#7C3AED", "#059669"];
    const randomBg = colors[Math.floor(Math.random() * colors.length)];

    const comment = {
      id: Date.now(),
      author: authorName,
      avatar: authorName.charAt(0).toUpperCase(),
      avatarBg: randomBg,
      text: newComment,
      date: "Just now",
      rating: Number(rating),
      tag: "Community Reviewer"
    };

    setComments([comment, ...comments]);
    setNewComment("");
    setAuthorName("");
  };

  return (
    <div className="glass-comments-wrapper">
      {/* Existing Comments List */}
      <div className="comments-stream">
        {comments.map((comment) => (
          <div key={comment.id} className="comment-card-glass glass-panel">
            <div className="comment-user-row">
              <div 
                className="user-avatar-badge" 
                style={{ backgroundColor: comment.avatarBg || "var(--primary-burgundy)" }}
              >
                {comment.avatar || comment.author.charAt(0)}
              </div>
              <div className="user-meta-info">
                <div className="name-and-tag">
                  <strong>{comment.author}</strong>
                  <span className="resident-pill">{comment.tag || "Resident"}</span>
                </div>
                <div className="rating-date-row">
                  <span className="stars-row">{"★".repeat(comment.rating || 5)}</span>
                  <span className="dot-sep">•</span>
                  <span className="comment-date-text">{comment.date}</span>
                </div>
              </div>
            </div>
            <p className="comment-message-body">{comment.text}</p>
          </div>
        ))}
      </div>

      {/* Add Comment Form */}
      <form className="glass-comment-form glass-panel" onSubmit={handleSubmit}>
        <div className="form-header-line">
          <h4>Leave a Review or Question</h4>
          <div className="rating-select-wrap">
            <label>Rating:</label>
            <select value={rating} onChange={(e) => setRating(e.target.value)}>
              <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
              <option value="4">⭐⭐⭐⭐ (4/5)</option>
              <option value="3">⭐⭐⭐ (3/5)</option>
            </select>
          </div>
        </div>

        <input
          type="text"
          className="glass-input-field"
          placeholder="Your full name (e.g., Sneha Reddy)"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          required
        />

        <textarea
          className="glass-textarea-field"
          placeholder="Share your experience about food, Wi-Fi, rooms, or ask a question to current tenants..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows="3"
          required
        />

        <button type="submit" className="pill-btn-burgundy submit-review-btn">
          Post Review to StayFinder
        </button>
      </form>
    </div>
  );
};

export default Comments;
