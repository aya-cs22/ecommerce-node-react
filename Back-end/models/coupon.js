const mongoose = require('mongoose');
const couponSchema = new mongoose.Schema({
    code:{
        type:String,
        trim:true,
        required:[true, 'code is required'],
    },

    validUntil:{
        type:Date,
        required:[true, 'valid Until is required'],
    },
    discount:{
        type:Number,
        required:[true, 'Coupon discount is required'],
    },
},
{timestamps: true},
);
const Coupon = mongoose.model('Coupon', couponSchema);
module.exports = Coupon;