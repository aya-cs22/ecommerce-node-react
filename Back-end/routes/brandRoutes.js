const brandControllers = require('../controllers/brandControllers');
const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const { validationResult } = require('express-validator');
const { brandValidator } = require('../utils/validetors/brandValidator');

router.post('/', brandValidator, authenticate, (req, res, next ) => {
    const errors =  validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    next();
},brandControllers.creatBrand)

router.put('/:brandId', brandValidator, authenticate, (req, res, next ) => {
    const errors =  validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    next();
},brandControllers.updateBrand)

router.get('/:brandId', brandControllers.getBrandById)
router.get('/', brandControllers.getAllBrand)
router.delete('/:brandId',  authenticate, brandControllers.deleteBrand)

module.exports = router;