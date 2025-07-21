// firebase/config.js

import { initializeApp } from 'firebase/app';
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth, getIdToken, signInWithEmailAndPassword
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyArJWqCxkFVhyxGnlx1wKkYrPyrvSAreMo',
  authDomain: 'silentauctionapp-6aef4.firebaseapp.com',
  projectId: 'silentauctionapp-6aef4',
  storageBucket: 'silentauctionapp-6aef4.appspot.com',
  messagingSenderId: '777415470954',
  appId: '1:777415470954:web:151940056ad2b37921ff13',
  measurementId: 'G-KHFDTZ2C3Z',
};

const app = initializeApp(firebaseConfig);

let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (err) {
  auth = getAuth(app);
}

export { auth,signInWithEmailAndPassword, getIdToken }; // Export auth and other functions as needed
