const mongoose = require('mongoose');
const Category = require('../models/category');
const subCategory = require('../models/subCategory')

const slugify = require('slugify');
const asyncHandler = require('express-async-handler');

exports.createsubCategory = asyncHandler(async(req, res) =>{
    if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Mangers only.' });
        }   
    const {name, image, categoryId} = req.body;
    if(!name || !image || !categoryId){
        return res.status(400).json({message: "Please Provied all faileds."})
    }
    const slug = slugify(name, { lower: true });
    const category = await Category.findById(categoryId);
    if(!category){
        return res.status(404).json({message: "Category not found"});
    }
    const newSubCateory = new subCategory({
        name,
        slug,
        image,
        categoryId
    })
    await newSubCateory.save();
    return res.status(201).json({message: "SubCategory created successfully"});
});


exports.getsubCategoryById = asyncHandler(async(req, res) =>{
    const { subcategoryId } = req.params;

    if (!/^[0-9a-fA-F]{24}$/.test(subcategoryId)) {
        return res.status(400).json({ message: 'Invalid subCategory ID format' });
    }
    const subcategory = await subCategory.findById(subcategoryId);
    if(!subcategory){
        return res.status(404).json({messsage : "subCategory not found"});
    }
    return res.status(200).json(subcategory);
});



exports.getAllsubCategories = asyncHandler(async(req, res) =>{
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const totalsubCategories = await subCategory.countDocuments();

    const subcategories = await subCategory.find()
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

    return res.status(200).json({
        totalsubCategories,
        totalPages: Math.ceil(totalsubCategories / limit),
        currentPage: page,
        subcategories
    });
});



exports.deletesubCategory = asyncHandler(async(req, res) =>{

});