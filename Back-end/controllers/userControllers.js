const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const transporter = require('../config/mailConfig');
const { compare } = require('bcrypt');


function  generateTokens(user , regenerateRefreshToken = false){
    const accessToken = jwt.sign({userId: user._id} , process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'});
    let refreshToken = user.refreshToken;
    if(regenerateRefreshToken || !refreshToken){
        refreshToken = jwt.sign({userId: user._id}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '10d'});
        user.refreshToken = refreshToken;
        user.save();
    }
    return{ accessToken, refreshToken};
}

const isAdmin = (req, res, next) =>{
    if(req.user && req.user.role === 'admin'){
        next();
    } else{
        res.status(403).json({message : 'Unauthorized: Admins only'})
    }
}

exports.module = generateTokens;
const EMAIL_VERIFICATION_TIMEOUT = 10 * 60 * 1000 // 10 minutes
const generatCode = () =>{
    return Math.floor(100000 + Math.random() *900000).toString();
};



exports.register =asyncHandler( async(req, res) =>{
    console.log("rejester start..");
    const {userName, email, password, phoneNumber} = req.body;
    console.log(userName, email, password, phoneNumber);
    // check if user exists
    const user = await User.findOne({ email })
    if(user){
        console.log(`user found ${user}`);
        if(user.isVerified){
            return res.status(409).json({message:  'User already exists and is verified'});
        } else{
            user.emailVerificationCode = generatCode();
            user.verificationCodeExpiry = new Date(Date.now() + EMAIL_VERIFICATION_TIMEOUT);
            await user.save();
        
            const mailOptions = {
                from: process.env.ADMIN_EMAIL,
                to: user.email,
                subject: 'Verify Your Email - ShopEase',
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
                        <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
                            <h2 style="color: #333;">Welcome to ShopEase, ${user.userName}!</h2>
                            <p style="font-size: 16px; color: #555;">Thank you for signing up! Please use the verification code below to verify your email address and activate your account:</p>
                            <div style="text-align: center; margin: 20px 0;">
                                <span style="font-size: 22px; font-weight: bold; color: #007bff; padding: 10px 20px; background: #eef4ff; border-radius: 5px;">
                                    ${user.emailVerificationCode}
                                </span>
                            </div>
                            <p style="font-size: 14px; color: #777;">If you did not request this, please ignore this email.</p>
                            <p style="font-size: 14px; color: #777;">Best Regards, <br> The ShopEase Team</p>
                        </div>
                    </div>
                `
            };
        await transporter.sendMail(mailOptions);
        return res.status(200).json({message: 'Verification code resent. Please virify your email'});
        }
    }
    else{
        console.log("user not found")
        const newUser = new User({
            userName,
            email,
            password,
            phoneNumber,
            emailVerificationCode: generatCode(),
            verificationCodeExpiry:  new Date(Date.now() + EMAIL_VERIFICATION_TIMEOUT),
        });
        await newUser.save();
        // Send verification email
        const mailOptions = {
            from: process.env.ADMIN_EMAIL,
            to: newUser.email,
            subject: 'Verify Your Email - ShopEase',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
                    <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
                        <h2 style="color: #333;">Welcome , ${newUser.userName}!</h2>
                        <p style="font-size: 16px; color: #555;">Thank you for signing up! Please use the verification code below to verify your email address and activate your account:</p>
                        <div style="text-align: center; margin: 20px 0;">
                            <span style="font-size: 22px; font-weight: bold; color: #007bff; padding: 10px 20px; background: #eef4ff; border-radius: 5px;">
                                ${newUser.emailVerificationCode}
                            </span>
                        </div>
                        <p style="font-size: 14px; color: #777;">If you did not request this, please ignore this email.</p>
                        <p style="font-size: 14px; color: #777;">Best Regards, <br> The ShopEase Team</p>
                    </div>
                </div>
            `
        };
        await transporter.sendMail(mailOptions);
        return res.status(200).json({message: 'Verification code resent. Please virify your email'});
        

    }
    
});


exports.verifyEmail = asyncHandler(async(req, res) =>{
    console.log("virify start");
    const {email, emailVerificationCode} = req.body;
    console.log(`req.body ${email} ${emailVerificationCode}`)
    if(!email || !emailVerificationCode){
        return res.status(400).json({message: "Please Provide email and emailVerificationCode"})
    }
    const user = await User.findOne({ email });
    console.log(user)
    if(!user){
        return res.status(404).json({message: "user not found"});
    }
    console.log(`first ${emailVerificationCode} and  ${user.emailVerificationCode}`)
    
    if (!user.emailVerificationCode || user.emailVerificationCode !== emailVerificationCode || new Date() > user.verificationCodeExpiry) {
        return res.status(400).json({ message: 'Invalid or expired verification code' });
    }
    user.isVerified = true;
    user.emailVerificationCode = null;
    user.verificationCodeExpiry = null;
    await user.save();

    return res.status(200).json({message: "Email virified successfully "})
});


exports.forgetPassword = asyncHandler(async(req, res) =>{
    const{ email } = req.body;
    const user = await User.findOne({ email });
    if(!user){
        return res.status(404).json({message: "email not found"});
    }
    else{
        user.resetCode = generatCode();
        user.resetCodeExpiry =  new Date(Date.now() + EMAIL_VERIFICATION_TIMEOUT);
        await user.save();

        const mailOptions = {
            from: process.env.ADMIN_EMAIL,
                to: user.email,
                subject: 'Password Reset - ShopEase',
                text: `Password Reset - ShopEase ${user.resetCode}`
        }
        await transporter.sendMail(mailOptions);
    }
    
    return res.status(200).json({message: "Password reset code sent. Please check your email."})
});


exports.resetPassword = asyncHandler(async(req, res) =>{
    const {resetCode, newPassword, email} = req.body;
    if(!resetCode || !newPassword || !email){
        return res.status(400).json({message: "Please Provide resetCode and newPassword"})
    }
    const user = await User.findOne({ email });
    if(!user){
        return res.status(404).json({message: "user not found"});
    }

    if(!user.resetCode || user.resetCode !== resetCode || new Date > user.resetCodeExpiry){
        return res.status(400).json({message: "Invaild or expire rest code."});
    }
    user.password = newPassword;
    user.resetCode = undefined;
    user.resetCodeExpiry = undefined;
    await user.save();
    return res.status(200).json({message: "Password reset successful. You can now log in with your new password."})
});


exports.login = asyncHandler(async(req, res) =>{
    console.log("login start");
    const { email, password} = req.body;
    if(!email && !password){
        return res.status(400).json({message: "Please provide email and password"})
    }
    const user = await User.findOne({ email });
    if(!user){
        return res.status(401).json({message: "Invalid email or password"});
    }
    console.log(password, user.password);
    console.log(user);
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        return res.status(401).json({message: "Invaild Password"});
    }
    if(!user.isVerified){
        return res.status(401).json({message: "Please verify your email first"})
    }
    const { accessToken, refreshToken } = generateTokens(user);
    // console.log(accessToken, refreshToken)
    return res.status(200).json({message: "Login sucessfully", "accessToken": accessToken,  "refreshToken":refreshToken})


})



