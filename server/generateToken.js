import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, getIdToken } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyArJWqCxkFVhyxGnlx1wKkYrPyrvSAreMo",
  authDomain: "silentauctionapp-6aef4.firebaseapp.com",
  projectId: "silentauctionapp-6aef4",
  storageBucket: "silentauctionapp-6aef4.firebasestorage.app",
  messagingSenderId: "777415470954",
  appId: "1:777415470954:web:151940056ad2b37921ff13",
  measurementId: "G-KHFDTZ2C3Z"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Create an Auth instance
const auth = getAuth(app);

// Test credentials
const testEmail = "user@example.com";
const testPassword = "password123";

async function generateIdToken() {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, testEmail, testPassword);
        const idToken = await getIdToken(userCredential.user, true); // Force refresh

        console.log('Firebase ID token: \n', idToken);
        process.exit(0);

    } catch (err) {
        console.error("Failed to generate ID token: ", err.message);
        process.exit(1);
    }
}

generateIdToken();
