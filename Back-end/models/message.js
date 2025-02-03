const mongoose = require('mongoose');
const messageSchema = new mongoose.Schema({
    chat:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
        required:[true, 'Chat is required'],
    },

    sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:[true, 'sender is required'],
    },
    message:{
        type:String,
        required:true,
    },
    messageType:{
        type:String,
        enum: ['text', 'image', 'video', 'audio', 'file'],
        default: 'text',
    },
    seen:{
        type:Boolean,
        default:false,
    }
},
{timestamps},
);
const Message = mongoose.model('Message', messageSchema);
module.exports = Message;