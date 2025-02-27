const serviceControllers = require('../controllers/serviceControllers');
const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');

const { validationResult } = require('express-validator');
const { serviceValidator } = require('../utils/validetors/serviceValidator');

router.post('/', authenticate, serviceValidator, (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    next();
}, serviceControllers.createService)


router.put('/:serviceId', authenticate, serviceValidator, (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    next();
}, serviceControllers.updateService)

router.get('/', serviceControllers.getAllService);
router.get('/:serviceId', serviceControllers.getServiceById);
router.delete('/:serviceId', authenticate, serviceControllers.deleteServiceById);

module.exports = router;