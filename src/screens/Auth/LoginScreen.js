//src/screens/Auth/LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, StatusBar, TouchableOpacity, Alert } from 'react-native';
import { auth } from '../../firebase/firebase';  
import { signInWithEmailAndPassword } from 'firebase/auth';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        if (!email || !password) {
            Alert.alert('Por favor, completa todos los campos.');
            return;
        }
        if (!email.includes('@')) {
            Alert.alert('Por favor, introduce un correo electrónico válido.');
            return;
        }

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Si el inicio de sesión es exitoso, puedes redirigir al usuario a la pantalla de inicio
                console.log('Usuario autenticado:', userCredential.user);
                navigation.navigate('Home'); // Cambia 'Home' por la pantalla a la que desees dirigir tras el inicio de sesión
            })
            .catch((error) => {
                // Si hay un error durante el inicio de sesión, muestra un mensaje de error
                console.error('Error en el inicio de sesión:', error.code, error.message);
                Alert.alert('Error', 'Error en el inicio de sesión. Por favor, verifica tus credenciales.');
            });
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <Text style={styles.title}>Inicio de sesión</Text>
            <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                placeholderTextColor="#ccc"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                placeholderTextColor="#ccc"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
            />
            <Button
                title="Iniciar sesión"
                onPress={handleLogin}
                color="#d32f2f"
            />
            <TouchableOpacity onPress={() => navigation.navigate('Registro')} style={styles.signUpButton}>
                <Text style={styles.signUpText}>¿No estás registrado? Regístrate</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        color: '#c62828',
    },
    input: {
        width: '90%',
        height: 50,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#c62828',
        marginBottom: 10,
    },
    signUpButton: {
        marginTop: 10,
        paddingVertical: 10,
    },
    signUpText: {
        color: '#c62828',
        textDecorationLine: 'underline',
    }
});

export default LoginScreen;

