// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';


const firebaseConfig = {
    apiKey: "AIzaSyArJWqCxkFVhyxGnlx1wKkYrPyrvSAreMo",
    authDomain: "silentauctionapp-6aef4.firebaseapp.com",
    projectId: "silentauctionapp-6aef4",
    storageBucket: "silentauctionapp-6aef4.firebasestorage.app",
    messagingSenderId: "777415470954",
    appId: "1:777415470954:web:151940056ad2b37921ff13",
    measurementId: "G-KHFDTZ2C3Z"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
