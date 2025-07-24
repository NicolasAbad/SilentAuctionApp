const admin = require('../config/firebase');
const jwt = require('jsonwebtoken'); // JWT library

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header missing or invalid' });
  }

  const idToken = authHeader.split(' ')[1];


  try {
    // Step 1: Verify Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // Step 2: Optionally generate a custom JWT for backend use
    const customToken = generateCustomAuthToken(decodedToken);  // Create custom token

    // Attach the custom token to the response, or as needed
    req.user = decodedToken;  // Add Firebase decoded token to req.user
    req.customToken = customToken; // Attach custom token to the request for further use

    next();
  } catch (error) {
    console.error('Error verifying Firebase Id token:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Function to generate a custom JWT
const generateCustomAuthToken = (decodedToken) => {
  const payload = {
    uid: decodedToken.uid,
    email: decodedToken.email,
    role: decodedToken.role || 'user',  // Add custom claims if needed
  };

  const secretKey = process.env.JWT_SECRET;  // Make sure you store this securely

  // Generate the custom JWT token with an expiration time of 1 hour
  const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

  return token;
};

module.exports = verifyToken;

// const jwt = require('jsonwebtoken'); 
// const admin = require('../config/firebase'); 
// const verifyToken = async (req, res, next) => {
//     // req.user = {uid: 'mockUserId', email: 'user@example.com'};
//     try {
//         const authHeader = req.headers.authorization;

//         if (!authHeader || !authHeader.startsWith('Bearer ')) {
//             return res.status(401).json({ message: 'Authorization header missing or invalid' });
//         }

//         const idToken = authHeader.split(' ')[1]; // Extract the token part of the Bearer token

//         // Use Firebase Admin's verifyIdToken method
//         const decodedToken = await admin.auth().verifyIdToken(idToken);

//         // Attach user info to request object for later use
//         req.user = decodedToken;
//         next();
//     } catch (error) {
//         console.error('Error verifying Firebase Id token:', error);
//         return res.status(401).json({ message: 'Invalid or expired token' });
//     }
// };

// module.exports = verifyToken; 
// >>>>>>> 0e11800beca7924963bf9ffa24ede9d631f991cb
