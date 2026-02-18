const express = require('express');
const { body, validationResult } = require('express-validator');
const MarketplaceItem = require('../models/MarketplaceItem');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/items', async (req, res) => {
  try {
    const { category, search, condition, availability, page = 1, limit = 10 } = req.query;
    
    let query = { isActive: true };
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (condition && condition !== 'all') {
      query.condition = condition;
    }
    
    if (availability && availability !== 'all') {
      query.availability = availability;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const items = await MarketplaceItem.find(query)
      .populate('seller', 'firstName lastName username avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await MarketplaceItem.countDocuments(query);

    res.json({
      items,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get marketplace items error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/items/:id', async (req, res) => {
  try {
    const item = await MarketplaceItem.findById(req.params.id)
      .populate('seller', 'firstName lastName username avatar email')
      .populate('reviews.user', 'firstName lastName username avatar');

    if (!item || !item.isActive) {
      return res.status(404).json({ message: 'Item not found' });
    }

    await item.incrementViews();

    res.json({ item });
  } catch (error) {
    console.error('Get marketplace item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/items', auth, [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('category').isIn(['software', 'hardware', 'services', 'resources']).withMessage('Invalid category'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('condition').isIn(['new', 'like-new', 'good', 'fair', 'poor']).withMessage('Invalid condition')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, category, price, condition, images, tags } = req.body;

    const item = new MarketplaceItem({
      title,
      description,
      category,
      price,
      condition,
      seller: req.user.id,
      images: images || [],
      tags: tags || []
    });

    await item.save();

    const populatedItem = await MarketplaceItem.findById(item._id)
      .populate('seller', 'firstName lastName username avatar');

    res.status(201).json({
      item: populatedItem
    });
  } catch (error) {
    console.error('Create marketplace item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/items/:id', auth, [
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().notEmpty().withMessage('Description cannot be empty'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const item = await MarketplaceItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this item' });
    }

    const { title, description, price, condition, images, tags, availability } = req.body;
    const updateData = {};

    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (condition) updateData.condition = condition;
    if (images) updateData.images = images;
    if (tags) updateData.tags = tags;
    if (availability) updateData.availability = availability;

    const updatedItem = await MarketplaceItem.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('seller', 'firstName lastName username avatar');

    res.json({ item: updatedItem });
  } catch (error) {
    console.error('Update marketplace item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/items/:id/like', auth, async (req, res) => {
  try {
    const item = await MarketplaceItem.findById(req.params.id);

    if (!item || !item.isActive) {
      return res.status(404).json({ message: 'Item not found' });
    }

    await item.toggleLike(req.user.id);

    const updatedItem = await MarketplaceItem.findById(req.params.id)
      .populate('seller', 'firstName lastName username avatar');

    res.json({ item: updatedItem });
  } catch (error) {
    console.error('Like marketplace item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/items/:id/review', auth, [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().isString().withMessage('Comment must be a string')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { rating, comment } = req.body;

    const item = await MarketplaceItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    const existingReview = item.reviews.find(
      review => review.user.toString() === req.user.id
    );

    if (existingReview) {
      existingReview.rating = rating;
      existingReview.comment = comment;
      existingReview.date = new Date();
    } else {
      item.reviews.push({
        user: req.user.id,
        rating,
        comment,
        date: new Date()
      });
    }

    await item.save();

    const updatedItem = await MarketplaceItem.findById(req.params.id)
      .populate('reviews.user', 'firstName lastName username avatar');

    res.json({
      message: 'Review submitted successfully',
      item: updatedItem
    });
  } catch (error) {
    console.error('Review marketplace item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/my-items', auth, async (req, res) => {
  try {
    const items = await MarketplaceItem.find({ seller: req.user.id })
      .sort({ createdAt: -1 });

    res.json({ items });
  } catch (error) {
    console.error('Get my items error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/items/:id', auth, async (req, res) => {
  try {
    const item = await MarketplaceItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this item' });
    }

    item.isActive = false;
    await item.save();

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Delete marketplace item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const categories = await MarketplaceItem.distinct('category');
    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
