const { check, body } = require('express-validator');
const User = require('../../models/user'); 
const userValidator = [
    // Validate userName
    check('userName')
    .notEmpty().withMessage('Name is required.')
    .trim().withMessage('Name cannot have leading or trailing spaces.')
    .isLength({ min: 3, max: 30 }).withMessage('Name must be between 3 and 30 characters.')
    .matches(/^[A-Za-z0-9 ]+$/).withMessage('Name must contain only letters, numbers, and spaces.')
    .custom((value) => {
        if (value.trim().length !== value.length) {
            throw new Error('Name cannot have leading or trailing spaces.');
        }
        return true;
    }),

    // Validate email
    check('email')
        .notEmpty().withMessage('Email is required.')
        .isEmail().withMessage('Please enter a valid email address.')
        .custom(async (value) => {
            const existingUser = await User.findOne({ email: value });
            if (existingUser) {
                throw new Error('Email is already in use.');
            }
            return true;
        }),

    // Validate password
    check('password')
        .notEmpty().withMessage('Password is required.')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.')
        .isLength({ max: 20 }).withMessage('Password cannot be longer than 20 characters.')

        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.'),

    // Validate confirmPassword
    check('confirmPassword')
        .notEmpty().withMessage('Please confirm your password.')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords must match.');
            }
            return true;
        }),

    // Validate phoneNumber
    check('phoneNumber')
        .notEmpty().withMessage('Phone number is required.')
        .matches(/^\+20\d{10}$/).withMessage('Please enter a valid Egyptian phone number starting with +20.'),

    // Validate emailVerificationCode
    check('emailVerificationCode')
        .optional()
        .isLength({ min: 6, max: 6 }).withMessage('Email verification code must be exactly 6 characters.'),

    // Validate resetCode
    check('resetCode')
        .optional()
        .isLength({ min: 6, max: 6 }).withMessage('Reset code must be exactly 6 characters.'),
];

module.exports = userValidator;
