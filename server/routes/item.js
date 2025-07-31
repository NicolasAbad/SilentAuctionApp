const express = require('express');
const router = express.Router();

const itemController = require('../controllers/itemController');
const verifyToken = require('../middleware/verifyToken');

// Most specific routes first
router.get('/:itemId/details-with-bids', itemController.getItemWithBidHistory);
router.put('/close-expired', itemController.closeExpiredItems);

// Create an item (protected)
router.post('/', verifyToken, itemController.createItem);

// Get all items (public)
router.get('/', itemController.getAllItems);

// Get specific item by ID (public)
router.get('/:id', itemController.getItemById);

// Delete item by ID (protected)
router.delete('/:id', verifyToken, itemController.deleteItem);

module.exports = router;
