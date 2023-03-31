import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
	apiKey: process.env.REACT_APP_FIREBASE_KEY,
	authDomain: 'froggychat-ca0a8.firebaseapp.com',
	projectId: 'froggychat-ca0a8',
	storageBucket: 'froggychat-ca0a8.appspot.com',
	messagingSenderId: '369656516992',
	appId: '1:369656516992:web:9f76cefccf3b3941edf165',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app)