import Checkup from '../models/CheckUp.js';
import path from 'path';
import fs from 'fs';

export const createCheckup = async (req, res) => {
  const { labId, userId ,userAddress,userPhone} = req.body;
  console.log('checkup',req.body);
  
  const file = req.file; // Assuming you're using multer to handle file uploads

  if (!file) {
    return res.status(400).json({ message: 'Prescription file is required' });
  }

  const prescriptionPath = `/uploads/prescriptions/${file.filename}`;

  try {
    const newCheckup = new Checkup({
      lab: labId,
      user: userId,
      prescription: prescriptionPath,
      address:userAddress,
      phone:userPhone
    });

    await newCheckup.save();
    return res.status(201).json({ message: 'Checkup request created successfully', checkup: newCheckup });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getCheckupsForUser = async (req, res) => {
  try {
    const checkups = await Checkup.find({ user: req.params.userId })
    .populate('lab', 'labName address phone')
    .populate('user', 'name email');
    return res.status(200).json({ checkups });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};
export const getCheckupsForLab = async (req, res) => {
  try {
    const { labId } = req.params; // Use params instead of req.user.id

    const checkups = await Checkup.find({ lab: labId })
      .populate('user', 'name email');

    if (!checkups.length) {
      return res.status(404).json({ message: 'No checkups found for this lab' });
    }

    return res.status(200).json({ checkups });
  } catch (error) {
    console.error('Get Checkups for Lab Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateCheckupStatus = async (req, res) => {
  const { checkupId } = req.params;
  const { status } = req.body;

  try {
    const checkup = await Checkup.findByIdAndUpdate(checkupId, { status }, { new: true });
    if (!checkup) {
      return res.status(404).json({ message: 'Checkup not found' });
    }
    return res.status(200).json({ message: 'Checkup status updated', checkup });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const uploadResult = async (req, res) => {
  const { checkupId } = req.params;
  const file = req.file;
console.log(checkupId);

  if (!file) {
    return res.status(400).json({ message: 'Result file is required' });
  }

  const resultPath = `/uploads/results/${file.filename}`;

  try {
    const checkup = await Checkup.findByIdAndUpdate(checkupId, { result: resultPath, status: 'Completed' }, { new: true });
    if (!checkup) {
      return res.status(404).json({ message: 'Checkup not found' });
    }
    return res.status(200).json({ message: 'Result uploaded successfully', checkup });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};


export const updatePaymentStatus = async (req, res) => {
  try {
    const { checkupId } = req.params;
console.log(checkupId,'-----------------------');

    // Find the checkup by ID
    let checkup = await Checkup.findById(checkupId);
    if (!checkup) {
      return res.status(404).json({ message: "Checkup not found" });
    }

    // Update the payment status
    checkup.isPaid = true;
    await checkup.save();

    res.status(200).json({ message: "Payment status updated successfully", checkup });
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};