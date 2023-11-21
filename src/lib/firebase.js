import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,

//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY_DEV,
//   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN_DEV,
//   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID_DEV,
//   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET_DEV,
//   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID_DEV,
//   appId: import.meta.env.VITE_FIREBASE_APP_ID_DEV,
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
// export default app;
