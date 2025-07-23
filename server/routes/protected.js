const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');


router.get('/dashboard', verifyToken, (req, res) => {
  console.log('Dashboard route hit');
  res.status(200).json({
    message: 'Welcome to your dashboard',
    user: req.user,  // Firebase decoded token
    customToken: req.customToken,  // Optional: send the custom token back
  });
});

module.exports = router;


