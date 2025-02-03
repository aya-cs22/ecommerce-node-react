const mongoose = require('mongoose');
const brandSchema = new mongoose.Schema({
    name:{
        type:String,
        trim: true,
        required:[true, 'Brand is required'],
        unique:[true, 'Brand must be Uniqe'],
        minlength:[3, 'Brand Name cannot be shorter than 3 characters'],
        maxlength:[40, 'Brand Name cannot be longer than 40 characters'],
    },
    slug:{
        type:String,
        lowerCase:true,
    },
    image:String
},
{timestamps: true}
);
const Brand = mongoose.model('Brand', brandSchema);
module.exports = Brand;