const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const userValidator = require('../utils/validetors/userValidator');
const userControllers = require('../controllers/userControllers')
//Auth
router.post('/register',userValidator, userControllers.register);
router.post('/login',userValidator, userControllers.login);
router.post('/verify-email',userValidator, userControllers.verifyEmail);
router.post('/forget-password',userValidator, userControllers.forgetPassword);
router.post('/reset-password',userValidator, userControllers.resetPassword);
router.post('/refresh-token',userValidator, userControllers.refreshToken);
router.post('/logout',userValidator, userControllers.logout);

//CRUD user
router.post('/add-user', authenticate,userValidator, userControllers.addUserByAdmin);
router.get('/get-user-by-himself', authenticate,userValidator, userControllers.getUserByhimself);
router.get('/get-user-by-admin/:userId', authenticate,userValidator, userControllers.getUserByIdByAdmin);
router.get('/get-all-users-by-admin', authenticate,userValidator, userControllers.getAllUserByAdmin);
router.put('/update-user', authenticate,userValidator, userControllers.updateUser);
router.put('/update-user/:userId', authenticate,userValidator, userControllers.updateRoleUserByAdmin);
router.delete('/delet-user/:userId?', authenticate,userValidator, userControllers.deletUser);



module.exports = router; 