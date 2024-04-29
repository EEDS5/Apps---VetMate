//src/context/UserContext/UserContext.js
import AsyncStorage from '@react-native-async-storage/async-storage';

// Guarda el perfil del usuario en el almacenamiento local del dispositivo.
const saveUserProfile = async (userProfile) => {
  try {
    const jsonValue = JSON.stringify(userProfile);
    await AsyncStorage.setItem('@UserProfile', jsonValue);
    // Se podría añadir una lógica adicional para manejar confirmaciones o errores en la UI.
  } catch (e) {
    // Se maneja el caso de error al guardar el perfil del usuario.
    console.log('Error al guardar el perfil del usuario:', e);
  }
};

// Carga el perfil del usuario desde el almacenamiento local del dispositivo.
const loadUserProfile = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@UserProfile');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
    // Se podría añadir una lógica adicional para manejar la carga del estado inicial.
  } catch(e) {
    // Se maneja el caso de error al cargar el perfil del usuario.
    console.log('Error al cargar el perfil del usuario:', e);
    return null; // Devuelve null para manejar un estado inicial cuando hay un error.
  }
};

export { saveUserProfile, loadUserProfile };
