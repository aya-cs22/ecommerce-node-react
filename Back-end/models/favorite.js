const mongoose = require('mongoose');
const favoriteSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: [true, 'user is required'],
    },

    product:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:['Product'],
    }]
},
{timestamps: true},
);
const Favourite = mongoose.model('Favourite', favoriteSchema );
module.exports = Favourite;