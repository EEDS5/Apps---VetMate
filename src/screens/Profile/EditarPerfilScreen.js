//src/screens/Profile/EditarPerfilScreen.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TextInput, Image, TouchableOpacity, BackHandler } from 'react-native';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore, storage } from '../../firebase/firebase';
import { getDownloadURL, ref } from 'firebase/storage';
import Filter from 'bad-words-es';

const defaultImages = {
  male: require('../../../assets/img/Male_Transparent.png'),
  female: require('../../../assets/img/Female_Transparent.png'),
  other: require('../../../assets/img/Neutral_Transparent.png')
};

const BIO_MAX_LENGTH = 133; // Límite de caracteres para la biografía

const EditarPerfilScreen = ({ navigation }) => {
  console.log("EditarPerfilScreen rendered");
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [isEdited, setIsEdited] = useState(false);
  const [gender, setGender] = useState('other');
  const [isLoading, setIsLoading] = useState(true);
  const [saveCount, setSaveCount] = useState(0);
  const isMounted = useRef(true);

  const auth = getAuth();
  const user = auth.currentUser;

  const filter = new Filter({ languages: ['es'] });
  filter.addWords('pendejo', 'chingada', 'pinche', 'culero', 'mierda', 'perra', 'perro',
                  'cabrón', 'marica', 'joto', 'verga', 'chingar', 'coño', 'pelotudo',
                  'concha', 'gilipollas', 'hijueputa', 'pija', 'trola', 'boludo', 
                  'choto', 'forro', 'mogólico', 'trolo', 'tarado', 'imbécil', 
                  'pelotudo', 'pajero', 'cornudo', 'zorra', 'zorro'); //Agrega palabras a la lista negra

  useEffect(() => {
    const loadUserData = async () => {
      console.log("loadUserData called in EditarPerfilScreen");
      if (user && isMounted.current) {
        const userDoc = await getDoc(doc(firestore, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setNombre(userData.name);
          setEmail(userData.email);
          setBio(userData.bio || '');
          setGender(userData.gender);
          const storageRef = ref(storage, `profile_images/${user.uid}.jpg`);
          try {
            const imageUrl = await getDownloadURL(storageRef);
            if (isMounted.current) {
              setProfileImage({ uri: imageUrl });
            }
          } catch (error) {
            console.log('No profile image found, using default based on gender');
            if (isMounted.current) {
              setProfileImage(defaultImages[userData.gender]);
            }
          }
        }
      }
      setIsLoading(false);
    };

    loadUserData();

    return () => {
      isMounted.current = false;
    };
  }, [user]);

  const validateName = (name) => {
    const re = /^[a-zA-Z\sáéíóúÁÉÍÓÚñÑüÜ]+$/;
    return re.test(String(name));
  };

  const handleSaveChanges = async () => {
    console.log("handleSaveChanges called");

    const trimmedName = nombre.trim();
    const trimmedBio = bio.trim();

    if (!validateName(trimmedName)) {
      Alert.alert('Error', 'Por favor, ingresa un nombre válido.');
      return;
    }

    if (trimmedBio === '') {
      Alert.alert('Error', 'La biografía no puede estar vacía.');
      return;
    }

    if (filter.isProfane(trimmedBio)) {
      Alert.alert('Error', 'La biografía contiene palabras inapropiadas.');
      return;
    }

    if (user) {
      try {
        await updateDoc(doc(firestore, 'users', user.uid), {
          name: trimmedName,
          bio: trimmedBio,
          gender: gender
        });
        setSaveCount(saveCount + 1);
        setIsEdited(false);
        Alert.alert('Éxito', 'Los cambios han sido guardados.');
      } catch (error) {
        console.error('Error al guardar los cambios:', error);
        Alert.alert('Error', 'Hubo un problema al guardar los cambios. Inténtalo de nuevo.');
      }
    }
  };

  const handleBackPress = useCallback(() => {
    console.log("handleBackPress called");

    const trimmedName = nombre.trim();
    const trimmedBio = bio.trim();

    if (isEdited) {
      Alert.alert(
        'Cambios no guardados',
        'Tienes cambios no guardados. ¿Quieres guardar los cambios antes de salir?',
        [
          {
            text: 'Salir igualmente',
            style: 'cancel',
            onPress: () => navigation.goBack(),
          },
          {
            text: 'Guardar y salir',
            onPress: async () => {
              if (!validateName(trimmedName)) {
                Alert.alert('Error', 'Por favor, ingresa un nombre válido.');
                return;
              }

              if (trimmedBio === '' || filter.isProfane(trimmedBio)) {
                Alert.alert(
                  'Error',
                  trimmedBio === '' ? 'La biografía no puede estar vacía.' : 'La biografía contiene palabras inapropiadas.'
                );
                return;
              }
              await handleSaveChanges();
              navigation.goBack();
            },
            style: 'default',
          },
        ],
        { cancelable: false }
      );
      return true; // Prevent default back action
    } else {
      return false; // Default back action
    }
  }, [isEdited, navigation, handleSaveChanges, nombre, bio]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    
    return () => backHandler.remove();
  }, [handleBackPress]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileContainer}>
        <Image source={profileImage} style={styles.profileImage} />
      </View>
      <View style={styles.section}>
        <TextInput
          style={[styles.input, styles.bioInput]}
          placeholder="Escribe tu biografía aquí"
          placeholderTextColor="rgba(0, 0, 0, 0.5)"
          multiline={true}
          numberOfLines={2}
          maxLength={BIO_MAX_LENGTH}
          value={bio}
          onChangeText={text => { setBio(text); setIsEdited(true); }}
        />
        <Text style={styles.charCount}>{bio.length}/{BIO_MAX_LENGTH}</Text>
      </View>
      <Text style={styles.title}>Editar Perfil</Text>
      <View style={styles.section}>
        <Text style={styles.label}>Datos Actuales:</Text>
        <Text style={styles.currentData}>Nombre: {nombre}</Text>
        <Text style={styles.currentData}>Correo: {email}</Text>
        <Text style={styles.label}>Nuevo Nombre:</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          placeholderTextColor="rgba(0, 0, 0, 0.5)"
          value={nombre}
          onChangeText={text => { setNombre(text); setIsEdited(true); }}
        />
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: '#388E3C' }]}
          onPress={handleSaveChanges}
        >
          <Text style={styles.buttonText}>Guardar Cambios</Text>
        </TouchableOpacity>
        <Text style={styles.saveCount}>Número de veces guardado: {saveCount}</Text>
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
  bioInput: {
    minHeight: 100,
    textAlignVertical: 'top',
    textAlign: 'center',
  },
  charCount: {
    textAlign: 'right',
    color: 'rgba(0, 0, 0, 0.6)',
  },
  saveButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveCount: {
    marginTop: 10,
    color: 'rgba(0, 0, 0, 0.6)',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EditarPerfilScreen;

