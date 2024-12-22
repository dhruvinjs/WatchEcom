const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    orderId: String,
    userId: String,
    date: { type: Date, default: Date.now }, // Default to current date
    address: String,
    email: String,
    name: String,
    productIds: [String],
    trackingId: String,
    price: Number
  });
  
  const Order = mongoose.model('Order', orderSchema);
  module.exports = Order
  