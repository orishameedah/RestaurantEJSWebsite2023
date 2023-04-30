// const mongooseDateFormat = require('mongoose-date-format');
const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    foodname: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    quantity: {
        type: String,
        required: true,
    },
    phone:{
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
    },
    createdTimestamp: {
        type: Date,
        required: true,
        default: Date.now,
    }

})

// orderSchema.plugin(mongooseDateFormat)
module.exports = mongoose.model('Order', orderSchema)