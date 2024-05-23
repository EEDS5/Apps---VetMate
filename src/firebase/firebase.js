//src/firebase/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebaseConfig } from './firebaseConfig';

// Inicializar la app de Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
const firestore = getFirestore(app);

// Inicializar la autenticación con persistencia
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { firestore, auth };
