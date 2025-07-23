const Bid = require('../models/Bid');
const Item = require('../models/Item');

// Place a bid on an item
exports.placeBid = async (req, res) => {
  try {
    const { itemId, amount } = req.body;

    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    if (amount <= item.currentBid) {
      return res.status(400).json({ message: 'Bid must be higher than current bid' });
    }

    const newBid = new Bid({
      item: itemId, // updated key name from itemId → item
      userId: req.user.uid,
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
