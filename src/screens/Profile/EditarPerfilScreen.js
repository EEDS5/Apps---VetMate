// src/screens/Profile/EditarPerfilScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { getAuth, updateEmail, sendEmailVerification, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore, storage } from '../../firebase/firebase';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const defaultImages = {
  male: require('../../../assets/img/Male_Transparent.png'),
  female: require('../../../assets/img/Female_Transparent.png'),
  other: require('../../../assets/img/Neutral_Transparent.png')
};

// Función para subir la imagen al storage
const uploadImageToStorage = async (uri, userUid) => {
  const response = await fetch(uri);
  const blob = await response.blob();
  const storageRef = ref(storage, `profile_images/${userUid}.jpg`);
  await uploadBytes(storageRef, blob);
  return await getDownloadURL(storageRef);
};

const EditarPerfilScreen = ({ navigation }) => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [initialName, setInitialName] = useState('');
  const [initialEmail, setInitialEmail] = useState('');
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imageUri, setImageUri] = useState(null);

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        const userDoc = await getDoc(doc(firestore, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setNombre(userData.name);
          setEmail(userData.email);
          setInitialName(userData.name);
          setInitialEmail(userData.email);
          const storageRef = ref(storage, `profile_images/${user.uid}.jpg`);
          try {
            const imageUrl = await getDownloadURL(storageRef);
            setProfileImage({ uri: imageUrl });
          } catch (error) {
            console.log('No profile image found, using default based on gender');
            setProfileImage(defaultImages[userData.gender]);
          }
        }
      }
    };

    loadUserData();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.uri);
    }
  };

  const handleReauthenticate = async (currentPassword) => {
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
    } catch (error) {
      console.error('Error reautenticando al usuario:', error);
      alert('Error al reautenticar. Por favor, inténtalo de nuevo.');
      throw error;
    }
  };

  const handleSendVerificationEmail = async () => {
    try {
      await sendEmailVerification(user);
      setEmailVerificationSent(true);
      Alert.alert(
        'Verificación de Correo',
        'Se ha enviado un correo de verificación a tu nuevo correo electrónico. Por favor, verifica tu correo y luego actualiza tu correo en la app.'
      );
    } catch (error) {
      console.error('Error al enviar correo de verificación:', error);
      alert('Hubo un error al enviar el correo de verificación. Inténtalo de nuevo.');
    }
  };

  const handleSaveChanges = async () => {
    if (user) {
      try {
        let updatedImageUrl = profileImage.uri;
        if (imageUri) {
          updatedImageUrl = await uploadImageToStorage(imageUri, user.uid);
        }

        if (email !== initialEmail) {
          await handleReauthenticate(password);

          // Actualizar datos en Firestore primero
          await updateDoc(doc(firestore, 'users', user.uid), {
            name: nombre,
            email: email,
            image: updatedImageUrl,
          });

          // Enviar el correo de verificación al nuevo correo
          await handleSendVerificationEmail();
        } else {
          await updateDoc(doc(firestore, 'users', user.uid), {
            name: nombre,
            image: updatedImageUrl,
          });

          navigation.navigate('Perfil', { updated: true });
        }
      } catch (error) {
        if (error.code === 'auth/requires-recent-login') {
          Alert.alert(
            'Reautenticación Requerida',
            'Por favor, vuelve a iniciar sesión para actualizar tu correo.',
            [
              {
                text: 'Cancelar',
                style: 'cancel',
              },
              {
                text: 'Reautenticar',
                onPress: async () => {
                  await handleReauthenticate(password);
                  handleSaveChanges();
                },
              },
            ]
          );
        } else {
          console.error('Error al actualizar los datos:', error);
          alert('Hubo un error al actualizar los datos. Inténtalo de nuevo.');
        }
      }
    }
  };

  const handleUpdateEmailAfterVerification = async () => {
    if (user) {
      try {
        await handleReauthenticate(password);
        await updateEmail(user, email);
        Alert.alert(
          'Correo Actualizado',
          'Tu correo ha sido actualizado correctamente. Por favor, inicia sesión nuevamente.'
        );
        auth.signOut().then(() => {
          navigation.navigate('Login');
        });
      } catch (error) {
        console.error('Error al actualizar el correo después de la verificación:', error);
        alert('Hubo un error al actualizar el correo después de la verificación. Inténtalo de nuevo.');
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileContainer}>
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          <Image
            source={imageUri ? { uri: imageUri } : profileImage}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Editar Perfil</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Datos Actuales:</Text>
        <Text style={styles.currentData}>Nombre: {initialName}</Text>
        <Text style={styles.currentData}>Correo: {initialEmail}</Text>
        <Text style={styles.label}>Nuevo Nombre:</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          placeholderTextColor="rgba(0, 0, 0, 0.5)"
          value={nombre}
          onChangeText={setNombre}
        />
        <Text style={styles.label}>Nuevo Correo Electrónico:</Text>
        <TextInput
          style={styles.input}
          placeholder="Correo Electrónico"
          placeholderTextColor="rgba(0, 0, 0, 0.5)"
          value={email}
          onChangeText={setEmail}
        />
        <Text style={styles.label}>Contraseña Actual:</Text>
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="rgba(0, 0, 0, 0.5)"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveChanges}
        >
          <Text style={styles.buttonText}>Guardar Cambios</Text>
        </TouchableOpacity>
        {emailVerificationSent && (
          <TouchableOpacity
            style={styles.verifyButton}
            onPress={handleUpdateEmailAfterVerification}
          >
            <Text style={styles.buttonText}>Actualizar Correo Después de Verificación</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  profileContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#c62828',
    overflow: 'hidden',
  },
  imagePicker: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  section: {
    width: '100%',
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  currentData: {
    fontSize: 14,
    marginBottom: 10,
    color: 'rgba(0, 0, 0, 0.6)',
  },
  input: {
    fontSize: 16,
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#c62828',
  },
  saveButton: {
    backgroundColor: '#d32f2f',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  verifyButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditarPerfilScreen;