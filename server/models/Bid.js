const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true }, // renamed from itemId
  userId: { type: String, required: true }, // Firebase UID
  amount: { type: Number, required: true },
  timeStamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bid', bidSchema);
