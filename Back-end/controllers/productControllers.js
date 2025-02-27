const Product = require('../models/product');
const Category = require('../models/category');
const SubCategory = require('../models/subCategory');
const Brand = require('../models/brand');
const asyncHandler = require('express-async-handler');
const slugify= require('slugify');
//CRUD product

//create product
exports.creatProduct = asyncHandler(async(req, res) =>{
    if(req.user.role !== "admin"){
        return res.status(403).json({message: "Acess denied"});
    }
    const {productName, description, categoryId, subcategoriesId, brandId, colors, imageCover, price,discountPercentage,images,stock,sold } = req.body;
    if (!productName || !description || !categoryId || !subcategoriesId || !brandId || !colors || !imageCover || !price || !discountPercentage || !images ||!stock){
        return res.status(400).json({message: "Please provide all required fields correctly."});
    }

    const category = await Category.findById(categoryId);
    const subCategory = await SubCategory.findById(subcategoriesId);
    const brand = await Brand.findById(brandId);
    if(!category){
        return res.status(404).json({message: "Category not found"});
    }

    if(!subCategory){
        return res.status(404).json({message: "SubCategory not found"});
    }
    if(!brand){
        return res.status(404).json({message: "Brand not found"});
    }
    const slug = slugify(productName, { lower: true });
    
    const newProduct = new Product({
        productName,
        slug,
        description,
        categoryId,
        subcategoriesId,
        brandId,
        colors,
        imageCover,
        price,
        discountPercentage,
        images,
        stock,
        sold

    });
    await newProduct.save();
    return res.status(201).json({message: "Product addedd Successfully"});
});

//update Product
exports.updateProduct = asyncHandler(async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Admin Only" });
    }

    const { ProductId } = req.params;

    if (!/^[0-9a-fA-F]{24}$/.test(ProductId)) {
        return res.status(400).json({ message: 'Invalid Product ID format' });
    }

    let product = await Product.findById(ProductId);
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    const { productName, description, categoryId, subcategoriesId, brandId, colors, imageCover, price, discountPercentage, images, stock, sold } = req.body;

    if (productName) {
        product.productName = productName;
        product.slug = slugify(productName, { lower: true });
    }
    if (description) product.description = description;
    if (categoryId) {
        const category = await Category.findById(categoryId);
        if (!category) return res.status(404).json({ message: "Category not found" });
        product.categoryId = categoryId;
    }
    if (subcategoriesId && Array.isArray(subcategoriesId)) {
        const validSubCategories = await SubCategory.find({ _id: { $in: subcategoriesId } });
        if (validSubCategories.length !== subcategoriesId.length) {
            return res.status(404).json({ message: "One or more subcategories not found" });
        }
        product.subcategoriesId = subcategoriesId;
    }
    if (brandId) {
        const brand = await Brand.findById(brandId);
        if (!brand) return res.status(404).json({ message: "Brand not found" });
        product.brandId = brandId;
    }
    if (colors) product.colors = colors;
    if (imageCover) product.imageCover = imageCover;
    if (price) product.price = price;
    if (discountPercentage) product.discountPercentage = discountPercentage;
    if (images) product.images = images;
    if (stock) product.stock = stock;
    if(stock) product.stock = stock;
    if(sold) {
        product.sold = sold;
        product.stock = Math.max(0, product.stock - product.sold); 
    }


    await product.save();

    res.status(200).json({ message: "Product updated successfully", product });
});


// get product by ID
exports.getProductById = asyncHandler(async(req, res) =>{
    const { productId } = req.params;
    if (!/^[0-9a-fA-F]{24}$/.test(productId)) {
        return res.status(400).json({ message: 'Invalid product ID format' });
    }
    const product = await Product.findById(productId)
    .populate({ path: 'categoryId', select:'name slug image'})
    .populate({ path: 'brandId', select:'name slug image'})
    .populate({ path: 'subcategoriesId', select:'name slug image'})
    if(!product){
        return res.status(404).json({message: "Product not found"});
    }
    return res.status(200).json({message: product})
});


//get all Product
exports.getAllProductes = asyncHandler(async(req, res) =>{
    let { page = 1, limit = 10} = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const totalProductes = await Product.countDocuments();

    const productes = await Product.find()
        .populate({ path: 'categoryId', select:'name slug image'})
        .populate({ path: 'brandId', select:'name slug image'})
        .populate({ path: 'subcategoriesId', select:'name slug image'})
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()

    return res.status(200).json({
        totalProductes,
        totalPages: Math.ceil(totalProductes / limit),
        currentPage: page,
        productes
    });

});


//delete product
exports.deleteProduct = asyncHandler(async(req, res) =>{
    const { productId } = req.params;
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Mangers only.' });
    }
    if (!/^[0-9a-fA-F]{24}$/.test(productId)) {
        return res.status(400).json({ message: 'Invalid product ID format' });
    }
    const product = await Product.findById(productId)
    if(!product){
        return res.status(404).json({message: "Prodct not found"});
    }

    await Product.findByIdAndDelete(productId);
    return res.status(204).json({message: "Product delete Successfully"});
});