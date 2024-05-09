//src/firebase/GoogleAuth.js
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import * as Google from 'expo-google-app-auth';

// Configuración de la autenticación de Google
const config = {
  iosClientId: `your-ios-client-id-here.apps.googleusercontent.com`,
  androidClientId: `your-android-client-id-here.apps.googleusercontent.com`,
  scopes: ['profile', 'email']
};

export const signInWithGoogleAsync = async () => {
  try {
    const result = await Google.logInAsync(config);

    if (result.type === 'success') {
      // Build Firebase credential with the Google access token.
      const credential = GoogleAuthProvider.credential(null, result.accessToken);

      // Sign in with credential from the Google user.
      return signInWithCredential(auth, credential);
    } else {
      return { cancelled: true };
    }
  } catch (e) {
    return { error: true };
  }
}