//src/screens/Profile/PerfilScreen.js
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { UserContext } from '../../context/UserContext/UserContext';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../../firebase/firebase';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

const defaultImages = {
    male: require('../../../assets/img/Male_Transparent.png'),
    female: require('../../../assets/img/Female_Transparent.png'),
    other: require('../../../assets/img/Neutral_Transparent.png')
};

const PerfilScreen = ({ navigation, route }) => {
    const { userProfile, dispatch } = useContext(UserContext);
    const [profileImage, setProfileImage] = useState(null);
    const [userData, setUserData] = useState(null);
    const auth = getAuth();

    const loadUserData = async () => {
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
                    setProfileImage(defaultImages[data.gender]);
                }
            }
        }
    };

    useEffect(() => {
        loadUserData();
    }, [route.params?.updated]);

    const handleSignOut = () => {
        signOut(auth).then(() => {
            console.log('Usuario cerró sesión');
        }).catch((error) => {
            console.error('Error al cerrar sesión:', error);
        });
    };

    if (!userData) {
        return <Text>Loading...</Text>;
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
                    onPress={() => navigation.navigate('EditarPerfil')}
                >
                    <Text style={styles.buttonText}>Editar Perfil</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Mascotas</Text>
                <View style={styles.petDetailsContainer}>
                    <View style={styles.petDetails}>
                        <Text style={styles.detailLabel}>Nombre del Perro:</Text>
                        <Text style={styles.detailText}>{userProfile.dog.name}</Text>
                        <Text style={styles.detailLabel}>Raza:</Text>
                        <Text style={styles.detailText}>{userProfile.dog.breed}</Text>
                    </View>
                </View>
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => navigation.navigate('EditarMascota', { petId: userProfile.dog.id })}
                >
                    <Text style={styles.buttonText}>Editar Mascota</Text>
                </TouchableOpacity>
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
  petImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
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
  buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
  },
});

export default PerfilScreen;