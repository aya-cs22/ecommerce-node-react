const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const userControllers = require('../controllers/userControllers');
const {registerValidator, loginValidator, forgetPasswordValidator, resetPasswordValidator, verifyEmailValidator, updateUserValidator } = require('../utils/validetors/userValidator');
const { validationResult } = require('express-validator');

//Auth
router.post('/register', registerValidator, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next(); 
}, userControllers.register);

router.post('/login', loginValidator, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, userControllers.login);

router.post('/verify-email', verifyEmailValidator, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, userControllers.verifyEmail);

router.post('/forget-password', forgetPasswordValidator, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, userControllers.forgetPassword);

router.post('/reset-password', resetPasswordValidator, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, userControllers.resetPassword);

router.post('/refresh-token', userControllers.refreshToken);

router.post('/logout', userControllers.logout);

//CRUD user
router.post('/add-user', registerValidator, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next(); 
}, userControllers.addUserByAdmin);

router.get('/get-user-by-himself', authenticate, userControllers.getUserByhimself);

router.get('/get-user-by-admin/:userId', authenticate, userControllers.getUserByIdByAdmin);

router.get('/get-all-users-by-admin', authenticate,  userControllers.getAllUserByAdmin);

router.put('/update-user',updateUserValidator,  authenticate,  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next(); 
}, userControllers.updateUser);


router.put('/update-user/:userId', authenticate,  userControllers.updateRoleUserByAdmin);

router.delete('/delet-user/:userId?', authenticate,  userControllers.deletUser);

module.exports = router;
