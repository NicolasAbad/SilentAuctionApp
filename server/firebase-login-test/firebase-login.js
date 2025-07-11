const { initializeApp } = require("firebase/app");
const {
  getAuth,
  signInWithEmailAndPassword,
} = require("firebase/auth");

// ✅ Firebase Config (from Firebase Console)
// ✅ Initialize Firebase with Client SDK Config (from Firebase Console)
const firebaseConfig = {
    apiKey: "AIzaSyArJWqCxkFVhyxGnlx1wKkYrPyrvSAreMo",
    authDomain: "silentauctionapp-6aef4.firebaseapp.com",
    projectId: "silentauctionapp-6aef4",
    // Optional (for database/storage if needed):
    // databaseURL, storageBucket, messagingSenderId, appId, etc.
  };

// ✅ Initialize Firebase App
const app = initializeApp(firebaseConfig);

// ✅ Get Auth Instance
const auth = getAuth(app);

// ✅ Function to Log In & Get Token
async function login() {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      "user@example.com",
      "password123"
    );

    const idToken = await userCredential.user.getIdToken();
    console.log("\n✅ Firebase ID Token:\n\n", idToken);
  } catch (error) {
    console.error("❌ Login Failed:", error.message);
  }
}

login();
