import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';
import loginData from '../models/Login.js';
import bcrypt from 'bcrypt';
import path from 'path';
export const addDoctor = async (req, res) => {
  const { name, specialization,hospitalName, contact, email, experience, workingHours, password, totalAppointments } = req.body;
  console.log(req.body);

  if (!name || !specialization || !contact || !email || !experience || !workingHours || !password || !totalAppointments) {
    return res.status(400).json({ message: 'All fields are required!' });
  }

  try {
    const existingUser = await loginData.findOne({ userName: email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const loginRecord = new loginData({
      userName: email,
      passWord: hashedPassword,
      role: 'doctor',
    });

    await loginRecord.save();

    const newDoctor = new Doctor({
      name,
      commonKey: loginRecord._id,
      specialization,
      hospitalName,
      contact,
      email,
      experience,
      workingHours,
      totalAppointments, // Added field
      image: req.file ? req.file.path : null,
    });

    await newDoctor.save();
    res.status(201).json({ message: 'Doctor added successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctors' });
  }
};

export const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findById(id);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.status(200).json(doctor);
  } catch (error) {
    console.error('Error fetching doctor:', error);
    res.status(500).json({ message: 'Error fetching doctor details' });
  }
};

// doctor home
// Fetch doctor details by ID
export const getDoctorHome = async (req, res) => {
  try {
    const { id } = req.params; // Get the ID from the route params
    console.log(id);
    
    const doctor = await Doctor.findOne({commonKey:id}); // Fetch the doctor from the database

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.status(200).json(doctor); // Send the doctor data as a response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching doctor details' });
  }
};


export const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, specialization, contact, workingHours, experience } = req.body;

    const updateData = {
      name,
      specialization,
      contact,
      workingHours,
      experience,
    };

    // Handle the image if provided
    if (req.file) {
      updateData.image = req.file.path; // Save the new image path
    }

    const updatedDoctor = await Doctor.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedDoctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.status(200).json({ message: 'Doctor updated successfully!', doctor: updatedDoctor });
  } catch (error) {
    console.error('Error updating doctor:', error);
    res.status(500).json({ message: 'Error updating doctor details' });
  }
};
export const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the doctor by ID
    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Delete associated login data
    await loginData.findByIdAndDelete(doctor.commonKey);

    // Delete all appointments associated with this doctor
    await Appointment.deleteMany({ doctorId: id });

    // Delete the doctor
    await Doctor.findByIdAndDelete(id);

    res.status(200).json({ message: 'Doctor and related appointments deleted successfully!' });
  } catch (error) {
    console.error('Error deleting doctor:', error);
    res.status(500).json({ message: 'Error deleting doctor' });
  }
};
