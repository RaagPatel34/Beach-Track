"use client";

import { MapContainer, TileLayer, Marker, useMap, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LatLngExpression, LatLngBoundsExpression, Icon, DivIcon } from "leaflet";
import { useEffect } from "react"; // Added for pinpoint classroom results
import { buildings } from "../../../lib/data/buildingsData"; // Import buildings array
import { buildingMap } from "../../../lib/data/buildingMap";
import { buildingColorMap } from "../../../lib/data/buildingColorMap";
import "../../styles/map-pinpoint.css";


interface Building {
    name: string;
    position: LatLngExpression;
    description: string;
}

interface MapProps {
    selectedBuilding: Building | null;
    setSelectedBuilding: (building: Building | null) => void;
    setActiveTab: (tab: string) => void; // Add setActiveTab prop
    // Added for pinpoint classroom results
    setSearchResults: (results: any[]) => void;  // Add this to update classrooms in sidebar
}

// Define Long Beach campus bounds
const longBeachBounds: LatLngBoundsExpression = [
    [33.771757, -118.126298], // Southwest corner
    [33.790268, -118.099323], // Northeast corner
];

const pinpointIcon = new Icon({
    iconUrl: "/images/pinpoint.png", 
    iconSize: [30, 40], // Width and height of the icon
    iconAnchor: [15, 40], // Point of the icon that will correspond to the marker's location
    popupAnchor: [0, -40], // Point where the popup will appear relative to the icon
});


const Map: React.FC<MapProps> = ({ selectedBuilding, setSelectedBuilding, setActiveTab, setSearchResults }) => { // Destructure setActiveTab
    
    useEffect(() => {
        if (selectedBuilding) {
            fetchClassrooms(selectedBuilding.name);
        }
    }, [selectedBuilding]);

    const fetchClassrooms = async (buildingName: string) => {
        try {
            const response = await fetch(`/api/search?search=${buildingName}`);
            const data = await response.json();
            setSearchResults(data);  // Updates sidebar with classrooms
        } catch (error) {
            console.error("Error fetching classrooms:", error);
            setSearchResults([]);  // Reset results on failure
        }
    };

    return (
        <div style={{ position: "relative" }}>
            <MapContainer
                center={[33.7830, -118.1140]}
                zoom={16}
                minZoom={15}
                maxZoom={18}
                maxBounds={longBeachBounds}
                maxBoundsViscosity={0.5}
                scrollWheelZoom={true}
                style={{ height: "648px", width: "100%" }}
            >
                <TileLayer
                    url="https://api.maptiler.com/maps/topo-v2/{z}/{x}/{y}.png?key=8OucwXqXJxZmPYcsKk46"
                    attribution='&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a> contributors'
                />

                {/* Add markers for buildings */}
                {buildings.map((building, index) => {
                const abbreviation = buildingMap[building.name] || "";

                // Get the color group based on building abbreviation
                const colorGroup = buildingColorMap[abbreviation] || "fallback"; // default fallback

                const buildingIcon = new DivIcon({
                    html: `<div class="building-pin building-pin-${colorGroup}">${abbreviation}</div>`,
                    className: "",
                    iconSize: [30, 30],
                    iconAnchor: [15, 15],
                });

                return (
                    <Marker
                        key={index}
                        position={building.position}
                        icon={buildingIcon}
                        eventHandlers={{
                            click: () => {
                                setSelectedBuilding(building);
                                setActiveTab("reviews");
                            },
                        }}
                    >
                        <Tooltip>{building.name}</Tooltip>
                    </Marker>
                );
            })}



                {selectedBuilding && <ZoomToBuilding position={selectedBuilding.position} />}
            </MapContainer>
        </div>
    );
};



// Component to zoom in when a building is selected
// Component to smoothly zoom into a selected building
const ZoomToBuilding: React.FC<{ position: LatLngExpression }> = ({ position }) => {
    const map = useMap();
    map.flyTo(position, 18, {
        animate: true,
        duration: 1.5, // Adjust this value for a smoother/slower zoom effect
        easeLinearity: 0.2, // Controls the easing of the zoom
    });
    return null;
};


export default Map;
