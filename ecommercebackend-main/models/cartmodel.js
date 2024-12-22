const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: String,
  productsInCart: [{
    productId: String,
    productName:String,
    productQty: Number
  }]
});

module.exports = mongoose.model('Cart', cartSchema);
