//src/screens/Profile/EditarPerfilScreen.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, Alert, TextInput, Image, TouchableOpacity, BackHandler, FlatList, ActivityIndicator, Modal } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore, storage } from '../../firebase/firebase';
import { getDownloadURL, ref, uploadBytes, deleteObject } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import Filter from 'bad-words-es';
import { Ionicons } from '@expo/vector-icons';

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
  const [imageUri, setImageUri] = useState(null); // Guardar el URI de la imagen
  const [isEdited, setIsEdited] = useState(false);
  const [isLoadingImage, setIsLoadingImage] = useState(false); // Estado de carga de imagen
  const [gender, setGender] = useState(null);
  const [age, setAge] = useState(null);
  const [phone, setPhone] = useState('');
  const [ageOpen, setAgeOpen] = useState(false);
  const [genderOpen, setGenderOpen] = useState(false);
  const [ageItems, setAgeItems] = useState([
    { label: '18-25', value: '18-25' },
    { label: '26-35', value: '26-35' },
    { label: '36-45', value: '36-45' },
    { label: '46-55', value: '46-55' },
    { label: '56+', value: '56+' },
  ]);
  const [genderItems, setGenderItems] = useState([
    { label: 'Masculino', value: 'male' },
    { label: 'Femenino', value: 'female' },
    { label: 'Otro', value: 'other' },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [saveCount, setSaveCount] = useState(0);
  const isMounted = useRef(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [hasCustomImage, setHasCustomImage] = useState(false); // Estado para verificar si hay una imagen personalizada

  const auth = getAuth();
  const user = auth.currentUser;

  const filter = new Filter({ languages: ['es'] });
  filter.addWords('pendejo', 'chingada', 'pinche', 'culero', 'mierda', 'perra', 'perro',
                  'cabrón', 'marica', 'joto', 'verga', 'chingar', 'coño', 'pelotudo',
                  'concha', 'gilipollas', 'hijueputa', 'pija', 'trola', 'boludo', 
                  'choto', 'forro', 'mogólico', 'trolo', 'tarado', 'imbécil', 
                  'pelotudo', 'pajero', 'zorra', 'zorro', 'cornudo', 'puto');

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
          setAge(userData.age || null);
          setPhone(userData.phone || '');
          const storageRef = ref(storage, `profile_images/${user.uid}/profile.jpg`);
          try {
            const imageUrl = await getDownloadURL(storageRef);
            if (isMounted.current) {
              setProfileImage({ uri: imageUrl });
              setHasCustomImage(true); // Establecer que hay una imagen personalizada
            }
          } catch (error) {
            console.log('No profile image found, using default based on gender');
            if (isMounted.current) {
              setProfileImage(defaultImages[userData.gender]);
              setHasCustomImage(false); // No hay imagen personalizada
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

  const validatePhone = (phone) => {
    const re = /^[6-7][0-9]{7}$/;
    return re.test(String(phone));
  };

  const deletePreviousImage = async (userUid) => {
    const storageRef = ref(storage, `profile_images/${userUid}/profile.jpg`);
    try {
      await deleteObject(storageRef);
      console.log("Previous image deleted");
    } catch (error) {
      console.log("No previous image found or error deleting:", error);
    }
  };

  const handleSaveChanges = async () => {
    console.log("handleSaveChanges called");

    const trimmedName = nombre.trim();
    const trimmedBio = bio.trim();

    if (!validateName(trimmedName)) {
      Alert.alert('Error', 'Por favor, ingresa un nombre válido.');
      return;
    }

    if (!age) {
      Alert.alert('Error', 'Por favor, selecciona tu edad.');
      return;
    }

    if (!gender) {
      Alert.alert('Error', 'Por favor, selecciona tu género.');
      return;
    }

    if (!validatePhone(phone)) {
      Alert.alert('Error', 'Por favor, ingresa un número de teléfono válido.');
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
        let updatedImageUrl = profileImage ? profileImage.uri : defaultImages[gender].uri;
        if (imageUri) {
          await deletePreviousImage(user.uid); // Borrar la imagen anterior
          updatedImageUrl = await uploadImageToStorage(imageUri, user.uid);
          setHasCustomImage(true); // Establecer que hay una imagen personalizada después de la subida
        }

        console.log("Final URL", updatedImageUrl);

        await updateDoc(doc(firestore, 'users', user.uid), {
          name: trimmedName,
          bio: trimmedBio,
          gender: gender,
          age: age,
          phone: phone,
          profileImage: updatedImageUrl || null
        });

        setProfileImage(updatedImageUrl ? { uri: updatedImageUrl } : defaultImages[gender]); // Actualizar la imagen de perfil en el estado local después de subir la nueva imagen
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

              if (!age) {
                Alert.alert('Error', 'Por favor, selecciona tu edad.');
                return;
              }

              if (!gender) {
                Alert.alert('Error', 'Por favor, selecciona tu género.');
                return;
              }

              if (!validatePhone(phone)) {
                Alert.alert('Error', 'Por favor, ingresa un número de teléfono válido.');
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
  }, [isEdited, navigation, handleSaveChanges, nombre, bio, age, gender, phone]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    
    return () => backHandler.remove();
  }, [handleBackPress]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const { uri } = result.assets[0]; // Extracción correcta de la URI
      console.log("Image picked from gallery:", uri);
      setIsLoadingImage(true); // Iniciar carga de imagen
      setProfileImage({ uri });
      setImageUri(uri); // Guardar el URI de la imagen
      setIsEdited(true);
      setIsLoadingImage(false); // Finalizar carga de imagen
    }
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const { uri } = result.assets[0]; // Extracción correcta de la URI
      console.log("Photo taken:", uri);
      setIsLoadingImage(true); // Iniciar carga de imagen
      setProfileImage({ uri });
      setImageUri(uri); // Guardar el URI de la imagen
      setIsEdited(true);
      setIsLoadingImage(false); // Finalizar carga de imagen
    }
  };

  const uploadImageToStorage = async (uri, userUid) => {
    try {
      setIsLoadingImage(true); // Iniciar carga de imagen
      console.log("Uploading image to storage:", uri);
      const response = await fetch(uri);
      const blob = await response.blob();
      const fileName = 'profile.jpg';
      const storageRef = ref(storage, `profile_images/${userUid}/${fileName}`);
      await uploadBytes(storageRef, blob);
      const downloadUrl = await getDownloadURL(storageRef);
      console.log("Image uploaded. Download URL:", downloadUrl);
      setIsLoadingImage(false); // Finalizar carga de imagen
      return downloadUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      setIsLoadingImage(false); // Finalizar carga de imagen en caso de error
      throw error;
    }
  };

  const handleImageUpload = async () => {
    Alert.alert(
      'Seleccionar imagen',
      'Elige una opción',
      [
        {
          text: 'Galería',
          onPress: pickImage,
        },
        {
          text: 'Cámara',
          onPress: takePhoto,
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  useEffect(() => {
    if (profileImage === null && gender) {
      setProfileImage(defaultImages[gender]);
    }
  }, [gender]);

  const handleDeleteImage = async () => {
    await deletePreviousImage(user.uid);
    setProfileImage(defaultImages[gender]);
    setImageUri(null);
    setHasCustomImage(false); // No hay más imagen personalizada

    await updateDoc(doc(firestore, 'users', user.uid), {
      profileImage: null
    });

    setIsEdited(true);
    setIsModalVisible(false);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={[{key: 'form'}]}
      renderItem={() => (
        <View style={styles.container}>
          <View style={styles.profileContainer}>
            <TouchableOpacity onPress={() => setIsModalVisible(true)}>
              <Image source={profileImage} style={styles.profileImage} />
            </TouchableOpacity>
            {isLoadingImage && (
              <ActivityIndicator size="large" color="#d32f2f" style={styles.loadingIndicator} />
            )}
            <TouchableOpacity style={styles.editIconContainer} onPress={handleImageUpload}>
              <Ionicons name="camera" size={24} color="white" />
            </TouchableOpacity>
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
            <View style={{ zIndex: 6000, width: '100%', marginVertical: 10 }}>
              <DropDownPicker
                open={ageOpen}
                value={age}
                items={ageItems}
                setOpen={setAgeOpen}
                setValue={setAge}
                setItems={setAgeItems}
                placeholder="Selecciona tu edad"
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownContainer}
                onOpen={() => {
                  setGenderOpen(false);
                }}
                onChangeValue={() => { setIsEdited(true); }}
              />
            </View>
            <View style={{ zIndex: 5000, width: '100%', marginVertical: 10 }}>
              <DropDownPicker
                open={genderOpen}
                value={gender}
                items={genderItems}
                setOpen={setGenderOpen}
                setValue={setGender}
                setItems={setGenderItems}
                placeholder="Selecciona tu género"
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownContainer}
                onOpen={() => {
                  setAgeOpen(false);
                }}
                onChangeValue={() => { setIsEdited(true); }}
              />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Número de Teléfono"
              placeholderTextColor="rgba(0, 0, 0, 0.5)"
              value={phone}
              onChangeText={text => { setPhone(text); setIsEdited(true); }}
              keyboardType="phone-pad"
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: '#388E3C' }]}
              onPress={handleSaveChanges}
            >
              <Text style={styles.buttonText}>Guardar Cambios</Text>
            </TouchableOpacity>
            <Text style={styles.saveCount}>Número de veces guardado: {saveCount}</Text>
          </View>

          {/* Modal para ver la imagen en pantalla completa */}
          <Modal
            visible={isModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setIsModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <TouchableOpacity style={styles.closeButton} onPress={() => setIsModalVisible(false)}>
                <Ionicons name="close" size={30} color="white" />
              </TouchableOpacity>
              <Image source={profileImage} style={styles.fullImage} />
              {hasCustomImage && (
                <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteImage}>
                  <Text style={styles.deleteButtonText}>Eliminar Imagen</Text>
                </TouchableOpacity>
              )}
            </View>
          </Modal>
        </View>
      )}
      keyExtractor={item => item.key}
    />
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
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#00000080',
    borderRadius: 50,
    padding: 10,
  },
  loadingIndicator: {
    position: 'absolute',
    alignSelf: 'center',
    top: '45%',
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
  dropdown: {
    backgroundColor: '#fff',
    borderColor: '#c62828',
  },
  dropdownContainer: {
    borderColor: '#c62828',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 30,
    right: 20,
  },
  fullImage: {
    width: '90%',
    height: '70%',
    borderRadius: 10,
    marginBottom: 20,
  },
  deleteButton: {
    backgroundColor: '#d32f2f',
    padding: 10,
    borderRadius: 5,
    position: 'absolute',
    bottom: 30,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditarPerfilScreen;
