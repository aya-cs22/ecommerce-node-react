const categoryControllers = require('../controllers/categoryControllers')
const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
router.post('/', authenticate, categoryControllers.createCategory);
router.get('/:categoryId',  categoryControllers.getCategoryById);
router.get('/',  categoryControllers.getAllCategories);
router.put('/:categoryId',  authenticate, categoryControllers.updateCategory);
router.delete('/:categoryId',  authenticate, categoryControllers.deleteCategory);

module.exports = router; 