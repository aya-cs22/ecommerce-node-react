const userControllers = require('../controllers/userControllers');
const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
//Auth
router.post('/register', userControllers.register);
router.post('/login', userControllers.login);
router.post('/verify-email', userControllers.verifyEmail);
router.post('/forget-password', userControllers.forgetPassword);
router.post('/reset-password', userControllers.resetPassword);
router.post('/refresh-token', userControllers.refreshToken);
router.post('/logout', userControllers.logout);

//CRUD user
router.post('/add-user', authenticate, userControllers.addUserByAdmin);


module.exports = router; 