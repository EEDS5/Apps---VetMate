import React, { useContext, useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { UserContext } from '../../context/UserContext/UserContext';
import { collection, query, where, getDocs, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { firestore } from '../../firebase/firebase';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { useFocusEffect } from '@react-navigation/native';

const defaultImages = {
  male: require('../../../assets/img/Male_Transparent.png'),
  female: require('../../../assets/img/Female_Transparent.png'),
  other: require('../../../assets/img/Neutral_Transparent.png')
};

const PerfilScreen = ({ navigation, route }) => {
  console.log("PerfilScreen rendered");
  const { userProfile, dispatch } = useContext(UserContext);
  const [profileImage, setProfileImage] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userDogs, setUserDogs] = useState([]);
  const auth = getAuth();

  const loadUserData = useCallback(async () => {
    console.log("loadUserData called");
    const user = auth.currentUser;
    if (user) {
      const userDoc = await getDoc(doc(firestore, 'users', user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData(data);

        const storage = getStorage();
        const profileImageRef = ref(storage, `profile_images/${user.uid}/profile.jpg`);
        try {
          const imageUrl = await getDownloadURL(profileImageRef);
          setProfileImage({ uri: imageUrl });
        } catch (error) {
          console.log('No profile image found, using default based on gender');
          setProfileImage(defaultImages[data.gender] || defaultImages.other);
        }

        const q = query(collection(firestore, 'Dogs'), where('ownerId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const dogs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUserDogs(dogs);
      }
    }
  }, [auth]);

  useFocusEffect(
    useCallback(() => {
      console.log("useFocusEffect triggered");
      loadUserData();
    }, [loadUserData])
  );

  const handleDeletePet = useCallback((petId) => {
    console.log("handleDeletePet called", petId);
    Alert.alert(
      "Confirmar Eliminación",
      "¿Estás seguro de que deseas eliminar esta mascota?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              await deleteDoc(doc(firestore, 'Dogs', petId));
              alert("Mascota eliminada con éxito.");
              loadUserData();
            } catch (error) {
              alert("Error al eliminar la mascota:", error.message);
            }
          }
        }
      ]
    );
  }, [loadUserData]);

  const handleSignOut = () => {
    console.log("handleSignOut called");
    signOut(auth).then(() => {
      console.log('Usuario cerró sesión');
      navigation.navigate('Login');
    }).catch((error) => {
      console.error('Error al cerrar sesión:', error);
    });
  };

  if (!userData) {
    console.log("No user data");
    return <View style={styles.loadingContainer}><Text>Loading...</Text></View>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={profileImage}
        style={styles.profileImage}
      />
      <Text style={styles.title}>Perfil del Usuario</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información Personal</Text>
        <Text style={styles.detailLabel}>Nombre:</Text>
        <Text style={styles.detailText}>{userData.name}</Text>
        <Text style={styles.detailLabel}>Correo Electrónico:</Text>
        <Text style={styles.detailText}>{userData.email}</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {
            console.log("Navigating to EditarPerfil");
            navigation.navigate('EditarPerfil');
          }}
        >
          <Text style={styles.buttonText}>Editar Perfil</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mascotas</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {
            console.log("Navigating to CrearMascota");
            navigation.navigate('CrearMascota');
          }}
        >
          <Text style={styles.buttonText}>Crear Mascota</Text>
        </TouchableOpacity>

        {userDogs.map(dog => (
          <View key={dog.id} style={styles.dogContainer}>
            <Image source={{ uri: dog.imageUrl }} style={styles.petImage} />
            <Text style={styles.detailLabel}>Nombre:</Text>
            <Text style={styles.detailText}>{dog.name}</Text>
            <Text style={styles.detailLabel}>Raza:</Text>
            <Text style={styles.detailText}>{dog.breed}</Text>
            <Text style={styles.detailLabel}>Edad:</Text>
            <Text style={styles.detailText}>{dog.ageYears} años {dog.ageMonths} meses</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => {
                  console.log("Navigating to EditarMascota", dog.id);
                  navigation.navigate('EditarMascota', { petId: dog.id });
                }}
              >
                <Text style={styles.buttonText}>Editar Mascota</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeletePet(dog.id)}
              >
                <Text style={styles.buttonText}>Eliminar Mascota</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <TouchableOpacity
          style={[styles.button, styles.shadow]}
          onPress={handleSignOut}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#d32f2f',
        paddingVertical: 12,
        paddingHorizontal: 36,
        borderRadius: 25,
        marginVertical: 8,
        minWidth: 250,
        alignItems: 'center',
    },
    profileImage: {
        width: 200,
        height: 200,
        borderRadius: 100,
        marginBottom: 20,
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
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    detailLabel: {
        fontSize: 16,
        color: '#333',
    },
    detailText: {
        fontSize: 16,
        marginBottom: 5,
        color: '#666',
    },
    editButton: {
        backgroundColor: '#d32f2f',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    deleteButton: {
        backgroundColor: '#d32f2f',
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
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 10,
    },
    dogContainer: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 10,
        alignItems: 'center'
    },
    petImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    shadow: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    }
});

export default PerfilScreen;
