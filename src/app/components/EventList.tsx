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

    // Starts as an empty array, but is always expected to hold 'Event' objects
    const [ events, setEvents ] = useState<Event[]>([]);
    const [ selectedEvent, setSelectedEvent ] = useState<Event | null>(null);  // Will be used to track the selected event

    const fetchEvents = async () => {
        // Ensures 'response.data' contains an object with a bulletin array, which holds Event objects
        const response = await axios.get<{ bulletins: Event[] }>('/api/bulletin');
        setEvents(response.data.bulletins);
    }

    useEffect(() => {
        fetchEvents();
    }, [])

    const closeEventView = () => {
        setSelectedEvent(null);
    }

    if (selectedEvent) {
        return(
            <div className="onClickRectangle">
                <button onClick={closeEventView} className="closeView">
                    ✕
                </button>
                <h1 className="onClickTitle"> {selectedEvent.title} </h1>
                <p className="onClickAuthor"> 
                    By: {selectedEvent.author}
                </p>
                <p className="onClickDate">
                    When:{' '} {new Date(selectedEvent.date).toLocaleDateString()}
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

    return(
        <div className="container">
            {events?.map((event) => (
                <div key={event._id} onClick={() => setSelectedEvent(event)} className="rectangle">
                    <h2 className="event-title"> {event.title} </h2>
                    <p className="event-author"> By: {event.author} </p>
                </div>
            ))}

            <a href="/create-event">
              <button className='create-event-button'> Click to Create an Event! </button>
            </a>
        </div>
    );
}

export default EventList;
