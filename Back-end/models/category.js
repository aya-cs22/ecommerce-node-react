const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        trim: true,
        required: [true, 'Category is required'],
        unique:[true, 'Name must be unique'],
        minlength:[3, 'Name cannot be shorter than 3 characters'],
        maxlength:[30, 'Name cannot be longer than 3 characters']
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