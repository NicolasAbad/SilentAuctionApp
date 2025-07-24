const express = require('express');
const router = express.Router();

const bidController = require('../controllers/bidController');
const verifyToken = require('../middleware/verifyToken');

// placing a bid (protected)

router.post('/:itemId/bid', verifyToken, bidController.placeBid);

// Get all bids placed by the authenticated user (protected)
router.get('/mybids', verifyToken, bidController.getMyBids);

//getting the history of the bid
router.get('/:itemId', bidController.getBidHistory);

module.exports = router;