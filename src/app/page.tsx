"use client";
import EventList from "./components/EventList";
import { useState, useEffect } from "react";
import "../styles/homepage.css";
import "../styles/search-bar-results.css";
import dynamic from "next/dynamic";
import { LatLngExpression } from "leaflet";
import { buildingMap } from "../../lib/data/buildingMap"; // Import buildingMap dictionary

const DynamicMap = dynamic(() => import("./components/Map"), { ssr: false });

interface Building {
    name: string;
    position: LatLngExpression;
    description: string;
}

interface Classroom {
    _id: string;
    courseName: string;
    sectionNumber: string;
    courseID: string;
    courseType: string;
    days: string;
    startTime: string;
    endTime: string;
    building: string;
    room: string;
    location: string;
    instructor: string;
}

export default function Home() {
    const [activeTab, setActiveTab] = useState("favorite");
    const [isSearching, setIsSearching] = useState(false); // Will be used to hide tabs
    const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
    const [searchResults, setSearchResults] = useState<Classroom[]>([]); // Array to store search results
    const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null);
    const [searchTerm, setSearchTerm] = useState(""); // For holding the search term
    const [currentPage, setCurrentPage] = useState(1);  // Tracks pagination
    const [buildingClassrooms, setBuildingClassrooms] = useState<any[]>([]); // Store classrooms of selected building
    const [classroomPage, setClassroomPage] = useState(1);

    // Ensure "Overview" is selected when a building is clicked
    useEffect(() => {
        if (selectedBuilding) {
            setActiveTab("overview");
            fetchBuildingClassrooms(selectedBuilding.name);
        }
    }, [selectedBuilding]);

    const fetchBuildingClassrooms = async (buildingName: string) => {
        try {
            const buildingAbbrev = buildingMap[buildingName] || buildingName;
            const response = await fetch(`/api/search?search=${buildingAbbrev}`);
            const data = await response.json();
            setBuildingClassrooms(data);
            setClassroomPage(1);
        } catch (error) {
            console.error("Error fetching classrooms:", error);
        }
    };

    // Handle the search query submission
    const handleSearch = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!searchTerm) return;

        try {
            const response = await fetch(`/api/search?search=${searchTerm}`);
            const data = await response.json();
            setSearchResults(data); // Update the state with the search results
            setCurrentPage(1);
            setIsSearching(true); // Hide tabs when searching
        } catch (error) {
            console.error("Error fetching search results:", error);
        }
    };

    // Function to reset search and bring back tabs
    const clearSearch = () => {
        setSearchResults([]);
        setSearchTerm("");
        setIsSearching(false);
    };

    // Closes the clicked on window.
    const closeClassroomView = () => {
        setSelectedClassroom(null);
    }

    // Helper function that converts military time to AM/PM
    const formatTime = (time: string) => {
        if (!time) return ""; // Handles empty cases
        const [hours, minutes] = time.split(":").map(Number);  // Splits the time between hours and minutes
        const period = hours >= 12 ? "PM" : "AM"; // Determine if it's AM or PM
        const formattedHours = hours % 12 || 12; // Converts 0 (midnight) and 12 (afternoon) correctly
        return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
    }

    return (
        <div className="page-container">
            <div className="content-wrapper">
                {/* Sidebar that gets fully replaced when a building is selected */}
                <div className={`left-content ${selectedBuilding ? "expanded" : ""}`}>
                    {selectedBuilding ? (
                        <div className="building-info full-sidebar">
                            <h2 className="sidebar-building-name">{selectedBuilding.name}</h2>
                            <p>{selectedBuilding.description}</p>

                            <div className="tab-navigation">
                                <button className={`tab-button ${activeTab === "overview" ? "active" : ""}`} onClick={() => setActiveTab("overview")}>Overview</button>
                                <button className={`tab-button ${activeTab === "reviews" ? "active" : ""}`} onClick={() => setActiveTab("reviews")}>Reviews</button>
                            </div>

                            {activeTab === "overview" && (
                                <div className="search-results">
                                    {buildingClassrooms.length > 0 ? (
                                        <>
                                            <ul>
                                                {buildingClassrooms.slice((classroomPage - 1) * 5, classroomPage * 5).map((classroom, index) => (
                                                    <li key={index} className="search-item">
                                                        <h3>{classroom.courseName}</h3>
                                                        <h3>Location: {classroom.location}</h3>
                                                        <p>Time: {classroom.startTime} - {classroom.endTime}, {classroom.days}</p>
                                                    </li>
                                                ))}
                                            </ul>
                                            {buildingClassrooms.length > 5 && (
                                                <div className="pagination-buttons">
                                                    <button
                                                        onClick={() => setClassroomPage((prev) => Math.max(prev - 1, 1))}
                                                        disabled={classroomPage === 1}
                                                        className="pagination-button previous-button">
                                                        &#8592; Previous
                                                    </button>
                                                    <button
                                                        onClick={() => setClassroomPage((prev) => Math.min(prev + 1, Math.ceil(buildingClassrooms.length / 5)))}
                                                        disabled={classroomPage === Math.ceil(buildingClassrooms.length / 5)}
                                                        className="pagination-button next-button">
                                                        Next &#8594;
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <p>No classrooms found for this building.</p>
                                    )}
                                </div>
                            )}
                            <button className="close-button" onClick={() => setSelectedBuilding(null)}>
                                &#10006; Close
                            </button>
                        </div>

                    ) : (
                        <>
                            <div className="search-wrapper">
                                <form onSubmit={handleSearch}>
                                    <div className="search-bar">
                                        <button className="menu-button">☰</button>
                                        <input
                                            type="text"
                                            placeholder="Search by building or classroom"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                        <button type="submit" className="search-button">🔍</button>
                                    </div>
                                </form>
                            </div>

                            {/* Only show search results and pagination if no classroom is selected */}
                            {!selectedClassroom && (
                                <>
                                    {/* Show 'Go Back' button that returns user back*/}
                                    {isSearching && (
                                        <button className="clear-search-button" onClick={clearSearch}>
                                            Clear Search Bar
                                        </button>
                                    )}
                                    <div className="search-results">
                                        <ul>
                                            {searchResults.slice((currentPage - 1) * 6, currentPage * 6).map((result, index) => (
                                                <button key={index} onClick={() => setSelectedClassroom(result)} className="search-item">
                                                    <h3 className="course-name">{result.courseName}</h3>
                                                    <h3 className="location-name">Location: {result.location}</h3>
                                                    <p className="time-day">Time: {formatTime(result.startTime)} - {formatTime(result.endTime)}, Days: {result.days}</p>
                                                </button>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Show Pagination only when search results exist */}
                                    {searchResults.length > 5 && (
                                        <div className="pagination-buttons">
                                            <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                                                Previous
                                            </button>
                                            <button
                                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(searchResults.length / 6)))}
                                                disabled={currentPage === Math.ceil(searchResults.length / 6)}
                                            >
                                                Next
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Ensure the selected classroom UI is here without replacing other elements */}
                            {selectedClassroom && (
                                <div className="onClickClassroomRectangle">
                                    <button onClick={closeClassroomView} className="closeClassroomView">✕</button>
                                    <h1 className="onClickClassroomTitle"> {selectedClassroom.courseName}</h1>
                                    <p>
                                        <span className="sectionText">Section:</span>
                                        <span className="onClickClassroomSectionNum"> {selectedClassroom.sectionNumber} </span>
                                    </p>
                                    <p>
                                        <span className="profText">Professor:</span>
                                        <span className="onClickClassroomProf"> {selectedClassroom.instructor}</span>
                                    </p>
                                    <p>
                                        <span className="dayText">Days Occuring:</span>
                                        <span className="onClickClassroomDate"> {selectedClassroom.days}</span>
                                    </p>
                                    <p>
                                        <span className="startText">Start Time:</span>
                                        <span className="onClickClassroomStartEnd"> {formatTime(selectedClassroom.startTime)} |</span>
                                        <span className="endText">End Time:</span>
                                        <span className="onClickClassroomStartEnd"> {formatTime(selectedClassroom.endTime)}</span>
                                    </p>
                                    <p>
                                        <span className="buildingText">Building:</span>
                                        <span className="onClickClassroomLocation"> {selectedClassroom.building} |</span>
                                        <span className="roomText">Room:</span>
                                        <span className="onClickClassroomLocation"> {selectedClassroom.room}</span>
                                    </p>
                                    <p>
                                        <span className="idText">CourseID:</span>
                                        <span className="onClickClassroomCourseID"> {selectedClassroom.courseID}</span>
                                    </p>

                                    <a href={`/write-review?classroom=${encodeURIComponent(selectedClassroom.location)}`}>
                                        <button className="createReview">Click to Review Classroom!</button>
                                    </a>

                                </div>
                            )}

                            {!isSearching && (
                                <>
                                    <div className="tab-navigation">
                                        <button
                                            className={`tab-button ${activeTab === "favorite" ? "active" : ""}`}
                                            onClick={() => setActiveTab("favorite")}
                                        >
                                            Favorites
                                        </button>
                                        <button
                                            className={`tab-button ${activeTab === "openRooms" ? "active" : ""}`}
                                            onClick={() => setActiveTab("openRooms")}
                                        >
                                            Open Rooms
                                        </button>
                                        <button
                                            className={`tab-button ${activeTab === "events" ? "active" : ""}`}
                                            onClick={() => setActiveTab("events")}
                                        >
                                            Events
                                        </button>
                                    </div>

                                    <div className="content-area">
                                        {activeTab === "favorite" && <div className="no-content-message">No favorite classrooms</div>}
                                        {activeTab === "openRooms" && <div className="no-content-message"></div>}
                                        {activeTab === "events" && <div className="no-content-message"><EventList /></div>}
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>

                <div className="right-content">
                    <DynamicMap 
                    selectedBuilding={selectedBuilding} 
                    setSelectedBuilding={setSelectedBuilding} 
                    setSearchResults={setSearchResults} 
                    />
                </div>

            </div>
        </div>
    );
}
