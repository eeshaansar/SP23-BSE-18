const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new mongoose.Schema({
  name: String,
  color: [String],
  size: [String],
  description: String,
  price: Number,
  image: String,
  category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category', // The name of the category model
      required: true
  }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
