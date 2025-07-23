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
