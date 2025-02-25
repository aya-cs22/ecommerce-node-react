const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: [true, 'Review text is required'],
        minlength: [10, 'Review must be at least 10 characters'],
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot be more than 5'],
    },
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: [true, 'Review must belong to a product'],
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong to a user'],
    }
}, { timestamps: true });

// prevent the user writing  more than  one review for the same product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Calculate avarge  ratings for each operation
reviewSchema.statics.calculateAverageRatings = async function (productId) {
    const stats = await this.aggregate([
        { $match: { product: productId } },
        {
            $group: {
                _id: '$product',
                ratingsAverage: { $avg: '$rating' },
                ratingsQuantity: { $sum: 1 }
            }
        }
    ]);

    if (stats.length > 0) {
        await mongoose.model('Product').findByIdAndUpdate(productId, {
            ratingsAverage: stats[0].ratingsAverage,
            ratingsQuantity: stats[0].ratingsQuantity
        });
    } else {
        await mongoose.model('Product').findByIdAndUpdate(productId, {
            ratingsAverage: 1,
            ratingsQuantity: 0
        });
    }
};

// Update average rating when new rating is added
reviewSchema.post('save', async function () {
    await this.constructor.calculateAverageRatings(this.product);
});

// Update average rating when new rating is updated
reviewSchema.post('findOneAndUpdate', async function (doc) {
    if (doc) {
        await doc.constructor.calculateAverageRatings(doc.product);
    }
});

// Update average rating when new rating is deleted
reviewSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await doc.constructor.calculateAverageRatings(doc.product);
    }
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;


/**
 * user 1:
 *    "rating":4 ⭐⭐⭐⭐
 *    After user1
 * ratingsAverage = 4 
 * "ratingsQuantity": 1 => One user
 * ===================
 * 
 * user2 :
 *    "rating":5 ⭐⭐⭐⭐⭐
 * after user2:
 * ratingsAverage = (4 + 5) / 2 = 4.5
*     {
        "ratingsAverage": 4.5,
        "ratingsQuantity": 2
        }
 * 
 */