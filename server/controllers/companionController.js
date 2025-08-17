import Companion from '../models/Companion.js';
import CompanionBooking from '../models/CompanionBooking.js';
import loginData from '../models/Login.js';
import bcrypt from 'bcrypt';

export const registerCompanion = async (req, res) => {
    try {
        const { username, password, name, phone, email, age, experience, gender } = req.body;
        console.log(req.body);
  
        // Check if companion already exists
        const existingCompanion = await Companion.findOne({ email }) || await loginData.findOne({ userName: username });
        console.log(existingCompanion, '.............');

        if (existingCompanion) {
            return res.status(400).json({ message: 'Companion already exists' });
        }
  
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new login entry
        const login = new loginData({
            userName: username,
            passWord: hashedPassword,
            role: 'companion'
        });
        await login.save();

        // Create new companion
        const newCompanion = new Companion({
            commonKey: login._id,
            name,
            phone,
            email,
            age,
            experience,
            gender,  
            image: req.file ? req.file.path : null,
        });

        await newCompanion.save();
        res.status(201).json({ message: 'Companion registered successfully' });

    } catch (error) {
        console.error('Error registering companion:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
export const allCompanion = async (req, res) => {
  try {
    // Fetch all companions from the database
    const companions = await Companion.find();

    // Check if companions exist
    // if (!companions || companions.length === 0) {
    //   return res.status(404).json({ message: "No companions found" });
    // }

    // Return the list of companions
    res.status(200).json(companions);
  } catch (error) {
    console.error("Error fetching companions:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getCompanionById = async (req, res) => {
  try {
    const { id } = req.params;
  
    
    const companion = await Companion.findById(id);

    if (!companion) {
      return res.status(404).json({ message: "Companion not found" });
    }

    res.status(200).json(companion);
  } catch (error) {
    console.error("Error fetching companion:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
export const updateCompanion = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCompanion = await Companion.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedCompanion) {
      return res.status(404).json({ message: "Companion not found" });
    }

    res.status(200).json({ message: "Companion updated successfully", companion: updatedCompanion });
  } catch (error) {
    console.error("Error updating companion:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteCompanion = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the companion by ID
    const companion = await Companion.findById(id);
    if (!companion) {
      return res.status(404).json({ message: "Companion not found" });
    }

    // Delete associated login data (assuming a field like `commonKey` exists)
    await loginData.findOneAndDelete({ userName: companion.userName });

    // Delete all bookings associated with this companion
    await CompanionBooking.deleteMany({ companionId: id });

    // Delete the companion
    await Companion.findByIdAndDelete(id);

    res.status(200).json({ message: "Companion and related bookings deleted successfully!" });
  } catch (error) {
    console.error("Error deleting companion:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getCompanionhome = async (req, res) => {
  try {
    const { id } = req.params;
    
    const companion = await Companion.findOne({commonKey:id});

    if (!companion) {
      return res.status(404).json({ message: "Companion not found" });
    }

    res.status(200).json(companion);
  } catch (error) {
    console.error("Error fetching companion:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
