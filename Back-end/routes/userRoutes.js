const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const userValidator = require('../utils/validetors/userValidator');
const userControllers = require('../controllers/userControllers');
const { validationResult } = require('express-validator');

//Auth
router.post('/register', userValidator, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next(); 
}, userControllers.register);

router.post('/login', userValidator, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, userControllers.login);

router.post('/verify-email', userValidator, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, userControllers.verifyEmail);

router.post('/forget-password', userValidator, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, userControllers.forgetPassword);

router.post('/reset-password', userValidator, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, userControllers.resetPassword);

router.post('/refresh-token', userValidator, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, userControllers.refreshToken);

router.post('/logout', userValidator, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, userControllers.logout);

//CRUD user
router.post('/add-user', authenticate, userValidator, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, userControllers.addUserByAdmin);

router.get('/get-user-by-himself', authenticate, userValidator, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, userControllers.getUserByhimself);

router.get('/get-user-by-admin/:userId', authenticate, userValidator, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, userControllers.getUserByIdByAdmin);

router.get('/get-all-users-by-admin', authenticate, userValidator, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, userControllers.getAllUserByAdmin);

router.put('/update-user', authenticate, userValidator, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, userControllers.updateUser);

router.put('/update-user/:userId', authenticate, userValidator, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, userControllers.updateRoleUserByAdmin);

router.delete('/delet-user/:userId?', authenticate, userValidator, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, userControllers.deletUser);

module.exports = router;
