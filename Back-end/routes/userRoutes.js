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
router.get('/get-user-by-himself', authenticate, userControllers.getUserByhimself);
router.get('/get-user-by-admin/:userId', authenticate, userControllers.getUserByIdByAdmin);
router.get('/get-all-users-by-admin', authenticate, userControllers.getAllUserByAdmin);
router.put('/update-user', authenticate, userControllers.updateUser);
router.put('/update-user/:userId', authenticate, userControllers.updateRoleUserByAdmin);
router.delete('/delet-user/:userId?', authenticate, userControllers.deletUser);



module.exports = router; 