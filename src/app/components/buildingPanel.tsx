"use client";
import { useEffect, useState } from "react";
import { buildingMap } from "../../../lib/data/buildingMap"; // Adjust path as needed
import { buildingColorMap } from "../../../lib/data/buildingColorMap";
import { LatLngExpression } from "leaflet";
import "../../styles/search-results.css";
import "../../styles/review-list.css";
import "../../styles/favorite.css";

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

interface Review {
    date: string | number | Date;
    rating: number;
    classroom: string;
    comment: string;
    author?: string;
}

interface Props {
    selectedBuilding: Building;
    setSelectedBuilding: (building: Building | null) => void;
    setActiveTab: (tabName: string) => void;
}

const BuildingPanel = ({ selectedBuilding, setSelectedBuilding, setActiveTab }: Props) => {
    const [activeTab, setLocalActiveTab] = useState("overview");
    const [buildingClassrooms, setBuildingClassrooms] = useState<Classroom[]>([]);
    const [classroomPage, setClassroomPage] = useState(1);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null);
    const [isFavorited, setIsFavorited] = useState(false);  // Used to determine if classroom is favorited or not.
    const [isLoading, setIsLoading] = useState(false);
    const [isReviewsLoading, setIsReviewsLoading] = useState(false);
    // Get the color group based on building abbreviation
    const abbreviation = buildingMap[selectedBuilding.name] || "";
    // Get the color group based on building abbreviation
    const colorGroup = buildingColorMap[abbreviation] || "fallback"; // default fallback


    // Ensure "Overview" is selected when a building is clicked
    useEffect(() => {
        setLocalActiveTab("overview");
        fetchBuildingClassrooms(selectedBuilding.name);
    }, [selectedBuilding]);

    const fetchBuildingClassrooms = async (buildingName: string) => {
        setIsLoading(true); 
        try {
            const buildingAbbrev = buildingMap[buildingName] || buildingName;
            const response = await fetch(`/api/search?search=${buildingAbbrev}`);
            const data = await response.json();
            setBuildingClassrooms(data);
            setClassroomPage(1);
        } catch (error) {
            console.error("Error fetching classrooms:", error);
        } finally {
            setIsLoading(false); 
        }
    };
    

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

    useEffect(() => {
        const fetchReviews = async () => {
            if (activeTab === "reviews" && selectedBuilding) {
                setIsReviewsLoading(true); // Set loading state to true when fetching reviews
    
                const abbreviation = buildingMap[selectedBuilding.name];
                if (!abbreviation) {
                    console.warn(`Abbreviation not found for: ${selectedBuilding.name}`);
                    setReviews([]);
                    setIsReviewsLoading(false); // Set loading state to false
                    return;
                }
    
                try {
                    const res = await fetch(`/api/review?building=${encodeURIComponent(abbreviation)}`);
                    const data = await res.json();
                    if (res.ok) setReviews(data);
                    else setReviews([]);
                } catch (error) {
                    console.error("Error fetching reviews:", error);
                    setReviews([]);
                } finally {
                    setIsReviewsLoading(false); // Set loading state to false
                }
            } else {
                setReviews([]);
            }
        };
    
        fetchReviews();
    }, [activeTab, selectedBuilding]);
    

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

    const getColorClass = (rating: number) => {
        if (rating >= 4) return 'bg-green';
        if (rating >= 2) return 'bg-yellow';
        return 'bg-red';
    }

    return (
        !selectedClassroom ? (
            <div className="building-info full-sidebar">
                <h2 className={`sidebar-building-name sidebar-building-name-${colorGroup}`}>{selectedBuilding.name}</h2>
                <p>{selectedBuilding.description}</p>

                <div className="tab-navigation">
                    <button className={`tab-button ${activeTab === "overview" ? "selected" : ""}`} onClick={() => setLocalActiveTab("overview")}>Overview</button>
                    <button className={`tab-button ${activeTab === "reviews" ? "selected" : ""}`} onClick={() => setLocalActiveTab("reviews")}>Reviews</button>
                </div>

                {activeTab === "overview" && (
                    <div className="search-results">
                        <button className="clear-search-button" onClick={() => {
                            setSelectedBuilding(null);
                            setActiveTab("favorite"); 
                        }}>
                            Close
                        </button>
                        {isLoading ? (
                                <div className="loading-container">
                                    <div className="spinner"></div>
                                    <p className="loading-text">Loading results...</p>
                                </div>
                                ) : buildingClassrooms.length > 0 ? (
                                 <>
                                <ul>
                                    {buildingClassrooms.slice((classroomPage - 1) * 5, classroomPage * 5).map((classroom, index) => (
                                        <button key={index} onClick={() => setSelectedClassroom(classroom)} className="search-item">
                                            <h3 className="course-name">{classroom.courseName}</h3>
                                            <h3 className="location-name">Location: {classroom.location}</h3>
                                            <p className="time-day">Time: {formatTime(classroom.startTime)} - {formatTime(classroom.endTime)}, Days: {classroom.days}</p>
                                        </button>
                                    ))}
                                </ul>
                                {buildingClassrooms.length > 5 && (
                                    <div className="pagination-buttons2">
                                        <button onClick={() => setClassroomPage((prev) => Math.max(prev - 1, 1))} disabled={classroomPage === 1}>
                                            Previous
                                        </button>
                                        <button onClick={() => setClassroomPage((prev) => Math.min(prev + 1, Math.ceil(buildingClassrooms.length / 5)))}
                                            disabled={classroomPage === Math.ceil(buildingClassrooms.length / 5)}
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <p>No classrooms found for this building.</p>
                        )}
                    </div>
                )}

                {activeTab === "reviews" && (
                    <>
                        <div className="mainContainer1">
                            {/* Title for the panel */}
                            <div className="rectangleTitle1">
                                Most Recent Classroom Ratings!
                            </div>

                            <div className="container">
                                {isReviewsLoading ? (
                                     <div className="loading-container">
                                     <div className="spinner"></div>
                                     <p className="loading-text">Loading reviews...</p>
                                 </div>
                                ): reviews.length > 0 ? (
                                    <>
                                        {reviews
                                            ?.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                            .slice(0, 3)
                                            .map((reviews) => (
                                                <div key={`${reviews.date}-${reviews.classroom}`} className={`rectangle1 ${getColorClass(reviews.rating)}`}>
                                                    <h2 className="reviewRating"> Rating: {reviews.rating} </h2>
                                                    <h2 className="reviewClassroom"> Classroom: {reviews.classroom} </h2>
                                                </div>
                                            ))}
                                        <a href={`/post-review?building=${encodeURIComponent(buildingMap[selectedBuilding.name])}`}>
                                            <button className="goToReviews">
                                                View All Reviews!
                                            </button>
                                        </a>
                                    </>
                                ) : (
                                    <p>No reviews available for this building yet.</p>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        ) : (
            <div className="onClickClassroomRectangle2">
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
                <h1 className="onClickClassroomTitle">{selectedClassroom.courseName}</h1>
                <p><span className="sectionText">Section:</span> <span className="onClickClassroomSectionNum">{selectedClassroom.sectionNumber}</span></p>
                <p><span className="profText">Professor:</span> <span className="onClickClassroomProf">{selectedClassroom.instructor}</span></p>
                <p><span className="dayText">Days Occurring:</span> <span className="onClickClassroomDate">{selectedClassroom.days}</span></p>
                <p>
                    <span className="startText">Start Time:</span>
                    <span className="onClickClassroomStartEnd">{formatTime(selectedClassroom.startTime)} |</span>
                    <span className="endText">End Time:</span>
                    <span className="onClickClassroomStartEnd">{formatTime(selectedClassroom.endTime)}</span>
                </p>
                <p>
                    <span className="buildingText">Building:</span>
                    <span className="onClickClassroomLocation">{selectedClassroom.building} |</span>
                    <span className="roomText">Room:</span>
                    <span className="onClickClassroomLocation">{selectedClassroom.room}</span>
                </p>
                <p><span className="idText">CourseID:</span> <span className="onClickClassroomCourseID">{selectedClassroom.courseID}</span></p>
                <a href={`/write-review?classroom=${encodeURIComponent(selectedClassroom.location)}`}>
                    <button className="createReview">Click to Review Classroom!</button>
                </a>
            </div>
        )
    );
};

export default BuildingPanel;
