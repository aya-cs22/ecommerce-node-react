const mongoose = require('mongoose');
const Brand = require('../models/brand');
const slugify = require('slugify');
const asyncHandler = require('express-async-handler');


// Create brand by admin
exports.creatBrand = asyncHandler(async(req, res) =>{
    if(req.user.role !==  "admin"){
        return res.status(403).json({message : "Access denied. mangers Only"});
    }
    const {name, image }  = req.body;
    const slug = slugify(name, { lower: true });

    const newBrand = new Brand({
        name,
        slug,
        image
    });
    await newBrand.save();
    return res.status(201).json({message: "Brand addedd Successfully"})
});


// Update brand by admin
exports.updateBrand = asyncHandler(async(req, res) => {
    if(req.user.role !== "admin"){
        return res.status(403).json({message: "Acess denied. Mangers Only."});
    }

    const { brandId } = req.params
    if (!/^[0-9a-fA-F]{24}$/.test(brandId)){
        return res.status(400).json({message: "Invaild ID format"})
    }
    const brand = await Brand.findById(brandId);
    if(!brand){
        return res.status(404).json({message: "Brand not found"});
    }

    const { name, image} = req.body;
    if(name) brand.name = name;
    if(image) brand.image = image;
    const slug = slugify(name, {lower: true});
    brand.slug= slug
    await brand.save();
    return res.status(200).json({message: "Brand updare Sucessfully"});
});


// get brand by id
exports.getBrandById = asyncHandler(async(req, res) =>{
    const { brandId } = req.params;
    if (!/^[0-9a-fA-F]{24}$/.test(brandId)){
        return res.status(400).json({message: "Invaild Brand ID"})
    } 
    const brand = await Brand.findById(brandId)
    if(!brand){
        return res.status(404).json({message: "Brand not found"});
    }
    return res.status(200).json(brand);
});

//get all brand
exports.getAllBrand = asyncHandler(async(req, res) => {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const totalBrands = await Brand.countDocuments();

    const brands = await Brand.find()
    .skip((page - 1) * limit )
    .limit(limit)
    .lean();

    return res.status(200).json({
        totalBrands,
        totalPages: Math.ceil(totalBrands / limit),
        currentPage: page,
        brands
    });
});

// Delete Brand by ID
exports.deleteBrand = asyncHandler(async(req, res) =>{
    if(req.user.role !== 'admin'){
        return res.status(403).json({message: "Acess denied. Admin Only"});
    }
    const { brandId } = req.params;
    if (!/^[0-9a-fA-F]{24}$/.test(brandId)){
        return res.status(400).json({message:"Invaild Brand ID"});
    }
    const brand = await Brand.findById(brandId);
    if(!brand){
        return res.status(404).json({message : "Brand not found"});
    }

    await Brand.findByIdAndDelete(brandId);
    return res.status(204).json({message : "Brand delete Successfully"});
})