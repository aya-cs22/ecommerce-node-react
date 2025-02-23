const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        trim: true,
        required: [true, 'Category is required'],
        unique:[true, 'Name must be unique'],
    },
    slug:{
        type:String,
        lowerCase:true,
    },
    image: String,

},
{ timestamps: true },
);





const Category = mongoose.model('Category', categorySchema);
module.exports = Category;