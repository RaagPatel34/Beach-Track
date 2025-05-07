"use client";
import "../../styles/write-review.css";
import React, { useState, useEffect } from "react"; // Import useEffect
import { useSearchParams } from 'next/navigation'; // Import useSearchParams
import axios from 'axios';
import { toast } from "react-toastify";
import { useUser } from '@clerk/nextjs';

export default function WriteReview() {
  const searchParams = useSearchParams(); // Hook to get URL params
  const initialClassroom = searchParams.get('classroom') || ""; // Get classroom from URL, default to ""
  const [timeStamp, setTimeStamp] = useState("");
  const { user } = useUser();

  // State variable "data" that will hold the forms metadata
  const [data, setData] = useState({
    classroom: initialClassroom, // Initialize with classroom from URL
    author: '',
    rating: 1,
    comment: "",
  });

  useEffect(() => {
    if (user) {
      setData(prevData => ({
        ...prevData,
        author: user.username ?? 'Unknown', // fallback if username is null
      }));
    }
  }, [user]);

  useEffect(() => {
    const classroomParam = searchParams.get('classroom') || "";
    if (classroomParam !== data.classroom) {
      setData(prevData => ({ ...prevData, classroom: classroomParam }));
    }
  }, [searchParams, data.classroom]); // Re-run if searchParams or data.classroom changes
  const [comment, setComment] = useState("");
  const maxLength = 300;

  const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(event.target.value.slice(0, maxLength)); // Enforces the limit
  };

  useEffect(() => {
    const currentDate = new Date();
    const formatted = currentDate.toLocaleString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    setTimeStamp(formatted);
  }, []);

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: name === "rating" ? Number(value) : value, }));
  }

  const onSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevents the default submission behavior

    const formData = new FormData();
    formData.append('classroom', data.classroom);
    formData.append('author', data.author);
    formData.append('rating', data.rating.toString());
    formData.append('comment', data.comment);

    try {
      const response = await axios.post('/api/review', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      if (response.data.success) {
        toast.success(response.data.msg);
        setData({
          classroom: '',
          author: '',
          rating: 1,
          comment: ''
        });

        window.location.href = "/";
      } else {
        toast.error('Error: could not submit');
      }

    } catch (error) {
      toast.error('Error: something happened when submitting');
    }
  };

  return (
    <>
      <form onSubmit={onSubmitHandler}>
        <div className="write-review-container">
          <div className="content-wrapper">
            <div className="review-card">
              <div className="card-header">
                <a href="/">
                  <button type="button" className="back-button">Back</button>
                </a>
                <h1>Write Review</h1>
              </div>

              <div className="course-info">
                <span className="status-dot"></span>
                <span className="course-code">{data.classroom || "Classroom"}</span> {/* Display classroom from state */}
              </div>

              <div className="timestamp">{timeStamp}</div>

              <div className="gray-container">
                <div className="rating-section">
                  <label>Rating</label>
                  <div className="rating-input">
                    <input
                      name="rating"
                      onChange={onChangeHandler}
                      value={data.rating}
                      type="number"
                      min="1"
                      max="5"
                      step="0.5"
                      onKeyDown={(e) => e.preventDefault()}
                    />
                    <span>/ 5</span>
                  </div>
                </div>

                <div className="comment-section">
                  <label>Comment</label>
                  <textarea
                    name="comment"
                    placeholder="Enter comment (optional, max 300 characters)"
                    value={data.comment} // Ensures the value is controlled by the state
                    onChange={(e) => {
                      handleCommentChange(e);
                      onChangeHandler(e);
                    }} // Updates the state
                  ></textarea>
                  <div className="char-counter">
                    {data.comment.length}/{maxLength} characters
                  </div>
                </div>

                <div className="notice">
                  * All BeachTrack users will be able to view your review.
                  Inappropriate submissions will be removed.
                </div>
              </div>

              <button type="submit" className="post-button">Post</button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
