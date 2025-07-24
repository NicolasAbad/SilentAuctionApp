const express = require('express');
const router = express.Router();

const itemController  = require('../controllers/itemController');
const verifyToken = require('../middleware/verifyToken');


//let's create an item (protected)


router.post('/', verifyToken, itemController.createItem);


//getting all Items (public)
router.get('/', itemController.getAllItems);

//getting specific item by Id (public)
router.get('/:id', itemController.getItemById);


router.get('/:itemId/details-with-bids', itemController.getItemWithBidHistory);

// Delete item by Id (protected)
router.delete('/:id', verifyToken, itemController.deleteItem);

module.exports = router;