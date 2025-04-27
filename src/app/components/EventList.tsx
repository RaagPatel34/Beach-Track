import axios from 'axios';
import React, { useEffect, useState } from 'react';
import "../../styles/event-list.css";
import { useUser } from '@clerk/nextjs';

interface Event {
    _id: string;
    title: string;
    type: string;
    author: string;
    date: string;
    startTime: string;
    endTime: string;
    location: string;
    description: string;
}

const EventList = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await axios.get<{ bulletins: Event[] }>('/api/bulletin');
            setEvents(response.data.bulletins);
        } catch (error) {
            console.error("Error fetching events:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchEvents();
    }, [])

    const closeEventView = () => {
        setSelectedEvent(null);
    }

    if (selectedEvent) {
        return (
            <div className="onClickRectangle">
                <button onClick={closeEventView} className="closeView">
                    ✕
                </button>
                <h1 className="onClickTitle"> {selectedEvent.title} </h1>
                <p className="onClickAuthor"> 
                    By: {selectedEvent.author}
                </p>
                <p className="onClickDate">
                    When: {new Date(selectedEvent.date).toLocaleDateString()}
                </p>
                <p className="onClickStartEnd"> 
                    Start Time: {selectedEvent.startTime} | End Time: {selectedEvent.endTime} 
                </p>
                <p className="onClickDescription">
                    {selectedEvent.description}
                </p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="mainContainer">
                <div className="rectangleTitle">
                    Upcoming Events Around CSULB!
                </div>
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p className="loading-text">Loading Events...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="mainContainer">
                <div className="rectangleTitle">
                    Upcoming Events Around CSULB!
                </div>

                <div className="container">
                    {events
                        ?.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .slice(0, 3)
                        .map((event) => (
                            <button key={event._id} onClick={() => setSelectedEvent(event)} className="rectangle">
                                <h2 className="eventTitle">{event.title}</h2>
                                <p className="eventAuthor">By: {event.author}</p>
                            </button>
                        ))}
                </div>

                <a href = {'/post-event'}>
                    <button className='goToBulletin'>
                        Click to View Bulletin!
                    </button>
                </a>
            </div>
        </>
    );
}

export default EventList;
