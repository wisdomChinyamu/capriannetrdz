import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCtq1MmKBkOMVHLtwVpJJdUyqvh46vAHUY",
  authDomain: "caprianne-trdz.firebaseapp.com",
  projectId: "caprianne-trdz",
  storageBucket: "caprianne-trdz.firebasestorage.app",
  messagingSenderId: "246325382732",
  appId: "1:246325382732:web:04c49ca794bcf343f96ee9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
