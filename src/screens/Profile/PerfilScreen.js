//src/screens/Profile/PerfilScreen.js
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';

// Componente PerfilScreen para mostrar y editar el perfil del usuario y de sus perros
const PerfilScreen = ({ navigation }) => {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image
                source={require('../../../assets/img/profileImage.jpg')} // Placeholder para la imagen de perfil
                style={styles.profileImage}
            />
            <Text style={styles.title}>Perfil del Usuario</Text>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Información Personal</Text>

                {/* Detalles del usuario que se podrían editar */}
                <Text style={styles.detailLabel}>Nombre:</Text>
                <Text style={styles.detailText}>Juan Pérez</Text>
                <Text style={styles.detailLabel}>Correo Electrónico:</Text>
                <Text style={styles.detailText}>juan.perez@example.com</Text>
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => navigation.navigate('EditarPerfil')}
                >
                    <Text style={styles.buttonText}>Editar Perfil</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                {/* Sección de la mascota sin imagen */}
                <Text style={styles.sectionTitle}>Mascotas</Text>
                <View style={styles.petDetailsContainer}>
                    <View style={styles.petDetails}>
                        <Text style={styles.detailLabel}>Nombre del Perro:</Text>
                        <Text style={styles.detailText}>Tiranosaurio Rex</Text>
                        <Text style={styles.detailLabel}>Raza:</Text>
                        <Text style={styles.detailText}>Labrador Retriever</Text>
                    </View>
                    {/* <Image source={placeholderImage} style={styles.petImage} /> */}
                </View>
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => navigation.navigate('EditarMascota', { petId: 1 })}
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
