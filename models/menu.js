const mongoose = require("mongoose");
const menuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    category:{
        type: String,
        enum: ['Breakfast', 'Lunch', 'Dinner', 'Drinks','Dessert'],
        required: true
    },
    image:{
        type: String,
        required: true
    },
    cloudinary_id:{
        type: String,
    }
})

module.exports = mongoose.model('Menu', menuSchema)