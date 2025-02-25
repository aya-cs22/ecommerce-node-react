const product = require('../controllers/productControllers');
const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');

const { validationResult } = require('express-validator');
const { productValidator } = require('../utils/validetors/productValidator');


module.exports = router;