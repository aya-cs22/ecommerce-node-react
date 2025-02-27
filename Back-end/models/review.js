const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    comment: {
        type: String,
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
        required: function () {
            return !this.service; // required if not service
        }
    },
    service: {
        type: mongoose.Schema.ObjectId,
        ref: 'Service',
        required: function () {
            return !this.product; // required if not product
        }
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong to a user'],
    }
}, { timestamps: true });

// prevent the user writing  more than  one review for the same product or service
reviewSchema.index({ product: 1, user: 1 }, { unique: true });
reviewSchema.index({ service: 1, user: 1 }, { unique: true });

// Calculate avarge  ratings for each product or service
reviewSchema.statics.calculateAverageRatings = async function (itemId, type) {
    const filter = type === 'product' ? { product: itemId } : { service: itemId };
    
    const stats = await this.aggregate([
        { $match: filter },
        {
            $group: {
                _id: type === 'product' ? '$product' : '$service',
                ratingsAverage: { $avg: '$rating' },
                ratingsQuantity: { $sum: 1 }
            }
        }
    ]);

    if (stats.length > 0) {
        const update = {
            ratingsAverage: stats[0].ratingsAverage,
            ratingsQuantity: stats[0].ratingsQuantity
        };
        
        const model = mongoose.model(type === 'product' ? 'Product' : 'Service');
        await model.findByIdAndUpdate(itemId, update);
    } else {
        const reset = { ratingsAverage: 1, ratingsQuantity: 0 };
        const model = mongoose.model(type === 'product' ? 'Product' : 'Service');
        await model.findByIdAndUpdate(itemId, reset);
    }
};

// Update average rating when new rating is added
reviewSchema.post('save', async function () {
    if (this.product) {
        await this.constructor.calculateAverageRatings(this.product, 'product');
    } else if (this.service) {
        await this.constructor.calculateAverageRatings(this.service, 'service');
    }
});

// Update average rating when new rating is updated
reviewSchema.post('findOneAndUpdate', async function (doc) {
    if (doc) {
        if (doc.product) {
            await doc.constructor.calculateAverageRatings(doc.product, 'product');
        } else if (doc.service) {
            await doc.constructor.calculateAverageRatings(doc.service, 'service');
        }
    }
});

// Update average rating when new rating is deleted
reviewSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        if (doc.product) {
            await doc.constructor.calculateAverageRatings(doc.product, 'product');
        } else if (doc.service) {
            await doc.constructor.calculateAverageRatings(doc.service, 'service');
        }
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