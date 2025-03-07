"use client";

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
                                <div className="search-bar">
                                    <button className="menu-button">☰</button>
                                    <input type="text" placeholder="Search by building, time, date" />
                                    <button className="search-button">🔍</button>
                                </div>
                            </div>

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
                                {activeTab === "events" && <div className="no-content-message">Log in to create/join events!</div>}
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
