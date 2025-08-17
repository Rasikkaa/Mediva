import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwtUtils.js';
import loginData from '../models/Login.js';
import Doctor from '../models/Doctor.js';
import shopData from '../models/Rentalshop.js';
import LabStaff from '../models/LabStaff.js';
import Companion from '../models/Companion.js';
import userData from '../models/User.js';
import productData from '../models/Products.js';

export const login = async (req, res) => {
  const { userName, passWord } = req.body;
console.log(req.body);

  try {
    const user = await loginData.findOne({ userName });
    console.log(user);
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(passWord, user.passWord);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const token = generateToken(user._id);
    res.json({ message: 'Login successful', token, user: { id: user._id, role: user.role } });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
};




export const getAdminCounts = async (req, res) => {
  try {
    const doctorCount = await Doctor.countDocuments();
    const rentalStaffCount = await shopData.countDocuments();
    const labStaffCount = await LabStaff.countDocuments();
    const companionCount = await Companion.countDocuments();
    const userCount = await userData.countDocuments();
    const productCount = await productData.countDocuments()

    res.status(200).json({
      success: true,
      data: {
        doctors: doctorCount,
        rentalStaff: rentalStaffCount,
        labStaff: labStaffCount,
        companions: companionCount,
        user:userCount,
        product:productCount,
      },
    });
  } catch (error) {
    console.error("Error fetching counts:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
