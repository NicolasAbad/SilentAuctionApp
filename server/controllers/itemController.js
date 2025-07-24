const Item = require('../models/Item');
const Bid = require('../models/Bid');



exports.createItem = async (req, res) => {
  try {
    const {
      title,
      description,
      imageBase64,   // base64 string from client
      startingBid,
      category,
      endTime,
    } = req.body;

    let imageData = null;
    if (imageBase64) {
      const imgBuffer = Buffer.from(imageBase64, 'base64');
      imageData = {
        data: imgBuffer,
        contentType: 'image/jpeg', // or detect dynamically if possible
      };
    }

    const newItem = new Item({
      title,
      description,
      imageData,          // save binary image here
      startingBid,
      currentBid: startingBid,
      ownerId: req.user.uid,
      category,
      endTime,
      status: 'active',
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create item' });
  }
};


exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.find();

    // Map items to include base64 image string if imageData exists
    const itemsWithImages = items.map(item => {
      let imageBase64 = null;
      if (item.imageData && item.imageData.data) {
        const base64 = item.imageData.data.toString('base64');
        imageBase64 = `data:${item.imageData.contentType};base64,${base64}`;
      }
      return {
        ...item.toObject(),
        imageBase64,  // add new field with base64 string or null
      };
    });

    res.json(itemsWithImages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch items' });
  }
};

exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    let imageBase64 = null;
    if (item.imageData && item.imageData.data) {
      const base64 = item.imageData.data.toString('base64');
      imageBase64 = `data:${item.imageData.contentType};base64,${base64}`;
    }

    res.json({ ...item.toObject(), imageBase64 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch item' });
  }
};


exports.getItemWithBidHistory = async (req, res) => {
  try {
    const itemId = req.params.itemId;

    const item = await Item.findById(itemId).lean();
    if (!item) return res.status(404).json({ message: 'Item not found' });

    const bids = await Bid.find({ item: itemId })
      .sort({ amount: -1 })
      .lean();

    const highestBid = bids.length > 0 ? bids[0] : null;

    res.status(200).json({
      item,
      bids,
      highestBid
    });
  } catch (err) {
    console.error('Error fetching item with bid history:', err);
    res.status(500).json({ message: 'Failed to fetch item with bids' });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const itemId = req.params.id;

    // Optional: Check if user is authorized to delete this item (owner/admin)

    const deletedItem = await Item.findByIdAndDelete(itemId);

    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (err) {
    console.error('Error deleting item:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.closeExpiredItems = async (req, res) => {
  try {
    const now = new Date();
    
    const result = await Item.updateMany(
      { status: 'active', endTime: { $lte: now } },
      { status: 'closed' }
    );

    res.status(200).json({
      message: 'Expired auctions closed',
      modifiedCount: result.modifiedCount
    });
  } catch (err) {
    console.error('Error closing expired auctions:', err);
    res.status(500).json({ message: 'Failed to close expired auctions' });
  }
};