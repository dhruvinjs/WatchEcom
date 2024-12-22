const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Cart = require('../models/cartmodel');
const User=require('../models/user');
const Order=require('../models/ordermodel')
const Product = require('../models/product'); // Replace with correct path
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true', // Convert string to boolean
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

router.post('/get-cart-count', async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required.' });
  }

  try {
    // Find the user's cart
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(200).json({ count: 0 }); // No cart, so count is 0
    }

    // Calculate total count of products in the cart
    const totalCount = cart.productsInCart.reduce(
      (total, item) => total + (item.productQty || 0), // Ensure productQty exists or fallback to 0
      0
    );

    res.status(200).json({ count: totalCount });
  } catch (error) {
    console.error('Error fetching cart count:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Add to Cart Route
router.post('/addtocart', async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    let cart = await Cart.findOne({ userId });
    const productQty = parseInt(quantity);

    if (cart) {
      cart.productsInCart.push({ productId, productQty });
      await cart.save();
    } else {
      cart = new Cart({ userId, productsInCart: [{ productId, quantity }] });
      await cart.save();
    }

    res.status(200).json({ success: true, message: 'Product added to cart successfully', cart });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error adding product to cart', error: error.message });
  }
});

// Get Cart by User ID Route
router.post('/get-cart', async (req, res) => {
  try {
    const { userId } = req.body;
    const cart = await Cart.findOne({ userId });

    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found for this user' });

    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching cart', error: error.message });
  }
});

router.put('/update-quantity', async (req, res) => {
  const { userId, productId, productQty } = req.body;

  if (!userId || !productId || typeof productQty !== 'number') {
    return res.status(400).json({ message: 'userId, productId, and a valid productQty are required.' });
  }

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found.' });
    }

    const product = cart.productsInCart.find(item => item.productId === productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found in the cart.' });
    }

    product.productQty = productQty;
    await cart.save();

    res.status(200).json({ message: 'Quantity updated successfully.' });
  } catch (error) {
    console.error('Error updating quantity:', error);
    res.status(500).json({ message: 'An error occurred while updating the quantity.' });
  }
});
// Delete Item from Cart Route
router.post('/delete-items', async (req, res) => {
  const { userId, productId } = req.body;

  if (!userId || !productId) {
    return res.status(400).json({ message: 'userId and productId are required.' });
  }

  try {
    const result = await Cart.updateOne(
      { userId },
      { $pull: { productsInCart: { productId } } }
    );

    if (result.modifiedCount > 0) {
      res.status(200).json({ message: 'Item deleted successfully.' });
    } else {
      res.status(404).json({ message: 'Item not found in the cart.' });
    }
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ message: 'An error occurred while deleting the item.' });
  }
});

// Route to update quantity

// Place Order Route
const { v4: uuidv4 } = require('uuid'); // Import uuid package


// Place Order Route
router.post('/place-order', async (req, res) => {
  try {
    const { userId, address, email, name, productIds, price } = req.body;
    console.log(userId)
    // Find the user by userId
    const user = await User.findOne({ name });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Generate unique orderId and trackingId
    const orderId = uuidv4(); 
    const trackingId = uuidv4();
    // const userObjectId = mongoose.Types.ObjectId(userId);

    // // Find the user by userId
    // const user = await User.findOne({ _id: userObjectId });
    // Set the order date (2 days from today)
    const orderDate = new Date();
    orderDate.setDate(orderDate.getDate() + 2); // Add 2 days to the current date

    // Format the date to only include year, month, and day
    const formattedDate = orderDate.toISOString().split('T')[0]; // 'YYYY-MM-DD'

    // Create a new Order object
    const newOrder = new Order({
      orderId,
      userId,
      date: formattedDate,
      address,
      email,
      name,
      productIds,
      price,
    });

    // Save the new order to the database
    const savedOrder = await newOrder.save();

    // Send an email confirmation to the user
    const emailHtml = `<div>Order Confirmation for ${user.name}...</div>`; // Simplified for brevity
    await transporter.sendMail({
      from: 'pecommerce8@gmail.com',
      to: user.email,
      subject: 'Order Confirmation',
      html: emailHtml,
    });

    // Send the response with success status
    res.status(200).json({ success: true, message: 'Order placed successfully', orderId, trackingId });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error placing order', error: error.message });
  }
});



module.exports = router;
