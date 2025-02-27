const Service = require('../models/service');
const Category = require('../models/category');
const SubCategory = require('../models/subCategory');
const asyncHandler = require('express-async-handler')
const slugify = require('slugify');

//Create service By admin
exports.createService = asyncHandler(async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Acess denied" });
    }

    const { serviceName, description, categoryId, subcategoriesId, price, estimatedTime, serviceCenter, imageCover } = req.body;
    const category = await Category.findById(categoryId);
    const subCategory = await SubCategory.findById(subcategoriesId)
    const slug = slugify(serviceName, { lower: true });

    if (!category) {
        return res.status(404).json({ message: "Category not found" });
    }

    if (!subCategory) {
        return res.status(404).json({ message: "SubCategory not found" });

    }
    const newService = new Service({
        serviceName,
        slug,
        description,
        categoryId,
        subcategoriesId,
        price,
        estimatedTime,
        serviceCenter,
        imageCover
    })
    await newService.save();
    return res.status(201).json({ message: "Service addedd Successfully" });
});


//Update service BY admin
exports.updateService = asyncHandler(async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Acess denied" });
    }
    const { serviceId } = req.params;
    if (!/^[0-9a-fA-F]{24}$/.test(serviceId)) {
        return res.status(400).json({ message: 'Invalid service ID format' });
    }

    const service = await Service.findById(serviceId);
    if (!service) {
        return res.status(404).json({ message: "Servece not found" });
    }
    const { serviceName, description, categoryId, subcategoriesId, price, estimatedTime, serviceCenter, imageCover } = req.body;
    if (serviceName) {
        service.serviceName = serviceName;
        service.slug = slugify(serviceName, { lower: true });
    }
    if (description) service.description = description;
    if (categoryId) {
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        service.categoryId = categoryId;
    }

    if (subcategoriesId && Array.isArray(subcategoriesId)) {
        const validSubCategories = await SubCategory.find({ _id: { $in: subcategoriesId } });
        if (validSubCategories.length !== subcategoriesId.length) {
            return res.status(404).json({ message: "One OR More subcategories not found" });
        }
        service.subcategoriesId = subcategoriesId;
    }
    if (price) service.price = price;
    if (estimatedTime) service.estimatedTime = estimatedTime;
    if (serviceCenter) service.serviceCenter = serviceCenter;
    if (imageCover) service.imageCover = imageCover;

    await service.save();
    return res.status(200).json({ message: "Service Update Successfully" });
});

// GET ALL SERVICE
exports.getAllService = asyncHandler(async (req, res) => {
    let { page = 1, limit = 10 } = req.params;
    page = parseInt(page);
    limit = parseInt(limit);

    const totalService = await Service.countDocuments();

    const service = await Service.find()
        .populate({ path: 'categoryId', select: 'name slug image' })
        .populate({ path: 'subcategoriesId', select: 'name slug image' })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()

    return res.status(200).json({
        totalService,
        totalPages: Math.ceil(totalService / limit),
        currentPage: page,
        service
    });
});

// GET SERVICE BY ID
exports.getServiceById = asyncHandler(async (req, res) => {
    const { serviceId } = req.params;
    if (!/^[0-9a-fA-F]{24}$/.test(serviceId)) {
        return rea.status(400).json({ message: "Invaild Service ID" })
    }
    const service = await Service.findById(serviceId)
        .populate({ path: 'categoryId', select: 'name slug image' })
        .populate({ path: 'subcategoriesId', select: 'name slug image' })

    if (!service) {
        return res.status(404).json({ message: "Service not found" });
    }
    return res.status(200).json({ message: service });

});


// DELETE SERVICE BY ID
exports.deleteServiceById = asyncHandler(async(req, res) => {
    const { serviceId } = req.params;
    if (!/^[0-9a-fA-F]{24}$/.test(serviceId)) {
        return rea.status(400).json({ message: "Invaild Service ID" })
    }
    const service = await Service.findById(serviceId)

    if(!service){
        return res.status(404).json({message: "Service not found"});
    }
    await Service.findByIdAndDelete(serviceId);
    return res.status(204).json({message: "Service delete Successfully"});

})