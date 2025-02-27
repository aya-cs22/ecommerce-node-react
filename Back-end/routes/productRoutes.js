const productControllers = require('../controllers/productControllers');
const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');

const { validationResult } = require('express-validator');
const { productValidator } = require('../utils/validetors/productValidator');

router.post('/', authenticate, productValidator, (req, res, next) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    next();
}, productControllers.creatProduct);


router.put('/:ProductId', authenticate, productValidator, (req, res, next) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    next();
}, productControllers.updateProduct);

router.get('/:productId', productControllers.getProductById );
router.get('/', productControllers.getAllProductes );
router.delete('/:productId', authenticate, productControllers.deleteProduct );

module.exports = router;