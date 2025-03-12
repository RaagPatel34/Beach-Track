"use client";
import EventList from "./components/EventList"
import { useState } from "react";
import "../styles/homepage.css";
import dynamic from "next/dynamic";
import { LatLngExpression } from "leaflet";

const DynamicMap = dynamic(() => import("./components/Map"), { ssr: false });

interface Building {
    name: string;
    position: LatLngExpression;
    description: string;
}

export default function Home() {
    const [activeTab, setActiveTab] = useState("favorite");
    const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
    const [searchResults, setSearchResults] = useState<any[]>([]); // Array to store search results
    const [searchTerm, setSearchTerm] = useState(""); // For holding the search term
    const [currentPage, setCurrentPage] = useState(1);  // Tracks pagination

    // Handle the search query submission
    const handleSearch = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!searchTerm) return;

        try {
            const response = await fetch(`/api/search?search=${searchTerm}`);
            const data = await response.json();
            setSearchResults(data); // Update the state with the search results
            setCurrentPage(1)
        } catch (error) {
            console.error("Error fetching search results:", error);
        }
    };
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
                                <button
                                    className={`tab-button ${activeTab === "overview" ? "active" : ""}`}
                                    onClick={() => setActiveTab("overview")}
                                >
                                    Overview
                                </button>
                                <button
                                    className={`tab-button ${activeTab === "reviews" ? "active" : ""}`}
                                    onClick={() => setActiveTab("reviews")}
                                >
                                    Reviews
                                </button>
                            </div>
                            <button className="close-button" onClick={() => setSelectedBuilding(null)}>Close</button>
                        </div>

                    ) : (
                        <>
                            <div className="search-wrapper">
                                <form onSubmit={handleSearch}>
                                    <div className="search-bar">
                                        <button className="menu-button">☰</button>
                                        <input 
                                            type="text" 
                                            placeholder="Search by building, time, date" 
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                        <button type="submit" className="search-button">🔍</button>
                                    </div>
                                </form>
                            </div>
                            {/* Display Results */}
                            <div className="search-results">
                                <ul>
                                    {searchResults.slice((currentPage - 1) * 5, currentPage * 5).map((result, index) => (
                                    <div key={index} className="search-item">
                                            <h3>Course: {result.courseName}</h3>
                                            <h3>Section: {result.sectionNumber}</h3>
                                            <h3>Classroom: {result.location}</h3>
                                            <p>Time: {result.startTime} - {result.endTime}, {result.days}</p>
                                        </div>
                                    ))}
                                </ul>
                            </div>

                            {/* Pagination */}
                            {searchResults.length > 5 && (
                                <div className="pagination-buttons">
                                    <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                                        Previous
                                    </button>
                                    <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(searchResults.length / 5)))}
                                        disabled={currentPage === Math.ceil(searchResults.length / 5)}>
                                        Next
                                    </button>
                                </div>
                            )}
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
                </div>

                <div className="right-content">
                    <DynamicMap selectedBuilding={selectedBuilding} setSelectedBuilding={setSelectedBuilding} />
                </div>
            </div>
        </div>
    );
}
