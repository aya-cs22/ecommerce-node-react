const mongoose = require('mongoose');
const subCategorySchema = new mongoose.Schema({
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
    categoryId:{
        type:mongoose.Schema.ObjectId,
        ref:'Category',
        required:[true, 'SubCategory must reference a parent category']
    }

},
{ timestamps: true },
);

const SubCategory = mongoose.model('SubCategory', subCategorySchema);
module.exports = SubCategory;