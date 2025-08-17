import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";
// Get Available Tokens
export const getAvailableTokens = async (req, res) => {
  try {
    const { doctorId, date } = req.body;
    if (!doctorId || !date) {
      return res
        .status(400)
        .json({ message: "Doctor ID and date are required." });
    }

    // Fetch doctor data
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found." });
    }

    // Count booked appointments
    const bookedAppointments = await Appointment.countDocuments({
      doctorId,
      appointmentDate: date,
    });

    // Calculate remaining tokens
    const remainingTokens = doctor.totalAppointments - bookedAppointments;

    res.json({ remainingTokens: remainingTokens >= 0 ? remainingTokens : 0 });
  } catch (error) {
    res.status(500).json({ message: "Error fetching available tokens" });
  }
};


export const getAppointments = async (req, res) => {
  const { userId } = req.params;

  try {
    const appointments = await Appointment.find({ userId })
      .populate("doctorId")
      .sort({ appointmentDate: 1 });

    if (!appointments || appointments.length === 0) {
      return res.status(404).json({ message: "No appointments found" });
    }

    res.status(200).json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const createAppointment = async (req, res) => {
  try {
    const { doctorId, userId, appointmentDate } = req.body;

    if (!doctorId || !userId || !appointmentDate) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if the user already booked an appointment for the same doctor on the same date
    const existingAppointment = await Appointment.findOne({
      doctorId,
      userId,
      appointmentDate,
    });

    if (existingAppointment) {
      return res
        .status(400)
        .json({
          message:
            "You have already booked an appointment for this doctor on this date.",
        });
    }

    // Find the doctor
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found." });
    }

    // Count already booked appointments
    const bookedAppointments = await Appointment.countDocuments({
      doctorId,
      appointmentDate,
    });

    if (bookedAppointments >= doctor.totalAppointments) {
      return res
        .status(400)
        .json({ message: "No slots available for this date." });
    }

    // Generate tokenNumber (next available slot)
    const tokenNumber = bookedAppointments + 1;

    // Create appointment with tokenNumber
    const newAppointment = new Appointment({
      doctorId,
      userId,
      appointmentDate,
      tokenNumber, // Assign tokenNumber dynamically
    });

    await newAppointment.save();

    res.json({ message: "Appointment booked successfully!", tokenNumber });
  } catch (error) {
    console.error("Error booking appointment:", error);
    res
      .status(500)
      .json({ message: "Error booking appointment", error: error.message });
  }
};
// Fetch Appointments for a Specific Doctor
export const getDoctorAppointments = async (req, res) => {
  try {
    const doctorId = req.params.doctorId; // Extract doctorId from URL params
    console.log(doctorId);

    if (!doctorId) {
      return res.status(400).json({ message: "Doctor ID is required" });
    }

    // Find appointments linked to the doctor
    const appointments = await Appointment.find({ doctorId }).populate(
      "userId"
    );

    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Controller to update the status of an appointment
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    // console.log(appointmentId);

    const { status } = req.body; // Status should be 'visited' or 'not-visited'

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Update the status of the appointment
    appointment.status = status;
    await appointment.save();

    res
      .status(200)
      .json({ message: "Appointment status updated", appointment });
  } catch (err) {
    console.error("Error updating appointment status:", err);
    res.status(500).json({ message: "Server error" });
  }
};
export const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    // Find the appointment before deleting
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    const { doctorId, appointmentDate } = appointment;
    // Delete the appointment
    await Appointment.findByIdAndDelete(appointmentId);
    // Count remaining booked appointments for the same doctor & date
    const bookedAppointments = await Appointment.countDocuments({
      doctorId,
      appointmentDate,
    });
    // Find the doctor and update available tokens
    const doctor = await Doctor.findById(doctorId);
    if (doctor) {
      const remainingTokens = doctor.totalAppointments - bookedAppointments;
      res
        .status(200)
        .json({
          message: "Appointment canceled successfully",
          remainingTokens,
        });
    } else {
      res
        .status(200)
        .json({
          message: "Appointment canceled successfully, but doctor not found",
        });
    }
  } catch (error) {
    console.error("Error canceling appointment:", error);
    res.status(500).json({ message: "Server error" });
  }
};
