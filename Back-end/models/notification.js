const mongoose = require('mongoose');
const notificationSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:[true, 'User is required'],
    },

    message:{
        type:String,
        required:true,
    },
    isRead:{
        type:Boolean,
        default:false,
    },
    type: {
        type: String,
        enum: ['order', 'chat', 'promotion', 'system', 'other'],
        required: true,
      },
},
{timestamps: true},
);
const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;