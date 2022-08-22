/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: process.env.REACT_APP_FIREBASE_STORAGE_API_KEY,
	authDomain: process.env.REACT_APP_FIREBASE_STORAGE_AUTH_DOMAIN,
	projectId: process.env.REACT_APP_FIREBASE_STORAGE_PROJECT_ID,
	storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.REACT_APP_FIREBASE_STORAGE_MESSAGE_SENDER_ID,
	appId: process.env.REACT_APP_FIREBASE_STORAGE_APP_ID,
	measurementId: process.env.REACT_APP_FIREBASE_STORAGE_MEASUREMENT_ID
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();
const analytics = getAnalytics(app);

export { app, db, storage, analytics};