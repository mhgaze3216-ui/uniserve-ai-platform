const express = require('express');
const { body, validationResult } = require('express-validator');
const Consultation = require('../models/Consultation');
const auth = require('../middleware/auth');

const router = express.Router();

const advisorResponses = {
  business: [
    "I understand your business challenge. Let me analyze that for you...",
    "Based on business best practices, I recommend...",
    "For optimal business operations, consider these strategies...",
    "Your business query requires careful consideration of market trends..."
  ],
  technology: [
    "From a technology perspective, here's what I suggest...",
    "Let me help you with this technical implementation...",
    "For optimal software architecture, consider...",
    "This tech challenge can be solved using modern approaches..."
  ],
  healthcare: [
    "From a healthcare data analysis perspective...",
    "Medical technology considerations for your query...",
    "Healthcare AI applications suggest...",
    "For optimal health data management..."
  ],
  legal: [
    "From a legal document analysis perspective...",
    "Regulatory compliance considerations suggest...",
    "Legal AI assistance indicates...",
    "For proper legal framework implementation..."
  ]
};

router.post('/start', auth, [
  body('field').isIn(['business', 'technology', 'healthcare', 'legal']).withMessage('Invalid consultation field'),
  body('title').notEmpty().withMessage('Consultation title is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { field, title } = req.body;

    const consultation = new Consultation({
      user: req.user.id,
      field,
      title
    });

    await consultation.save();

    const welcomeMessages = {
      business: "Hello! I am your Business Consultation specialist. How can I help you optimize your operations or strategy today?",
      technology: "Welcome to Technology Consultation. I can assist with AI implementation, software architecture, or digital transformation. What tech challenge are we solving?",
      healthcare: "Greetings. As your Healthcare AI Advisor, I can help with health data analysis or medical tech inquiries. How can I assist you?",
      legal: "Hello. I am the Legal AI Assistant. I can help you with document review or regulatory compliance questions. What do you need help with?"
    };

    await consultation.addMessage('consultant', welcomeMessages[field]);

    res.status(201).json({
      consultation: {
        id: consultation._id,
        field: consultation.field,
        title: consultation.title,
        status: consultation.status,
        messages: consultation.messages,
        startTime: consultation.startTime
      }
    });
  } catch (error) {
    console.error('Start consultation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/my-consultations', auth, async (req, res) => {
  try {
    const consultations = await Consultation.find({ user: req.user.id })
      .sort({ startTime: -1 })
      .select('field title status startTime endTime rating');

    res.json({ consultations });
  } catch (error) {
    console.error('Get consultations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const consultation = await Consultation.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }

    res.json({ consultation });
  } catch (error) {
    console.error('Get consultation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:id/message', auth, [
  body('message').notEmpty().withMessage('Message cannot be empty')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { message } = req.body;

    const consultation = await Consultation.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }

    await consultation.addMessage('user', message);

    setTimeout(async () => {
      const responses = advisorResponses[consultation.field];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      await consultation.addMessage('consultant', randomResponse);
    }, 1000);

    res.json({
      message: 'Message sent successfully',
      consultation: {
        id: consultation._id,
        messages: consultation.messages
      }
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id/complete', auth, [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('feedback').optional().isString().withMessage('Feedback must be a string')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { rating, feedback } = req.body;

    const consultation = await Consultation.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }

    consultation.status = 'completed';
    consultation.endTime = new Date();
    consultation.rating = rating;
    if (feedback) consultation.feedback = feedback;

    await consultation.save();

    res.json({
      consultation: {
        id: consultation._id,
        status: consultation.status,
        endTime: consultation.endTime,
        rating: consultation.rating,
        feedback: consultation.feedback
      }
    });
  } catch (error) {
    console.error('Complete consultation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const consultation = await Consultation.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }

    consultation.status = 'cancelled';
    await consultation.save();

    res.json({ message: 'Consultation cancelled successfully' });
  } catch (error) {
    console.error('Cancel consultation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
