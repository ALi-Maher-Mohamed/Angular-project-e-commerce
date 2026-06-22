const express = require('express');
const Cart = require('../models/Cart');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const items = await Cart.find();
    const mapped = items.map((item) => ({ ...item.toObject(), id: item._id }));
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    console.log('[CART POST] req.body:', JSON.stringify(req.body));
    const { productId, quantity } = req.body;
    if (productId === undefined || productId === null || productId === '') {
      return res.status(400).json({ message: 'productId is required' });
    }
    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'quantity must be at least 1' });
    }
    const item = await Cart.create({ productId, quantity });
    res.status(201).json({ ...item.toObject(), id: item._id });
  } catch (err) {
    console.error('[CART POST] Error:', err.message);
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    console.log('[CART PUT] req.params.id:', req.params.id, 'req.body:', JSON.stringify(req.body));
    const { productId, quantity } = req.body;
    if (productId === undefined || productId === null || productId === '') {
      return res.status(400).json({ message: 'productId is required' });
    }
    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'quantity must be at least 1' });
    }
    const item = await Cart.findByIdAndUpdate(req.params.id, { productId, quantity }, { new: true });
    if (!item) return res.status(404).json({ message: 'Cart item not found' });
    res.json({ ...item.toObject(), id: item._id });
  } catch (err) {
    console.error('[CART PUT] Error:', err.message);
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Cart.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Cart item not found' });
    res.json({ message: 'Cart item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
