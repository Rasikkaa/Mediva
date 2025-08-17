
import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

function CompanionMap({ bookingId }) {
  const [userLocation, setUserLocation] = useState(null);
  const [companionLocation, setCompanionLocation] = useState(null);
  const [error, setError] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    console.log("Received bookingId:", bookingId);
    const fetchLocation = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/companion-booking/location/${bookingId}`
        );
        console.log("API Response:", response.data);

        if (response.data.userLocation && response.data.companionLocation) {
          setUserLocation(response.data.userLocation);
          setCompanionLocation(response.data.companionLocation);
        }
      } catch (error) {
        console.error("Error fetching location:", error);
        setError("Failed to fetch location data.");
      }
    };

    if (bookingId) {
      fetchLocation();
    }
  }, [bookingId]);

  // Ensure map resizes properly inside modal
  useEffect(() => {
    if (mapRef.current && companionLocation) {
      setTimeout(() => {
        mapRef.current.invalidateSize();
        mapRef.current.setView(
          [companionLocation.latitude, companionLocation.longitude],
          15
        );
      }, 300);
    }
  }, [companionLocation]);

  return (
    <div>
      {error && <p className="error">{error}</p>}
      {userLocation && companionLocation ? (
        <MapContainer
          center={[userLocation.latitude, userLocation.longitude]}
          zoom={15}
          style={{ height: "400px", width: "100%" }}
          whenCreated={(map) => (mapRef.current = map)}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* User's Location */}
          <Marker position={[userLocation.latitude, userLocation.longitude]}>
            <Popup>Your Location</Popup>
          </Marker>

          {/* Companion's Location */}
          <Marker
            position={[companionLocation.latitude, companionLocation.longitude]}
          >
            <Popup>Companion is here</Popup>
          </Marker>
        </MapContainer>
      ) : (
        <p>Loading location...</p>
      )}
    </div>
  );
}

export default CompanionMap;
