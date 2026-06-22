const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.Mixed, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
