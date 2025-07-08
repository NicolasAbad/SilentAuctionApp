const Item = require('../models/Item');

exports.createItem = async (req, res)=>{
    try{
        const {title, description, imageUrls, startingBid, category, endTime} = req.body;

        const newItem  = new Item ({
            title, 
            description,
            imageUrls,
            startingBid, 
            currentBid: startingBid,
            ownerId : req.user.uId,  // this will come from verifyToken middleware (that's firebase UID)
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
        const item = await Item.findById(req.param.id);
        if(!item){
            return res.status(404).json({message: "Item not found"});
        }
            res.json(item);
        
    }catch(err){
        console.error(err);
        res.status(500).json({message: 'Failed to fetch item'});
    }
};