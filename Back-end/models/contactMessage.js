const mongoose = require('mongoose');
const contactMessage = new mongoose.Schema({
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

    message:{
        type:String,
        required: [true, 'message is requied'],
        minlenght:[3, 'message cannot be shorter than 3 characters'],
        maxlength:[500, 'message cannot be longger than 500 characters'],
    },
    adminReply:{
        type:String,
        deafult:'',
    },
    isReplied:{
        type:Boolean,
        deafult: false,
    },
},
{timestamps: true},
);
const Contact = mongoose.Model('Contact', contactMessage);
module.exports = Contact