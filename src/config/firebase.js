import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCoTprtBMiIp3uSu-pSH3CxknOREnbN1iQ",
    authDomain: "vara-211fb.firebaseapp.com",
    projectId: "vara-211fb",
    storageBucket: "vara-211fb.firebasestorage.app",
    messagingSenderId: "416569263177",
    appId: "1:416569263177:web:bd10d5b4bf4fc6efaaeb98"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });