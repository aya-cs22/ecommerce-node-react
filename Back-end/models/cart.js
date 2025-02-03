const mongoose = require('mongoose');
const cartSchema = new mongoose.Schema({
  cartItems:[{
    product:{
      type: mongoose.Schema.ObjectId,
      ref:'Product',
      required:[true, 'Product is required'],
    },
    quantity:{
      type:Number,
      default:1,
    },
    color:String,
    price:Number,
  },
  ], 
  totalPrice: Number,
  totalPriceAfterDiscount: Number,
  user:{
    type: mongoose.Schema.ObjectId,
    ref:'User',
    required:[true, 'User is required'],
  },
},
{timestamps: true},
);
const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;