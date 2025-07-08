const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');

router.get('/dashboard', verifyToken, (req, res)=>{
    res.status(200).json({
        message: `Welcome to your dashboard`,
        user: req.user // firebase decoded token
    });
});

module.exports = router;