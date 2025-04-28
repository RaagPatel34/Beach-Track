"use client"
import { useEffect, useState } from "react";
import "../../styles/search-results.css";
import "../../styles/favorite.css";
import "../../styles/homepage.css";
import { buildingMap } from "../../../lib/data/buildingMap"; 

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
    setActiveTab: (tabName: string) => void;
}

export default function SearchPanel({
    searchResults,
    setSearchResults,
    selectedClassroom,
    setSelectedClassroom,
    isSearching,
    setIsSearching,
    setActiveTab,
}: Props) {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isFavorited, setIsFavorited] = useState(false);  // Used to determine if classroom is favorited or not.
    const [suggestions, setSuggestions] = useState<string[]>([]);

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
            let searchValue = searchTerm.trim();
    
            // If search term matches a building full name, replace with abbreviation
            for (const [fullName, abbreviation] of Object.entries(buildingMap)) {
                if (fullName.toLowerCase() === searchValue.toLowerCase()) {
                    searchValue = abbreviation;
                    break;
                }
            }
    
            const response = await fetch(`/api/search?search=${searchValue}`);
            const data = await response.json();
            setSearchResults(data);
            setCurrentPage(1);
            setIsSearching(true);
        } catch (error) {
            console.error("Error fetching search results:", error);
        }
    };
    

    const clearSearch = () => {
        setSearchResults([]);
        setSearchTerm("");
        setIsSearching(false);
        setActiveTab("favorite");
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
                <form onSubmit={handleSearch} className="search-form">
                    <div className="search-bar">
                        <button className="menu-button">☰</button>
                        <input
                            type="text"
                            placeholder="Search by building or classroom"
                            value={searchTerm}
                            onChange={(e) => {
                                const value = e.target.value;
                                setSearchTerm(value);
                            
                                if (value.trim() === "") {
                                    setSuggestions([]);
                                } else {
                                    const searchValue = value.toLowerCase();
                                    const matchedSuggestions = Object.entries(buildingMap as Record<string, string>)
                                    .flatMap(([fullName, abbreviation]) => [fullName, abbreviation])
                                    .filter((name) => name.toLowerCase().includes(searchValue))
                                    .slice(0, 5);

                                    setSuggestions(matchedSuggestions);

                                }
                            }}
                        />
                            {suggestions.length > 0 && (
                                <ul className="suggestions-list">
                                    {suggestions.map((suggestion, index) => (
                                        <li 
                                            key={index} 
                                            onClick={() => {
                                                setSearchTerm(suggestion);
                                                setSuggestions([]);
                                            }}
                                        >
                                            {suggestion}
                                        </li>
                                    ))}
                                </ul>
                            )}

                        <button type="submit" className="search-button">
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="20" 
                                height="20" 
                                viewBox="0,0,256,256"
                                fill="#1A1A1A;"
                            >
                                <g fill="#1a1a1a" fillRule="nonzero" stroke="none" strokeWidth="1" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" strokeDasharray="" strokeDashoffset="0" fontFamily="none" fontWeight="none" fontSize="none" textAnchor="none" ><g transform="scale(5.12,5.12)">
                                    <path d="M21,3c-9.39844,0 -17,7.60156 -17,17c0,9.39844 7.60156,17 17,17c3.35547,0 6.46094,-0.98437 9.09375,-2.65625l12.28125,12.28125l4.25,-4.25l-12.125,-12.09375c2.17969,-2.85937 3.5,-6.40234 3.5,-10.28125c0,-9.39844 -7.60156,-17 -17,-17zM21,7c7.19922,0 13,5.80078 13,13c0,7.19922 -5.80078,13 -13,13c-7.19922,0 -13,-5.80078 -13,-13c0,-7.19922 5.80078,-13 13,-13z"></path>
                                </g></g>
                            </svg>
                        </button>
                    </div>
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
