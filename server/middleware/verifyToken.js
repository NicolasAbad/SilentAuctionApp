const jwt = require('jsonwebtoken'); 
const admin = require('../config/firebase'); 
const verifyToken = async (req, res, next) => {
    // req.user = {uid: 'mockUserId', email: 'user@example.com'};
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authorization header missing or invalid' });
        }

        const idToken = authHeader.split(' ')[1]; // Extract the token part of the Bearer token

        // Use Firebase Admin's verifyIdToken method
        const decodedToken = await admin.auth().verifyIdToken(idToken);

        // Attach user info to request object for later use
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error('Error verifying Firebase Id token:', error);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = verifyToken; 
