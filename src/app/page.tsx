"use client";
import EventList from "./components/EventList";
import SearchPanel from "./components/searchPanel";
import BuildingPanel from "./components/buildingPanel";
import Favorites from "./components/favorites";
import { useState } from "react";
import "../styles/homepage.css";
import "../styles/spinner.css";
import dynamic from "next/dynamic";
import { LatLngExpression } from "leaflet";

const DynamicMap = dynamic(() => import("./components/Map"), {
    ssr: false,
    loading: () => (
        <div className="map-loading-wrapper">
            <div className="map-loading-container">
                <div className="spinner"></div>
                <div className="loading-text">Loading map...</div>
            </div>
        </div>
    ),
});

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

    return (
        <div className="page-container">
            <div className="content-wrapper">
                {/* Sidebar that gets fully replaced when a building is selected */}
                <div className={`left-content ${selectedBuilding ? "expanded" : ""}`}>
                    {selectedBuilding ? (
                        <BuildingPanel
                            selectedBuilding={selectedBuilding}
                            setSelectedBuilding={setSelectedBuilding}
                            setActiveTab={setActiveTab}
                        />
                    ) : (
                    <>
                        <SearchPanel
                            searchResults={searchResults}
                            setSearchResults={setSearchResults}
                            selectedClassroom={selectedClassroom}
                            setSelectedClassroom={setSelectedClassroom}
                            isSearching={isSearching}
                            setIsSearching={setIsSearching}
                            setActiveTab={setActiveTab}
                        />

                        {!isSearching && (
                            <>
                                <div className="tab-navigation">
                                    <button
                                        className={`tab-button ${activeTab === "favorite" ? "selected" : ""}`}
                                        onClick={() => setActiveTab("favorite")}
                                    >
                                        Favorites
                                    </button>
                                    <button
                                        className={`tab-button ${activeTab === "openRooms" ? "selected" : ""}`}
                                        onClick={() => setActiveTab("openRooms")}
                                    >
                                        Open Rooms
                                    </button>
                                    <button
                                        className={`tab-button ${activeTab === "events" ? "selected" : ""}`}
                                        onClick={() => setActiveTab("events")}
                                    >
                                        Events
                                    </button>
                                </div>

                                <div className="content-area">
                                    {activeTab === "favorite" && <div className="no-content-message"><Favorites /></div>}
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
                        setActiveTab={setActiveTab} // Ensure setActiveTab is passed
                        setSearchResults={setSearchResults}
                    />
                </div>

            </div>
        </div>
    );
}
