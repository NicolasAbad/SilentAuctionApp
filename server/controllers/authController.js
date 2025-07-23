const admin = require('../config/firebase');
const User = require('../models/User');


// Signup: create Firebase user and store basic profile in MongoDB


exports.signup = async (req, res) => {
  const { email, password, name } = req.body;

  // Validate required fields
  if (!email || !password || !name) {
    return res.status(400).json({ error: "All fields (email, password, name) are required." });
  }

  try {
    // Create user in Firebase Authentication

    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });


    // Store user in MongoDB

    const newUser = new User({
      firebaseUID: userRecord.uid,
      name,
      email,
    });


    await newUser.save();

    
    res.status(201).json({
      message: "User created successfully!",
      uid: userRecord.uid,
    });
  } catch (error) {
    console.error(error);  // Log the error for debugging

    res.status(400).json({ error: error.message });
  }
};



exports.login = async (req, res) => {
  const { email } = req.body;

  // Validate required field
  if (!email) {
    return res.status(400).json({ error: "Email is required." });

  }

  try {
    const user = await admin.auth().getUserByEmail(email);
    res.status(200).json({
      message: 'User logged in successfully!',
      uid: user.uid,
    });
  
  } catch (error) {
    console.error(error);  // Log the error for debugging
    res.status(400).json({ error: error.message });
  }
};
 