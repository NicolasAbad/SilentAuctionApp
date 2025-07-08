const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

//POST / api / auth/ login (called by frontend after firebase login)
router.post('/signup', authController.signup);
router.post('/login', authController.login);

module.exports = router;