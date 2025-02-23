const categoryControllers = require('../controllers/categoryControllers')
const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const { validationResult } = require('express-validator');
const { categoryValidator } = require('../utils/validetors/categoryValidator')

router.post('/', categoryValidator, authenticate, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, categoryControllers.createCategory);

router.get('/:categoryId', categoryControllers.getCategoryById);
router.get('/', categoryControllers.getAllCategories);

router.put('/:categoryId', categoryValidator, authenticate, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, categoryControllers.updateCategory);

router.delete('/:categoryId', authenticate, categoryControllers.deleteCategory);

module.exports = router;


