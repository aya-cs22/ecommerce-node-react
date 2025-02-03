const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:[true, 'user is required'],
    },
    product:{
        type:mongoose.Schema.ObjectId,
        requird:[true, 'product is required'],
        ref:'Product',
    },
    ratings: {
        type: Number,
        min: [1, 'Rating must be above or equal 1'],
        max: [5, 'Rating must be below or equal 5'],
      },
      feddback:{
        type: String,
      }

},
{timestamps: true},
);

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;