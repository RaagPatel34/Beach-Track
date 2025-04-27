"use client"
import { useEffect, useState } from "react";
import "../../styles/search-results.css";
import "../../styles/favorite.css";

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

interface Props {
    searchResults: Classroom[];
    setSearchResults: (results: Classroom[]) => void;
    selectedClassroom: Classroom | null;
    setSelectedClassroom: (classroom: Classroom | null) => void;
    isSearching: boolean;
    setIsSearching: (value: boolean) => void;
}

export default function SearchPanel({
    searchResults,
    setSearchResults,
    selectedClassroom,
    setSelectedClassroom,
    isSearching,
    setIsSearching,
}: Props) {
    const [searchTerm, setSearchTerm] = useState("");
    const [timeFilter, setTimeFilter] = useState(""); // State for the time filter input
    const [dateFilter, setDateFilter] = useState(""); // State for the date filter input
    const [showFilters, setShowFilters] = useState(false); // State to control filter visibility
    const [currentPage, setCurrentPage] = useState(1);
    const [isFavorited, setIsFavorited] = useState(false);  // Used to determine if classroom is favorited or not.

    // The useEffect hook is used to check if the current classroom is favorited or not. Will run whenever
    // selectedClassroom changes. Updates the isFavorited state accorrdingly
    useEffect(() => {
        const checkIfFavorited = async () => {
            if (!selectedClassroom) return;

            try {
                // Sends a GET request to retrieve the list of favorited classrooms
                const res = await fetch(`/api/favorite`, {
                    method: "GET",
                    credentials: "include",
                });

                // Error handling
                if (!res.ok) {
                    console.error("Failed to fetch favorites:", await res.text());
                    return;
                }

                const favorites = await res.json();  // Parse response as a JSON

                if (!Array.isArray(favorites)) {
                    console.error("Favorites is not an array:", favorites);
                    return;
                }  // Ensures results are an array

                const match = favorites.find(
                    (fav: any) => fav.classroomLocation === selectedClassroom.location
                );  // Checks if the favorited classrooms match the currently selected one

                setIsFavorited(!!match);
            } catch (err) {
                console.error("Error checking favorite status:", err);
            }
        };

        checkIfFavorited();
    }, [selectedClassroom]);

    const handleSearch = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!searchTerm) return;

        try {
            // Construct the API URL
            let apiUrl = `/api/search?search=${encodeURIComponent(searchTerm)}`;
            if (timeFilter) {
                apiUrl += `&time=${encodeURIComponent(timeFilter)}`; // Add time filter if set
            }
            if (dateFilter) {
                apiUrl += `&date=${encodeURIComponent(dateFilter)}`; // Add date filter if set
            }

            const response = await fetch(apiUrl);
            const data = await response.json();

            // Handle potential errors from the API (like invalid time format)
            if (!response.ok) {
                console.error("Search API Error:", data.error || response.statusText);
                // Optionally, display an error message to the user
                setSearchResults([]); // Clear results on error
            } else {
                setSearchResults(data);
            }
            setCurrentPage(1);
            setIsSearching(true);
        } catch (error) {
            console.error("Error fetching search results:", error);
        }
    };

    const clearSearch = () => {
        setSearchResults([]);
        setSearchTerm("");
        setTimeFilter(""); // Clear the time filter
        setDateFilter(""); // Clear the date filter
        setShowFilters(false); // Hide the filters
        setIsSearching(false);
    };

    const closeClassroomView = () => {
        setSelectedClassroom(null);
    };

    // Helper function that converts military time to AM/PM
    const formatTime = (time: string) => {
        if (!time || typeof time !== "string") return "N/A";

        const parts = time.split(":"); // Splits the time between hours and minutes
        if (parts.length !== 2) return "N/A";

        const [hours, minutes] = parts.map(Number);

        if (
            isNaN(hours) || isNaN(minutes) ||
            hours < 0 || hours > 23 ||
            minutes < 0 || minutes > 59
        ) {
            return "N/A";
        }

        const period = hours >= 12 ? "PM" : "AM"; // Determine if it's AM or PM
        const formattedHours = hours % 12 || 12; // Converts 0 (midnight) and 12 (afternoon) correctly

        return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
    };

    return (
        <div>
            <div className="search-wrapper">
                <form onSubmit={handleSearch}>
                    <div className="search-bar">
                        {/* Use menu button to toggle time filter */}
                        <button
                            type="button"
                            className="menu-button"
                            onClick={() => setShowFilters(!showFilters)} // Toggle visibility
                            title="Toggle filters"
                        >
                            ☰ {/* Or use a filter icon */}
                        </button>
                        <input
                            type="text"
                            placeholder="Search by building or classroom"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {/* Removed the separate filter button */}
                        <button type="submit" className="search-button">🔍</button>
                    </div>
                    {/* Conditionally render Filters BELOW the search bar */}
                    {showFilters && (
                        <div className="filters-wrapper"> {/* Wrapper for all filters */}
                            <div className="filter-item">
                                <span className="filter-label">Filter by Time: </span>
                                <input
                                    type="time"
                                    className="filter-input time-filter-input"
                                    value={timeFilter}
                                    onChange={(e) => setTimeFilter(e.target.value)}
                                />
                            </div>
                            <div className="filter-item">
                                <span className="filter-label">Filter by Date: </span>
                                <input
                                    type="date"
                                    className="filter-input date-filter-input"
                                    value={dateFilter}
                                    onChange={(e) => setDateFilter(e.target.value)}
                                />
                            </div>
                        </div>
                    )}
                </form>
            </div>

            {!selectedClassroom && (
                <>
                    {isSearching && (
                        <div className="clear-button-wrapper">
                            <button className="clear-search-button" onClick={clearSearch}>
                                Clear Search Bar
                            </button>
                        </div>
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

            {selectedClassroom && (
                <div className="onClickClassroomRectangle">
                    <button>
                        <span
                            className="favorite-button"
                            onClick={async () => {
                                if (!selectedClassroom) return;

                                try {
                                    // Sends a request to /api/favorite. If favorite is truem uses DELETE, else uses POST
                                    const res = await fetch(`/api/favorite`, {
                                        method: isFavorited ? "DELETE" : "POST",
                                        headers: { "Content-Type": "application/json" },
                                        credentials: "include",
                                        body: JSON.stringify({ classroomLocation: selectedClassroom.location }),
                                    });

                                    // Error handling and checking if success!
                                    if (res.ok) {
                                        setIsFavorited(!isFavorited);
                                    } else {
                                        console.error("Failed to toggle favorite");
                                    }
                                } catch (err) {
                                    console.error("Error favoriting:", err);
                                }
                            }}
                        >
                            {isFavorited ? "★" : "☆"}
                        </span>
                        <span onClick={() => setSelectedClassroom(null)} className="closeClassroomView">✕</span>
                    </button>
                    <h1 className="onClickClassroomTitle"> {selectedClassroom.courseName}</h1>
                    <p><span className="sectionText">Section:</span><span className="onClickClassroomSectionNum"> {selectedClassroom.sectionNumber} </span></p>
                    <p><span className="profText">Professor:</span><span className="onClickClassroomProf"> {selectedClassroom.instructor}</span></p>
                    <p><span className="dayText">Days Occuring:</span><span className="onClickClassroomDate"> {selectedClassroom.days}</span></p>
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
                    <p><span className="idText">CourseID:</span><span className="onClickClassroomCourseID"> {selectedClassroom.courseID}</span></p>

                    <a href={`/write-review?classroom=${encodeURIComponent(selectedClassroom.location)}`}>
                        <button className="createReview">Click to Review Classroom!</button>
                    </a>
                </div>
            )}
        </div>
    );
}
