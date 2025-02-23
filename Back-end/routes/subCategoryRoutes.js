const subCategoryControllers = require('../controllers/subCategoryControllers')
const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');

const { validationResult } = require('express-validator');
const { subCategoryValidator } = require('../utils/validetors/subCategoryValidator');

router.post('/', subCategoryValidator, authenticate, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
},  subCategoryControllers.createsubCategory);


router.get('/:subcategoryId',  subCategoryControllers.getsubCategoryById);
router.get('/',  subCategoryControllers.getAllsubCategories);
router.put('/:subcategoryId',  subCategoryValidator, authenticate, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
},  subCategoryControllers.updatesubCategory);

router.delete('/:subcategoryId',  authenticate, subCategoryControllers.deletesubCategory);

module.exports = router; 