//src/screens/Profile/EditarPerfilScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';

const EditarPerfilScreen = ({ navigation }) => {
    const [nombre, setNombre] = useState('Juan Pérez');
    const [email, setEmail] = useState('juan.perez@example.com');

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image
                source={require('../../../assets/img/profileImage.jpg')}
                style={styles.profileImage}
            />
            <Text style={styles.title}>Editar Perfil</Text>

            <View style={styles.section}>
                <Text style={styles.label}>Nombre:</Text>
                <TextInput
                    style={styles.input}
                    value={nombre}
                    onChangeText={setNombre}
                />
                <Text style={styles.label}>Correo Electrónico:</Text>
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                />
                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.buttonText}>Guardar Cambios</Text>
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
    input: {
        fontSize: 16,
        backgroundColor: '#fff',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    saveButton: {
        backgroundColor: '#d32f2f',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default EditarPerfilScreen;