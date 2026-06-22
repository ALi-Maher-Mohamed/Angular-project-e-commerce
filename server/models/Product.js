const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  discountPercentage: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  stock: { type: Number, default: 0 },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  thumbnail: { type: String, default: '' },
  images: { type: [String], default: [] },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
