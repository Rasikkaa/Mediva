
import React, { useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:8000"); // Connect to backend WebSocket

function CompanionShareLocation({ companionId }) {
  console.log(companionId);
  
  useEffect(() => {
    const updateLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;

            // Send location to backend via API (optional)
            await axios.post(`http://localhost:8000/api/companion-booking/update-location/${companionId}`, {
              latitude,
              longitude,
            });

            // Send location via WebSocket
            socket.emit("updateLocation", { companionId, latitude, longitude });
          },
          (error) => console.error("Error getting location:", error),
          { enableHighAccuracy: true, maximumAge: 0 }
        );
      }
    };

    const interval = setInterval(updateLocation, 5000); // Update location every 5 seconds
    return () => clearInterval(interval);
  }, [companionId]);

  return <p>Companion's live location is being shared...</p>;
}

export default CompanionShareLocation;
