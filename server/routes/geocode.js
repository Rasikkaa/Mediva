import express from "express";
import axios from "axios";

const router = express.Router();

router.post("/", async (req, res) => {
  const { address } = req.body;
  if (!address) {
    return res.status(400).json({ message: "Address is required" });
  }
  
  try {
    // Use Nominatim for geocoding (you can replace this with Google Maps API if preferred)
    const response = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: {
        q: address,
        format: "json",
        addressdetails: 1,
        limit: 1,
      },
      headers: {
        'User-Agent': 'YourAppName/1.0'
      }
    });

    if (response.data.length === 0) {
      return res.status(404).json({ message: "Location not found" });
    }

    const location = response.data[0];
    const latitude = parseFloat(location.lat);
    const longitude = parseFloat(location.lon);
    
    res.json({ latitude, longitude });
  } catch (error) {
    console.error("Geocoding error:", error);
    res.status(500).json({ message: "Error during geocoding", error: error.message });
  }
});

export default router;
