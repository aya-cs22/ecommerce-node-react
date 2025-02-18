const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    userName:{
        type: String,
        required: [true, 'Name is required.'],
       
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        // validate: {
        //     validator: (value) => validator.isEmail(value),
        //     message: 'Please enter a valid email address'
        // }
    },
    
    
    password: {
        type: String,
        required: [true, 'User must have a password'],
        minlength: 8,
        // select: false, // To hide the password when retrieving user data
        // validate: {
        // validator: function (value) {
        // return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value);
        // },
        // message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
        // },
    },

    confirmPassword:{
        type:String,
        // required: [true, 'Please confirme your Password'],
        select: false,
        validate: {
        validator: function(value){
            return value === this.password;
        },
        message: 'Password are not the same.'
        },
    },
    

    isVerified: {
        type: Boolean,
        default: false // user need to virify your email
    },
    phoneNumber:{
        type:String,
        required:[true, 'Phone Number is requred'],
        match:[
            /^\+20\d{10}$/,
            'Please enter valid Egyption phone number starting with +20'
        ]
    },

    emailVerificationCode:{
        type:String,
        default:null,
       
    },

    verificationCodeExpiry: { // Verification code expiration date
        type:Date,
        default:null,
    },

    resetCode:{
        type:String,
        default:null,
        minlength:[6, 'Rest Code must be exactly 6 characters'],
        maxlength:[6, 'Rest Code must be exactly 6 characters '],
    },

    resetCodeExpiry: {
        type: Date,
        default: null
      },

    profilePicture:{
        type:String,
        default:null
    },

    role:{
        type:String,
        enum:['admin', 'sub-admin', 'user'],
        default: function () {
            return this.email === process.env.ADMIN_EMAIL ? 'admin' : 'user';
          }
    },
    refreshToken:{
        type:String,
        default:null
    },
},
{ timestamps: true },
);


//Befor saving the user
userSchema.pre('save', async function (next) {
    if(!this.isModified('password') ) return next();
    // Encrypt the Password Before Saving
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;