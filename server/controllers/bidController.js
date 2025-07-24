const mongoose = require('mongoose');
const Bid = require('../models/Bid');
const Item = require('../models/Item');


// Place a bid on an item

exports.placeBid = async (req, res) => {
  try {
    const { amount } = req.body;
    const { itemId } = req.params;
    const userId = req.user?.uid;

    console.log('➡️ Placing bid for itemId:', itemId);
    console.log('🔐 Authenticated user:', userId);
    console.log('💰 Bid amount:', amount);

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      console.log('❌ Invalid itemId format');
      return res.status(400).json({ message: 'Invalid item ID' });
    }

    const item = await Item.findById(itemId);
    if (!item) {
      console.log('❌ Item not found in DB');
      return res.status(404).json({ message: 'Item not found' });
    }

    console.log('✅ Item found:', item.title || item.name);

    if (amount <= item.currentBid) {
      console.log('❌ Bid too low. Current bid:', item.currentBid);
      return res.status(400).json({ message: 'Bid must be higher than current bid' });
    }

    const newBid = new Bid({
      item: itemId,
      userId,
      amount
    });

    await newBid.save();

    item.currentBid = amount;
    await item.save();

    console.log('✅ Bid saved successfully:', newBid._id);

    res.status(201).json({
      message: 'Bid placed successfully',
      bid: newBid
    });
  } catch (err) {
    console.error('🔥 Error placing bid:', err);
    res.status(500).json({ message: 'Failed to place bid' });
  }
};


// Get the bid history for a specific item
exports.getBidHistory = async (req, res) => {
  try {
    const { itemId } = req.params;

    const bids = await Bid.find({ item: itemId })
      .sort({ timeStamp: -1 })
      .populate('item'); // optional: if you want item info per bid

    res.status(200).json(bids);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch bid history' });
  }
};
