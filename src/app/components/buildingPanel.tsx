"use client";
import { useEffect, useState } from "react";
import { buildingMap } from "../../../lib/data/buildingMap"; // Adjust path as needed
import { Class, LatLngExpression } from "leaflet";
import "../../styles/search-results.css";

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
    rating: number;
    classroom: string;
    comment: string;
    user?: string;
}

interface Props {
    selectedBuilding: Building;
    setSelectedBuilding: (building: Building | null) => void;
}

const BuildingPanel = ({ selectedBuilding, setSelectedBuilding }: Props) => {
    const [activeTab, setActiveTab] = useState("overview");
    const [buildingClassrooms, setBuildingClassrooms] = useState<Classroom[]>([]);
    const [classroomPage, setClassroomPage] = useState(1);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null);

    // Ensure "Overview" is selected when a building is clicked
    useEffect(() => {
        setActiveTab("overview");
        fetchBuildingClassrooms(selectedBuilding.name);
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

    useEffect(() => {
        const fetchReviews = async () => {
            if (activeTab === "reviews" && selectedBuilding) {
                const abbreviation = buildingMap[selectedBuilding.name];
                if (!abbreviation) {
                    console.warn(`Abbreviation not found for: ${selectedBuilding.name}`);
                    setReviews([]);
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
                }
            } else {
                setReviews([]);
            }
        };

        fetchReviews();
    }, [activeTab, selectedBuilding]);

    const formatTime = (time: string) => {
        if (!time) return "";
        const [hours, minutes] = time.split(":").map(Number);
        const period = hours >= 12 ? "PM" : "AM";
        const formattedHours = hours % 12 || 12;
        return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
    };

    return (
        !selectedClassroom ? (
            <div className="building-info full-sidebar">
                <h2 className="sidebar-building-name">{selectedBuilding.name}</h2>
                <p>{selectedBuilding.description}</p>

                <div className="tab-navigation">
                    <button className={`tab-button ${activeTab === "overview" ? "active" : ""}`} onClick={() => setActiveTab("overview")}>Overview</button>
                    <button className={`tab-button ${activeTab === "reviews" ? "active" : ""}`} onClick={() => setActiveTab("reviews")}>Reviews</button>
                </div>

                {activeTab === "overview" && (
                    <div className="search-results">
                        <button className="clear-search-button" onClick={() => setSelectedBuilding(null)}>
                            Close
                        </button>
                        {buildingClassrooms.length > 0 ? (
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
                    <div className="reviews-list search-results">
                        {reviews.length > 0 ? (
                            reviews.map((review, index) => (
                                <div key={index} className="review-item search-item">
                                    <h4>Rating: {review.rating}/5</h4>
                                    <p>Classroom: {review.classroom}</p>
                                    <p>{review.comment}</p>
                                    <small>By: {review.user || "Anonymous"}</small>
                                </div>
                            ))
                        ) : (
                            <p>No reviews available for this building yet.</p>
                        )}
                    </div>
                )}
            </div>
        ) : (
            <div className="onClickClassroomRectangle">
                <button onClick={() => setSelectedClassroom(null)} className="closeClassroomView">✕</button>
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