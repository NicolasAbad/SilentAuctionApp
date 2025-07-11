const admin = require('firebase-admin');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Decode base64 service account JSON string from .env
const serviceAccount = JSON.parse(
  Buffer.from(process.env.serviceAccount, 'base64').toString('utf8')
);

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Export the initialized admin instance
module.exports = admin;
