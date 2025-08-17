import userData from '../models/User.js';
import loginData from '../models/Login.js';
import bcrypt from 'bcrypt';


export const registerUser = async (req, res) => {
  const { name, email, password, phone, address } = req.body;
console.log(req.body);

  try {
    const existingUser = await userData.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const existingLogin = await loginData.findOne({ userName: email });
    if (existingLogin) {
      return res.status(400).json({ message: 'Username already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newLogin = new loginData({
      userName: email,
      passWord: hashedPassword,
      role: 'user',
    });
    await newLogin.save();

    const newUser = new userData({
      commonKey: newLogin._id,
      name,
      email,
      phone,
      address,
      photo: req.file ? req.file.filename : null,
    });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const userhome = async (req, res) => {
  const { id } = req.params;

  try {
    // console.log('User ID:', id);

    // Find user data based on commonKey
    const user = await userData.findOne({ commonKey: id });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
