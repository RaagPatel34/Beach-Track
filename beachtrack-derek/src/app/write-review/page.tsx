"use client";
import "../../styles/write-review.css";
import { useState } from "react";

export default function WriteReview() {
  const [comment, setComment] = useState("");
  const maxLength = 300;

  const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(event.target.value.slice(0, maxLength)); // Enforces the limit
  };

  return (
    <div className="write-review-container">
      <div className="content-wrapper">
        <div className="review-card">
          <div className="card-header">
            <button className="back-button">Back</button>
            <h1>Write Review</h1>
          </div>

          <div className="course-info">
            <span className="status-dot"></span>
            <span className="course-code">Room-Number</span>
          </div>

          <div className="timestamp">MM/DD/YYYY, Time</div>

          <div className="gray-container">
            <div className="rating-section">
              <label>Rating</label>
              <div className="rating-input">
                <input
                  type="number"
                  defaultValue="4.5"
                  min="1"
                  max="5"
                  step="0.5"
                />
                <span>/ 5</span>
              </div>
            </div>

            <div className="comment-section">
              <label>Comment</label>
              <textarea
                placeholder="Enter comment (optional, max 300 characters)"
                value={comment} // Ensures the value is controlled by the state
                onChange={handleCommentChange} // Updates the state
              ></textarea>
              <div className="char-counter">
                {comment.length}/{maxLength} characters
              </div>
            </div>

            <div className="notice">
              * All BeachTrack users will be able to view your review.
              Inappropriate submissions will be removed.
            </div>
          </div>

          <button className="post-button">Post</button>
        </div>
      </div>
    </div>
  );
}