exports.refreshToken = asyncHandler(async(req, res) =>{
    const {refreshToken} = req.body;
    if(!refreshToken){
        return res.status(401).json({message: "No refresh token provided"});
    }
    const user = await User.findOne({ refreshToken });
    if(!user){
        return res.status(403).json({ message: 'Invaild refresh token'});
    }
    // check token
    try{
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        const {accessToken, refreshToken: newRefreshToken} = generateTokens(user, false);
        return res.status(200).json( {accessToken, refreshToken: newRefreshToken} )
    } catch(error){
        return res.status(403).json({ message: 'Invalid refresh token', error: error.message });
    }
    

})


exports.logout = asyncHandler(async(req, res) =>{
    const { refreshToken } = req.body;
    if(!refreshToken){
        return res.status(400).json({message: 'No Refresh token provided'})
    }

    const user = await User.findOne({refreshToken});
    if(!user){
        return res.status(400).json({message: 'user not found'});
    }
    user.refreshToken = null;
    await user.save();
    return res.status(200).json({message: 'Logout sucessfully'});
})


//addUser 
exports.addUserByAdmin = asyncHandler(async(req, res) =>{
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    const {userName, email, password, phoneNumber, role} = req.body;
    if(!userName || !email || !password || !phoneNumber|| !role){
        return res.status(400).json({message: "Please Provied all faileds."})
    }
    const userExists = await User.findOne({ email });
    if(userExists){
        return res.status(400).json({message : "user already exists"});
    }
    // const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new User({
        userName,
        email,
        password,
        phoneNumber,
        isVerified: true,
        role
    });
    await newUser.save();
    return res.status(200).json({message: "user added sucessfully"})
})
//getUserByhimself 

//getUserByid 

//getAllUsers 

//updateUser

// updateUserRole 

//deleteUser

