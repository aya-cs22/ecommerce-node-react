const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    userName:{
        type: String,
        required: [true, 'Name is required.'],
        minlenght:[3, 'Name cannot be shorter than 3 characters'],
        maxlength:[40, 'Name cannot be longger than 40 characters'],
    },
    email:{
        type: String,
        required: [true, 'Email is required'],
        unique:true,
        lowercase: true,
        match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please enter a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'User must have a password'],
        minlength: 8,
        select: false, // To hide the password when retrieving user data
        validate: {
        validator: function (value) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value);
        },
        message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
        },
    },

    confirmPassword:{
        type:String,
        required: [true, 'Please confirme your Password'],
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
    country:{
        type:String,
        required: [true, 'Country is required'],
        enum:['Egypt']
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
        minlenght:[6,'Email verification code must be exactly 6 characters'],
        maxlenght:[6,'Email verification code must be exactly 6 characters'],
    },

    verificationCodeExpiry: { // Verification code expiration date
        type:Date,
        default:null,
    },

    resetCode:{
        type:String,
        default:null,
        minlenght:[6, 'Rest Code must be exactly 6 characters'],
        maxlenght:[6, 'Rest Code must be exactly 6 characters '],
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
        default: 'user',
    }
},
{ timestamps: true },
);


//Befor saving the user
userSchema.pre('save', async function (next) {
    if(!this.isModified('password')) return next();
    // Encrypt the Password Before Saving
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;