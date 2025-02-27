const mongoose = require('mongoose');
const Category = require('../models/category');
const Prodct = require('../models/product');
const SubCategories = require('../models/subCategory');
const Service = require('../models/service');
const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
// create category by admin
exports.createCategory = asyncHandler(async(req, res) =>{
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admin only.' });
    } 
    const {name, image} = req.body;
    const slug = slugify(name, { lower: true }); 
    const newCategory = new Category({
        name,
        slug,
        image
    });
    await newCategory.save();
    return res.status(201).json({message: "Category addedd Successfully."})

});


// get category by id (not required  token)
exports.getCategoryById = asyncHandler(async(req, res) => {
    const { categoryId } = req.params;

    if (!/^[0-9a-fA-F]{24}$/.test(categoryId)) {
        return res.status(400).json({ message: 'Invalid Category ID format' });
    }
    const category = await Category.findById(categoryId);
    if(!category){
        return res.status(404).json({messsage : "Category not found"});
    }
    return res.status(200).json(category);
});


// get all  categories (not required  token)
exports.getAllCategories = asyncHandler(async(req, res) =>{
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const totalCategories = await Category.countDocuments();

    const categories = await Category.find()
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

    return res.status(200).json({
        totalCategories,
        totalPages: Math.ceil(totalCategories / limit),
        currentPage: page,
        categories
    });
});

// update category by admin
exports.updateCategory = asyncHandler(async(req, res) =>{
    const {categoryId} = req.params;
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Mangers only.' });
    }

    if (!/^[0-9a-fA-F]{24}$/.test(categoryId)) {
        return res.status(400).json({ message: 'Invalid Category ID format' });
    }
    const category = await Category.findById(categoryId);
    if(!category){
        return res.status(404).json({messsage : "Category not found"});
    }

    const {name, image} = req.body;
    if(name) category.name = name;
    if(image) category.image = image;
    const slug = slugify(name, { lower: true }); 
    category.slug = slug;
    await category.save();
    return res.status(200).json({message: "Category upate successfully"});

})


// delet category by id by admin
exports.deleteCategory = asyncHandler(async(req, res) =>{
    
    const {categoryId} = req.params;
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Mangers only.' });
    }

    if (!/^[0-9a-fA-F]{24}$/.test(categoryId)) {
        return res.status(400).json({ message: 'Invalid Category ID format' });
    }

    //Start Session
    const session = await mongoose.startSession();
    session.startTransaction();
    try{
        const category = await Category.findById(categoryId);
        if(!category){
            return res.status(404).json({messsage : "Category not found"});
        }
        await Prodct.deleteMany({ categoryId }).session(session);
        await Service.deleteMany({ categoryId }).session(session);
        await SubCategories.deleteMany({ categoryId }).session(session);
        await Category.findByIdAndDelete(categoryId).session(session);

        //Comfirme changes and end session
        await session.commitTransaction();
        session.endSession();
        return res.status(204).json({message: "Category deleted Successfully"});
    } catch {
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
    
});