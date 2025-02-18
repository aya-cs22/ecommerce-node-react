const subCategoryControllers = require('../controllers/subCategoryControllers')
const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
router.post('/', authenticate, subCategoryControllers.createsubCategory);
router.get('/:subcategoryId',  subCategoryControllers.getsubCategoryById);
router.get('/',  subCategoryControllers.getAllsubCategories);
// router.put('/:subcategoryId',  authenticate, subCategoryControllers.updatesubCategory);
// router.delete('/:subcategoryId',  authenticate, subCategoryControllers.deletesubCategory);

module.exports = router; 