const express = require('express');
const Favorite = require('../models/Favorite');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const items = await Favorite.find();
    const mapped = items.map((item) => ({ ...item.toObject(), id: item._id }));
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    console.log('[FAVORITES POST] req.body:', JSON.stringify(req.body));
    const { productId } = req.body;
    if (productId === undefined || productId === null || productId === '') {
      return res.status(400).json({ message: 'productId is required' });
    }
    const item = await Favorite.create({ productId });
    res.status(201).json({ ...item.toObject(), id: item._id });
  } catch (err) {
    console.error('[FAVORITES POST] Error:', err.message);
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Favorite.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Favorite not found' });
    res.json({ message: 'Favorite deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
