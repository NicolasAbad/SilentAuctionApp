const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
     imageData: {
    data: Buffer,        // binary data for the image
    contentType: String, // MIME type like 'image/jpeg'
    },
    startingBid: {type: Number},
    currentBid: {type: Number},
    ownerId: {type: String,  required: true},
    category: {type: String},
    status: {type: String, default: 'active'},
    createdAt:{type: Date, default: Date.now},
    endTime: {type: Date}
});

module.exports = mongoose.model('Item', itemSchema);