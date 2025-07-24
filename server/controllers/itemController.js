const Item = require('../models/Item');
const Bid = require('../models/Bid');



exports.createItem = async (req, res)=>{
    try{
        const {title, description, imageUrls, startingBid, category, endTime} = req.body;

        const newItem  = new Item ({
            title, 
            description,
            imageUrls,
            startingBid, 
            currentBid: startingBid,
            ownerId : req.user.uid,  // this will come from verifyToken middleware (that's firebase UID)
            category, 
            endTime
        });

        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    }catch(err){
        console.error(err);
        res.status(500).json({message: 'Failed to create item'});
    }
};

exports.getAllItems = async (req, res) =>{
    try{
        const items = await Item.find();
        res.json(items);

    }catch(err){
        console.error(err);
        res.status(500).json({message: 'Failed to fetch Item'});
    }
}

exports.getItemById = async (req, res) =>{
    try{
        const item = await Item.findById(req.params.id);
        if(!item){
            return res.status(404).json({message: "Item not found"});
        }
            res.json(item);
        
    }catch(err){
        console.error(err);
        res.status(500).json({message: 'Failed to fetch item'});
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