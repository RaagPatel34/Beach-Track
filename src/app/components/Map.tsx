"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LatLngBoundsExpression } from "leaflet";

const longBeachBounds: LatLngBoundsExpression = [
    [33.771757, -118.126298], //Southwest corner
    [33.790268, -118.099323], //Northeast corner
];

const Map: React.FC = () => {
    return (
        <MapContainer
            center={[33.7830, -118.1140]}
            zoom={15}
            minZoom={15}
            maxZoom={18}
            maxBounds={longBeachBounds}
            maxBoundsViscosity={0.5}
            scrollWheelZoom={true}
            style={{ height: "648px", width: "100%" }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
        </MapContainer>
    );
};

export default Map;