const express = require('express');
const router = express.Router();

const bidController = require('../controllers/bidController');
const verifyToken = require('../middleware/verifyToken');

// placing a bid (protected)

router.post('/:itemId/bid', verifyToken, bidController.placeBid);



//getting the history of the bid
router.get('/:itemId', bidController.getBidHistory);

module.exports = router;