const mongoose = require('mongoose');
const Category = require('../models/category');
const SubCategory = require('../models/subCategory')
const Service = require('../models/service')

const Product = require('../models/product');

const slugify = require('slugify');
const asyncHandler = require('express-async-handler');

exports.createsubCategory = asyncHandler(async(req, res) =>{
    if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
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
    const newSubCateory = new SubCategory({
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
    const subcategory = await SubCategory.findById(subcategoryId);
    if(!subcategory){
        return res.status(404).json({messsage : "subCategory not found"});
    }
    return res.status(200).json(subcategory);
});



exports.getAllsubCategories = asyncHandler(async(req, res) =>{
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const totalsubCategories = await SubCategory.countDocuments();

    const subcategories = await SubCategory.find()
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

exports.updatesubCategory = asyncHandler(async(req, res) =>{
    if(req.user.role !== "admin"){
        return res.status(403).json({message: "Access denied. Mangers Only"});
    }

    const { subcategoryId } = req.params;
    if (!/^[0-9a-fA-F]{24}$/.test(subcategoryId)){
        return res.status(400).json({message: "Invaild SubCartegory ID format"})
    }

    const subCategory = await SubCategory.findById(subcategoryId);
    if(!subCategory){
        return res.status(404).json({message: "Category not Found"});
    }

    const {name, image, categoryId} = req.body;
    if(name) subCategory.name = name;
    const slug = slugify(name, { lower: true});
    subCategory.slug = slug;
    if(image) subCategory.image = image;
    if(categoryId) subCategory.categoryId;

    await subCategory.save();
    return res.status(200).json({message: "SubCategory Update Successfully"});
});

exports.deletesubCategory = asyncHandler(async(req, res) =>{
    const { subcategoryId } = req.params;
    if (req.user.role !== 'admin') {
        return res.status(403).json({message: "Access denied. Managers Only"})
    }

    if (!/^[0-9a-fA-F]{24}$/.test(subcategoryId)){
        return res.status(400).json({message: "Invaild SubCategory ID formate"});
    }

    // Start Session and Transaction
    const session = await mongoose.startSession();
    session.startTransaction();
    try{
        const subcategory = await SubCategory.findById(subcategoryId);
        if(!subcategory){
            return res.status(404).json({message: "subCategory not found"});
        }
        const products = await Product.find({ subcategoriesId: subcategoryId }).session(session);
        const services = await Service.find({ subcategoriesId: subcategoryId }).session(session);

        for (const service of services){
            if(service.subcategoriesId.length > 1 ){
                await Service.updateOne(
                    {_id: service._id},
                    {$pull: {subcategoriesId: subcategoryId}}
                ).session(session);
                
            } else{
                await Service.findByIdAndDelete(service._id).session(session)
            }
        }
        for(const product of products){
            if(product.subcategoriesId.length > 1){
                await Product.updateOne(
                    {_id: product._id},
                    {$pull: {subcategoriesId: subcategoryId}}
                ).session(session);
            } else{
                await Product.findByIdAndDelete(product._id).session(session);
            }
        }
        await SubCategory.findByIdAndDelete(subcategoryId).session(session);

        //confirm changes and end session
        await session.commitTransaction();
        session.endSession()
        return res.status(204).json({message: "SubCategory deleted Sucessfully"});
    } catch(error){
        //If there is any error, all changes will be reverted.
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({message: "Something went wrong", error: error.message })
    }
});