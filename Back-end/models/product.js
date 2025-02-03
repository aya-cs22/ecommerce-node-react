const { MongoDBCollectionNamespace } = require('mongodb');
const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    productName:{
        type:String,
        trim: true,
        required:[true, 'product Name is required'],
        minlenght:[3, 'product Name cannot be shorter than 3 characters'],
        maxlength:[40, 'product Name cannot be longger than 40 characters'],
    },
    slug:{
        type:String,
        required:true,
        lowerCase:true,
    },

    description:{
        type:String,
        required:[true, 'Description is requird'],
        minlenght:[10, 'Description shorter than 10 characters'],
        maxlength:[70, 'Description longger than 70 characters'],
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
    brand:{
        types: mongoose.Schema.ObjectId,
        required: [true, 'Brand is required']
    },

    colors:{
        type:[String],
        required:[true, 'Color is required'],
    },
    imageCover:{
        type:String,
        required:[true, 'image Cover is required']
    },

    price:{
        type:Number,
        required:[true, 'Price is required'],
    },
    images:[String],
    stock:{
        type:Number,
        required:[true, 'Product stock is required']
    },
    sold:{
        type: Number,
        default:0,
    },
    priceAfterDiscount:{
        type:Number,
    },

           
//  ratingsAverage // 4.8
//  ratingsQuantity // person  100
//  ratingSum //480
    ratingsAverage:{
        type:Number,
        min: [1, 'Rating must be above or equal 1'],
        max: [5, 'Rating must be below or equal 5'],
    },
    ratingsQuantity:{
        type:Number,
        deafult :0,
    },
    ratingSum:{
        type:Number,
        deafult:0,
    },
},
{timestamps},
);

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
