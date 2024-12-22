const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({

  name: String,
  price: String,
  img: String,
  category: String,
  rating: Number,
  productId: { type: String, unique: true }, 
  inStockValue: Number,
  soldStockValue: Number, 
  visibility: { type: String, default: 'on' } // Visibility field with default 'on'
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;