import Companion from "../models/Companion.js";
import CompanionBooking from "../models/CompanionBooking.js";

//  Create a new companion booking
export const createBooking = async (req, res) => {
    try {
        const { userId, companionId, patientName, age, description, date, address, phone, latitude, longitude } = req.body;

        console.log(req.body); // Debugging

        // Ensure userId and companionId are defined
        if (!userId || !companionId) {
            return res.status(400).json({ message: "Missing userId or companionId" });
        }

        // Create new booking object
        const newBooking = new CompanionBooking({
            userId,
            companionId,
            patientName,
            age,
            description,
            date,
            address,
            phone,
            status: "pending",
            location: { latitude: parseFloat(latitude) || 0, longitude: parseFloat(longitude) || 0 } // Ensure numbers
        });

        await newBooking.save();
        res.status(201).json({ message: "Booking created successfully", booking: newBooking });
    } catch (error) {
        console.error("Error creating booking:", error);
        res.status(500).json({ message: "Error creating booking", error: error.message });
    }
};


export const getUserBookings = async (req, res) => {
    try {
        const { userId } = req.params; // Get userId from request parameters
        const bookings = await CompanionBooking.find({ userId }).populate('companionId')

        

        res.json({ bookings });
    } catch (error) {
        res.status(500).json({ message: "Error fetching bookings", error: error.message });
    }
};
// Get Companion's Bookings
export const getCompanionBookings = async (req, res) => {
    try {
        const { companionId } = req.params; // Get companionId from request parameters
        const bookings = await CompanionBooking.find({ companionId }).populate('userId');

        if (!bookings || bookings.length === 0) {
            return res.status(404).json({ message: "No bookings found for this companion" });
        }

        res.json({ bookings });
    } catch (error) {
        res.status(500).json({ message: "Error fetching companion bookings", error: error.message });
    }
};
// Update Booking Status
export const updateBookingStatus = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { status } = req.body;


        const booking = await CompanionBooking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        booking.status = status;
        await booking.save();

        res.json({ message: "Booking status updated successfully", booking });
    } catch (error) {
        res.status(500).json({ message: "Error updating booking status", error: error.message });
    }
};

export const updateLocation = async (req, res) => {
    try {
      const { companionId } = req.params;
      const { latitude, longitude } = req.body;
  
      // Find and update companion's location
      const companion = await Companion.findByIdAndUpdate(
        companionId,
        { location: { type: "Point", coordinates: [longitude, latitude] } }, // GeoJSON format
        { new: true }
      );
  
      if (!companion) {
        return res.status(404).json({ message: "Companion not found" });
      }
  
      // Emit location update to all connected clients
      req.io.emit(`locationUpdate-${companionId}`, { latitude, longitude });
  
      res.status(200).json({ message: "Location updated successfully", location: companion.location });
    } catch (error) {
      console.error("Error updating location:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

export const getCompanionLocation = async (req, res) => {
    try {
        const { bookingId } = req.params;

        // Find booking to get the user's location
        const booking = await CompanionBooking.findById(bookingId);
        if (!booking) return res.status(404).json({ message: "Booking not found" });

        // Find companion's real-time location
        const companion = await Companion.findById(booking.companionId);
        if (!companion) return res.status(404).json({ message: "Companion not found" });

        res.status(200).json({
            userLocation: {
                latitude: booking.location.latitude, // MongoDB stores [lng, lat]
                longitude: booking.location.longitude
            },
            companionLocation: {
                latitude: companion.location.coordinates[1],
                longitude: companion.location.coordinates[0]
            }
        });

    } catch (error) {
        console.error("Error fetching location:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const updatePaymentStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
console.log(bookingId,'-----------------------');

    // Find the booking by ID
    let booking = await CompanionBooking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "booking not found" });
    }

    // Update the payment status
    booking.isPaid = true;
    await booking.save();

    res.status(200).json({ message: "Payment status updated successfully", booking });
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};