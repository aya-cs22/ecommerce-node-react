const mongoose = require('mongoose');

const shippingSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
  },
  shippingMethod: {
    type: String,
    enum: ['standard', 'express'],
    required: true,
  },
  shippingAddress: {
    type: String,
    required: true,
  },
  shippingStatus: {
    type: String,
    enum: ['pending', 'shipped', 'delivered'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Shipping', shippingSchema);
