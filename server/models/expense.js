const mongoose = require('mongoose');
const dataSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    price: {
        required: true,
        type: Number
    },
    category: {
        required: true,
        type: String
    },
    description: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }

})
module.exports = mongoose.model('Data', dataSchema)