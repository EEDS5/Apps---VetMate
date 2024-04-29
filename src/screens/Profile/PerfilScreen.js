//src/screens/Profile/PerfilScreen.js
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context/UserContext/UserContext';
import { loadUserProfile } from '../../services/storage/storageService';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';

const PerfilScreen = ({ navigation }) => {
  const { userProfile, dispatch } = useContext(UserContext);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const loadImage = async () => {
      const loadedProfile = await loadUserProfile();
      if (loadedProfile && loadedProfile.image) {
        setProfileImage({ uri: loadedProfile.image });
      }
    };

    loadImage();
  }, [userProfile]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={profileImage || require('../../../assets/img/profileImage.jpg')} 
        style={styles.profileImage}
      />
      <Text style={styles.title}>Perfil del Usuario</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información Personal</Text>
        <Text style={styles.detailLabel}>Nombre:</Text>
        <Text style={styles.detailText}>{userProfile.username}</Text>
        <Text style={styles.detailLabel}>Correo Electrónico:</Text>
        <Text style={styles.detailText}>{userProfile.email}</Text>
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
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 20,
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
