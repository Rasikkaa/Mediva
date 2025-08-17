import order from "../models/order.js";


// Create a new order
export const createOrder = async (req, res) => {
  try {
    const { userId, orderText ,address,phone} = req.body;
    const imageUrl = req.file ? req.file.path : null;

    const newOrder = new order({ userId, orderText, imageUrl,address,phone });
    await newOrder.save();

    res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    res.status(500).json({ error: "Failed to create order" });
  }
};

// Get all orders for a user
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.params.userId;
    const orders = await order.find({ userId });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};
export const allOrders = async (req, res) => {
    try {
    //   console.log("Fetching all orders...");
  
      const orders = await order.find().populate("userId").sort({ _id: -1 });
  
    //   console.log("Fetched Orders:", orders);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Failed to fetch orders", details: error.message });
    }
  };
  
  export const updateOrderStatus = async (req, res) => {
    try {
      const { id } = req.params; // Extract order ID from URL params
      const { status } = req.body; // Get new status from request body
  console.log(status);
  
      // Find the order by ID and update the status
      const updatedOrder = await order.findByIdAndUpdate(
        id,
        { status},
        { new: true } // Return the updated document
      );
  
      // If order not found
      if (!updatedOrder) {
        return res.status(404).json({ error: "Order not found" });
      }
  
      res.json(updatedOrder); // Send the updated order as response
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ error: "Failed to update order status" });
    }
  };
  export const updatePaymentStatus = async (req, res) => {
    try {
      const { id } = req.params; // Extract order ID from URL params
  
      // Find the order by ID and update the status
      const updatedOrder = await order.findByIdAndUpdate(
        id,
        { isPaid:true},
        { new: true } // Return the updated document
      );
  
      // If order not found
      if (!updatedOrder) {
        return res.status(404).json({ error: "Order not found" });
      }
  
      res.json(updatedOrder); // Send the updated order as response
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ error: "Failed to update order status" });
    }
  };