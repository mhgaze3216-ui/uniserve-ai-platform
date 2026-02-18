const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['student', 'creator', 'startup', 'uniserve', 'education', 'consultation', 'cybersecurity']
  },
  image: {
    type: String,
    required: true,
    default: 'https://via.placeholder.com/300x200'
  },
  images: [{
    type: String
  }],
  features: [{
    type: String
  }],
  specifications: {
    type: Map,
    of: String
  },
  inStock: {
    type: Boolean,
    default: true
  },
  stockQuantity: {
    type: Number,
    default: 0,
    min: 0
  },
  isDigital: {
    type: Boolean,
    default: false
  },
  downloadUrl: {
    type: String
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  discountPrice: {
    type: Number,
    min: 0
  },
  discountUntil: {
    type: Date
  }
}, {
  timestamps: true
});

// Virtual for final price (with discount if applicable)
productSchema.virtual('finalPrice').get(function() {
  if (this.discountPrice && this.discountUntil && this.discountUntil > new Date()) {
    return this.discountPrice;
  }
  return this.price;
});

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.discountPrice && this.discountUntil && this.discountUntil > new Date()) {
    return Math.round(((this.price - this.discountPrice) / this.price) * 100);
  }
  return 0;
});

// Method to add review
productSchema.methods.addReview = function(userId, rating, comment) {
  const existingReview = this.reviews.find(review => review.user.toString() === userId.toString());
  
  if (existingReview) {
    existingReview.rating = rating;
    existingReview.comment = comment;
    existingReview.createdAt = new Date();
  } else {
    this.reviews.push({ user: userId, rating, comment });
  }
  
  // Update average rating
  this.rating = this.reviews.reduce((sum, review) => sum + review.rating, 0) / this.reviews.length;
  this.numReviews = this.reviews.length;
  
  return this.save();
};

// Method to remove review
productSchema.methods.removeReview = function(userId) {
  this.reviews = this.reviews.filter(review => review.user.toString() !== userId.toString());
  
  if (this.reviews.length > 0) {
    this.rating = this.reviews.reduce((sum, review) => sum + review.rating, 0) / this.reviews.length;
  } else {
    this.rating = 0;
  }
  
  this.numReviews = this.reviews.length;
  return this.save();
};

// Index for search
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

// Ensure JSON includes virtuals
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
