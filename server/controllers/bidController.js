const Bid = require('../models/Bid');
const Item = require('../models/Item');

exports.placeBid = async (req, res) => {
  try {
    const { itemId, amount } = req.body;
    const item = await Item.findById(itemId);

    if (!item) return res.status(404).json({ message: 'Item not found' });

    if (amount <= item.currentBid) {
      return res.status(400).json({ message: 'Bid must be higher than current bid' });
    }

    const newBid = new Bid({
      itemId,
      userId: req.user.uid, // Firebase UID
      amount
    });

    await newBid.save();

    item.currentBid = amount;
    await item.save();

    res.status(201).json({ message: 'Bid placed successfully', bid: newBid });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to place bid' });
  }
};

exports.getBidHistory = async (req, res) => {
  try {
    const bids = await Bid.find({ itemId: req.params.itemId }).sort({ timestamp: -1 });
    res.json(bids);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch bid history' });
  }
};
