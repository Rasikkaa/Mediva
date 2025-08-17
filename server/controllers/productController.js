import productData from "../models/Products.js";
// @desc    Add a new product
// @route   POST /api/products
// @access  Public or Protected (depending on authentication)
export const addProduct = async (req, res) => {
  try {
    // Log the request body and file for debugging
    console.log(req.body);
    console.log(req.file); // Changed from req.files to req.file

    const {
      equipmentName,
      shopId,
      category,
      description,
      quantity,
      rentalPrice
    } = req.body;

    // Validate required fields
    if (
      !equipmentName ||
      !shopId ||
      !category ||
      !description ||
      !quantity ||
      !rentalPrice 
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Process single image file
    const imagePath = req.file ? req.file.path : null; // Get single image path

    const newProduct = new productData({
      equipmentName,
      shopId,
      category,
      description,
      quantity,
      rentalPrice,
      image: imagePath, // Store single image path instead of an array
    });

    const savedProduct = await newProduct.save();
    console.log(savedProduct);

    res.status(201).json({message:'producted added succesfully'});
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Get all products (optional: filter by shopId)
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    

        const products = await productData
      .find({})
      .populate("shopId"); // Populate shop details

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Get a single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await productData
      .findById(req.params.id)
      .populate("shopId", "name location");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Protected (requires authentication if needed)
export const updateProduct = async (req, res) => {
  try {
    console.log(req.params.id);
    console.log(req.body);
    
    // Find existing product
    const product = await productData.findById(req.params.id);
    if (!product) {
      return res.status(400).json({ message: 'Product not found' });
    }

    // Update fields
    product.equipmentName = req.body.equipmentName || product.equipmentName;
    product.description = req.body.description || product.description;
    product.rentalPrice = req.body.rentalPrice || product.rentalPrice;
    product.category = req.body.category || product.category;
    product.quantity = req.body.quantity || product.quantity;

    // If an image is uploaded, update it
    if (req.file) {
      product.image = req.file.path;
    }

    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Protected
export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await productData.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
export const getProductsByShop = async (req, res) => {
    try {
      const { shopId } = req.params;
  
      // Validate the shopId
      if (!shopId) {
        return res.status(400).json({ message: "Shop ID is required" });
      }
  
      // Fetch products associated with the shopId
      const products = await productData.find({ shopId }).populate("shopId", "name location");
  
      // Check if products exist for the given shopId
      if (products.length === 0) {
        return res.status(404).json({ message: "No products found for this shop" });
      }
  
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  };