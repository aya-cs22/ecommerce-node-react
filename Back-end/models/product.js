const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        trim: true,
        required: [true, 'Product name is required'],
    
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        set: (val) => val.toLowerCase()
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        
    },
    categoryId: {
        type: mongoose.Schema.ObjectId,
        required: [true, 'Category is required'],
        ref: 'Category'
    },
    subcategoriesId: [{
        type: mongoose.Schema.ObjectId,
        ref: 'SubCategory'
    }],
    brandId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Brand',
        required: [true, 'Brand is required']
    },
    colors: {
        type: [String],
        required: [true, 'At least one color is required'],
        validate: {
            validator: function (val) {
                return Array.isArray(val) && val.length > 0;
            },
            message: 'At least one color is required'
        },
        set: (val) => [...new Set(val.map(color => color.toLowerCase()))] // Remove duplicates and unify letters
    },
    
    imageCover: {
        type: String,
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
    },
    discountPercentage: {
        type: Number,
        default: 0
    },
    images: [String],
    stock: {
        type: Number,
        required: [true, 'Product stock is required']
    },
    sold: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });
productSchema.pre('save', function (next) {
    this.priceAfterDiscount = this.price - (this.price * this.discountPercentage / 100);
    next();
});

// productSchema.index({ slug: 1 });
// productSchema.index({ category: 1 });
// productSchema.index({ brand: 1 });
// productSchema.index({ category: 1, brand: 1 });
// productSchema.index({ price: 1 });

productSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'product'
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
