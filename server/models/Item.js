const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    imageUrls: [{type: String}],
    startingBid: {type: Number},
    currentBid: {type: Number},
    ownerId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    category: {type: String},
    status: {type: String, default: 'active'},
    createdAt:{type: Date, default: Date.now},
    endTime: {type: Date}
});

module.exports = mongoose.model('Item', itemSchema);