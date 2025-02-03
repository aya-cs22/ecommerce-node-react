const mongoose = require('mongoose');

const supportTicketSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  subject: {
    type: String,
    required: true,
  },
  category:{
          type:mongoose.Schema.ObjectId,
          required:[true, 'Category is required'],
          ref:'Category'
      },
  subcategories:{
    type:mongoose.Schema.ObjectId,
    required:[true, 'subCategory is required'],
    ref:'subCategory'
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'resolved'],
    default: 'open',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('SupportTicket', supportTicketSchema);
