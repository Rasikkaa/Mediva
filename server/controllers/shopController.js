import bcrypt from 'bcrypt';
import shopData from '../models/Rentalshop.js';
import loginData from '../models/Login.js';
import productData from '../models/Products.js';
import Booking from '../models/Booking.js';

export const registerShop = async (req, res) => {
  const { shopName, email, password, address,username,phone } = req.body;

  try {
    // Check if email is already in use
    const existingShop = await shopData.findOne({ email });
    if (existingShop) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Check if login username is already in use
    const existingLogin = await loginData.findOne({ userName: username });
    if (existingLogin) {
      return res.status(400).json({ message: 'Username already in use' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create login credentials
    const newLogin = new loginData({
      userName: username,
      passWord: hashedPassword,
      role: 'shop',
    });
    await newLogin.save();

    // Register new shop
    const newShop = new shopData({
      commonKey: newLogin._id,
      shopName,
      email,
      phone,
      address
     
    });
    await newShop.save();

    res.status(201).json({ message: 'Shop registered successfully' });
  } catch (error) {
    console.error('Error during shop registration:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
// Get shop home data
export const getShopHome = async (req, res) => {
  const { shopId } = req.params;
console.log(shopId,';lllllllllllll');

  try {
    const shop = await shopData.findOne({commonKey:shopId});
    if (!shop) {
      return res.status(400).json({ message: 'Shop not found' });
    }

    res.json(shop);
  } catch (error) {
    console.error('Error fetching shop data:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// get shop bookings

export const getShopBookings = async (req, res) => {
  try {
    const { shopId } = req.params; // Extract shopId from query parameters
console.log(shopId);

    if (!shopId) {
      return res.status(403).json({ message: 'Unauthorized access: Shop ID missing' });
    }

    // Find all products that belong to the given shopId
    const products = await productData.find({ shopId });
console.log(products);

    if (!products || products.length === 0) {
      return res.status(400).json({ message: 'No products found for this shop' });
    }

    // Get productIds from the products
    const productIds = products.map(product => product._id);

    // Find all bookings for the products belonging to this shop
    const bookings = await Booking.find({ productId: { $in: productIds } }).populate('productId').populate('userId')
console.log(bookings);

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const getAllShop = async (req, res) => {
  try {
    const shops = await shopData.find({}); // Await the database query
    console.log(shops);
    
    res.status(200).json(shops); // Send response with data
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message }); // Handle errors properly
  }
};

export const updateRentalShop = async (req, res) => {
  const { shopId } = req.params;
  const { shopName, email, address,phone } = req.body;

  try {
    // Find the shop by ID
    const shop = await shopData.findOne({ commonKey: shopId });
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    // Update shop details
    if (shopName) shop.shopName = shopName;
    if (email) {
      // Check if email is already used by another shop
      const existingShop = await shopData.findOne({ email });
      if (existingShop && existingShop._id.toString() !== shop._id.toString()) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      shop.email = email;
    }
    if (address) shop.address = address;
    if(phone) shop.phone=phone;
    await shop.save();

    res.status(200).json({ message: 'Shop updated successfully', shop });
  } catch (error) {
    console.error('Error updating shop:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteRentalShop = async (req, res) => {
  const { shopId } = req.params;
console.log(shopId);

  try {
    // Find the shop by commonKey
    const shop = await shopData.findById(  shopId );
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    // Delete associated login credentials
    await loginData.findByIdAndDelete(shop.commonKey);

    // Find and delete products associated with the shop
    const products = await productData.find({ shopId });

    if (products.length > 0) {
      const productIds = products.map(product => product._id);
      
      // Delete bookings related to the shop's products
      await Booking.deleteMany({ productId: { $in: productIds } });

      // Delete all products of the shop
      await productData.deleteMany({ shopId });
    }

    // Delete the shop itself
    await shopData.findByIdAndDelete(shop._id);

    res.status(200).json({ message: 'Shop deleted successfully' });
  } catch (error) {
    console.error('Error deleting shop:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const getShopCounts = async (req, res) => {
  const { shopId } = req.params;
console.log(shopId);

  try {
    // Fetch product counts
    const totalProducts = await productData.countDocuments({ shopId });
    const availableProducts = await productData.countDocuments({ shopId,  quantity: { $gt: 0 } });
    const bookings = await Booking.find().populate({
      path: 'productId',
      select: 'shopId'
    });
    
    const completedBookings = bookings.filter(
      booking => booking.productId?.shopId.toString() === shopId
    ).length;
    
    console.log(completedBookings);
  
    res.status(200).json({
      totalProducts,
      availableProducts,
      
      completedBookings,
    });
  } catch (error) {
    console.error('Error fetching shop counts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};