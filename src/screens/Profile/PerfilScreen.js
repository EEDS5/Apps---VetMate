import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { UserContext } from '../../context/UserContext/UserContext';
import { loadUserProfile } from '../../services/storage/storageService';

const PerfilScreen = ({ navigation }) => {
  const { userProfile, dispatch } = useContext(UserContext);
  const [profileImage, setProfileImage] = useState(null);

  const auth = getAuth();

  useEffect(() => {
    const loadImage = async () => {
      const loadedProfile = await loadUserProfile();
      if (loadedProfile && loadedProfile.image) {
        setProfileImage({ uri: loadedProfile.image });
      }
    };

    loadImage();
  }, [userProfile]);

  const handleSignOut = () => {
    signOut(auth).then(() => {
      console.log('Usuario cerró sesión');
    }).catch((error) => {
      console.error('Error al cerrar sesión:', error);
    });
  };

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
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditarMascota', { petId: userProfile.dog.id })}
        >
          <Text style={styles.buttonText}>Crear Mascota</Text>
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
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 20,
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
