"use client";

import { MapContainer, TileLayer, Marker, useMap, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LatLngExpression, LatLngBoundsExpression, Icon } from "leaflet";

interface Building {
    name: string;
    position: LatLngExpression;
    description: string;
}

interface MapProps {
    selectedBuilding: Building | null;
    setSelectedBuilding: (building: Building | null) => void;
}

// Define Long Beach campus bounds
const longBeachBounds: LatLngBoundsExpression = [
    [33.771757, -118.126298], // Southwest corner
    [33.790268, -118.099323], // Northeast corner
];

const buildings: { name: string; position: LatLngExpression; description: string }[] = [
    { name: "Engineering and Computer Science", position: [33.78356, -118.11025], description: "" },
    { name: "Vivian Engineering Center", position: [33.78275, -118.11033], description: "" },
    { name: "Department of Design", position: [33.78195, -118.1092], description: "" },
    { name: "Social Sciences & Public Affairs", position: [33.78195, -118.1104], description: "" },
    { name: "College of Professional and Continuing Education", position: [33.781994, -118.111234], description: "" },
    { name: "Engineering 2", position: [33.78310, -118.11075], description: ""},
    { name: "Engineering 3", position: [33.78367, -118.11117], description: "" },
    { name: "Kinesiology", position: [33.782994, -118.112479], description: "" },
    { name: "Engineering Technology", position: [33.78300, -118.10892], description: "" },
    { name: "Human Services and Design", position: [33.782675, -118.109540], description: "" },
    { name: "College of Business", position: [33.78386, -118.11553], description: "" },
    { name: "Nursing", position: [33.78169, -118.11761], description: "" },
    { name: "Anna W. Ngai Alumni Center", position: [33.78176233374731, -118.11689957037497], description: "" },
    { name: "Family and Consumer Sciences", position: [33.7816, -118.116], description: "" },
    { name: "Horn Center", position: [33.78330, -118.1142], description: "" },
    { name: "Health and Human Services", position: [33.78221, -118.112479], description: "" },
    { name: "Dance Center", position: [33.78811, -118.11322], description: "" },
    { name: "Carpenter Performing Arts Center", position: [33.788150319319115, -118.1119664999147], description: "" },
    { name: "Bob Cole Conservatory of Music", position: [33.78771778613566, -118.11224184558921], description: "" },
    { name: "Molecular and Life Sciences Center", position: [33.78014457458129, -118.11229096776138], description: "" },
    { name: "Hall of Science", position: [33.77976093340059, -118.11254012988212], description: "" },
    { name: "Microbiology", position: [33.7793603151302, -118.11175996655842], description: "" },
    { name: "Peterson Hall 1", position: [33.77880528516616, -118.11265610964536], description: "" },
    { name: "Peterson Hall 2", position: [33.77932975942252, -118.11255238375634], description: "" },
    { name: "Psychology", position: [33.77941803143673, -118.11417806440079], description: "" },
    { name: "Liberal Arts 5", position: [33.778819199041116, -118.11427986248259], description: "" },
    { name: "Liberal Arts 4", position: [33.778478308089134, -118.11441378024116], description: "" },
    { name: "Liberal Arts 3", position: [33.77820002875519, -118.11453514320984], description: "" },
    { name: "Liberal Arts 2", position: [33.777946098081266, -118.11462302673586], description: "" },
    { name: "Liberal Arts 1", position: [33.77759476807792, -118.11477368421906], description: "" },
    { name: "Fine Arts 4", position: [33.77823829222668, -118.11281095205366], description: "" },
    { name: "Fine Arts 3", position: [33.777866092364114, -118.11231294538499], description: "" },
    { name: "Fine Arts 2", position: [33.777439593902876, -118.11249901268091], description: "" },
    { name: "Fine Arts 1", position: [33.7771117355627, -118.11257239638014], description: "" },
    { name: "Language Arts", position: [33.776814374574215, -118.11273445204596], description: "" },
    { name: "Theater Arts", position: [33.776425516356966, -118.11273445204596], description: "" },
    { name: "Cinematic Arts", position: [33.77651955412686, -118.11175906037707], description: "" },
    { name: "Education 2", position: [33.77564271142841, -118.11438558529908], description: "" },
];

const pinpointIcon = new Icon({
    iconUrl: "/images/pinpoint.png", 
    iconSize: [30, 40], // Width and height of the icon
    iconAnchor: [15, 40], // Point of the icon that will correspond to the marker's location
    popupAnchor: [0, -40], // Point where the popup will appear relative to the icon
});

const Map: React.FC<MapProps> = ({ selectedBuilding, setSelectedBuilding }) => {
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
                {buildings.map((building, index) => (
                    <Marker
                        key={index}
                        position={building.position}
                        icon={pinpointIcon}
                        eventHandlers={{
                            click: () => setSelectedBuilding(building),
                        }}
                    >
                        <Tooltip>{building.name}</Tooltip>
                    </Marker>
                ))}

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
