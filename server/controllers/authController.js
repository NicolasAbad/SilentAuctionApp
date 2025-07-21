const admin = require('../config/firebase');
const User = require('../models/User');

// Signup: create Firebase user and store basic profile in MongoDB
exports.signup = async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });

    const newUser = new User({
      firebaseUID: userRecord.uid,
      name,
      email,
    });

    await newUser.save();

    res.status(201).json({
      message: 'User created successfully!',
      uid: userRecord.uid,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

// Login: Only verify user exists; token is issued on frontend
exports.login = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  try {
    const user = await admin.auth().getUserByEmail(email);
    res.status(200).json({
      message: 'User logged in successfully!',
      uid: user.uid,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};
