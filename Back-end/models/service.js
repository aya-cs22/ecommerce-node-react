const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    serviceName: { type: String, required: true }, 
    slug: {
        type: String,
        unique: true,
        trim: true,
        set: (val) => val.toLowerCase()
    },
    description: { type: String, required: true }, 
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, 
    subcategoriesId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory' }],
    price: { type: Number, required: true },
    estimatedTime: { type: String }, 
    serviceCenter: { type: String },
    imageCover: { type: String }, 
}, { timestamps: true });

const Service = mongoose.model('Service', serviceSchema);
module.exports = Service;
