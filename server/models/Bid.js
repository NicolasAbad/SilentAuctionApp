const mongoose = require('mongoose');
const bidSchema = new mongoose.Schema({
    itemId: {type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true}, 
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    amount: {type: Number, required:true},
    timeStamp:{type: Date, default: Date.now}
});


module.exports = mongoose.model('Bid', bidSchema);