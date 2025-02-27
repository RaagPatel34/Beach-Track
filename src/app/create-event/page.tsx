"use client";
import "../../styles/create-event.css";
import React, { useState } from "react";
import axios from 'axios';
import { toast } from "react-toastify";
import { useUser } from "@clerk/nextjs";

export default function CreateEvent() {
  const [description, setDescription] = useState("");
  const maxLength = 300;

  const [title, setTitle] = useState("");
  const maxTitleLength = 25;

  const { user } = useUser();
  const [author, setAuthor] = useState("Unknown");

  const [selectedDate, setSelectedDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [eventType, setEventType] = useState("");

    /* Use this to re-render the useUser since user may be originally undefined before clerk can load
     the data */
  useEffect(() => {
    if (user?.username) {
      setAuthor(user.username);
    }
  }, [user]);

  /*
  const [data, setData] = useState({
    author: "",
    location: "",
  });
  */

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value.slice(0, maxLength));
  };

  const handleTimeChange = (timeType: "start" | "end", value: string) => {
    if (timeType === "start") {
      setStartTime(value);
    } else {
      setEndTime(value);
    }
  };

  /*
  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: name === 'title' ? Number(value) : value, }));
  }
  */

  const onSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if all fields are filled
    if (!title || !selectedDate || !startTime || !endTime || !description) {
      alert("Please fill out all fields.");
      return;
    }

    // Validate time difference (must be between 1 min and 2 hours)
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);
    const startInMinutes = startHour * 60 + startMinute;
    const endInMinutes = endHour * 60 + endMinute;
    const diffInMinutes = endInMinutes - startInMinutes;

    if (diffInMinutes <= 0 || diffInMinutes > 120) {
      alert("Invalid time range: Duration must be between 1 minute and 2 hours.");
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('type', eventType);
    formData.append('author', author);
    formData.append('date', selectedDate);
    formData.append('startTime', startTime);
    formData.append('endTime', endTime);
    formData.append('location', "someplace");
    formData.append('description', description);

    try {
      const response = await axios.post('api/bulletin', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      if (response.data.success) {
        toast.success(response.data.msg);
        setTitle("");
        setEventType("");
        setSelectedDate("");
        setStartTime("");
        setEndTime("");
        setDescription("");
      } else {
        toast.error("Error: Could not submit");
      }
    } catch (error) {
      toast.error("Error: Something happened when submitting")
    }
  };

  return (
    <form onSubmit={onSubmitHandler}>
      <div className="create-event-container">
        <div className="content-wrapper">
          <div className="event-card">
            <div className="card-header">
              <h1>Create Event</h1>
            </div>

            <div className="course-info">
              <span className="status-dot"></span>
              <span className="course-code">Room-Number</span>
            </div>

            <div className="gray-container">
              <div className="form-section">
                <label>Type</label>
                <select
                  className="form-input"
                  value={eventType}
                  onChange={(e) =>
                    setEventType(e.target.value)}
                >
                  <option value="" disabled>Select event type</option>
                  <option value="Major">Major</option>
                  <option value="Misc.">Misc.</option>
                </select>
              </div>

              <div className="form-section">
                <label>Title</label>
                <input
                  type="text"
                  placeholder="Enter title"
                  className="form-input"
                  maxLength={maxTitleLength}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <div className="char-counter">{title.length}/{maxTitleLength} characters</div>
              </div>

              <div className="form-row">
                <div className="form-section">
                  <label>Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="form-section">
                  <label>Time</label>
                  <div className="time-input-group">
                    <input
                      type="time"
                      className="time-input"
                      value={startTime}
                      onChange={(e) => handleTimeChange('start', e.target.value)}
                    />
                    <span className="time-separator">-</span>
                    <input
                      type="time"
                      className="time-input"
                      value={endTime}
                      onChange={(e) => handleTimeChange('end', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <label>Description</label>
                <textarea
                  placeholder="Enter description"
                  value={description}
                  onChange={handleDescriptionChange}
                  className="form-textarea"
                ></textarea>
                <div className="char-counter">
                  {description.length}/{maxLength} characters
                </div>
              </div>
            </div>

            <button className="back-button">Back</button>
            <button type="submit" className="create-button">
              Create
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
