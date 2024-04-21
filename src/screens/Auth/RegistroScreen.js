import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';

const RegistroScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = () => {
        if (!name || !email || !password) {
            alert('Por favor, completa todos los campos.');
            return;
        }
        if (!email.includes('@')) {
            alert('Por favor, introduce un correo electrónico válido.');
            return;
        }
        // Asegúrate de que la contraseña tenga una longitud mínima, por ejemplo, 6 caracteres
        if (password.length < 6) {
            alert('La contraseña debe tener al menos 6 caracteres.');
            return;
        }
        // Simulando una llamada al backend
        fetch('https://tuapi.com/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Lógica para manejar la respuesta exitosa
                console.log('Registro exitoso');
            } else {
                throw new Error(data.message || 'Error al registrarse');
            }
        })
        .catch(error => {
            alert(error.message);
        });
    };
    ;

    

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Registro</Text>
            <TextInput
                style={styles.input}
                placeholder="Nombre completo"
                placeholderTextColor="#ccc"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                placeholderTextColor="#ccc"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                placeholderTextColor="#ccc"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <Button
                title="Registrarse"
                onPress={handleSignUp}
                color="#d32f2f"
            />
            <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.loginButton}>
                <Text style={styles.loginText}>¿Ya tienes cuenta? Inicia sesión</Text>
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
        fontWeight: 'bold',
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
    loginButton: {
        marginTop: 10,
        paddingVertical: 10,
    },
    loginText: {
        color: '#c62828',
        textDecorationLine: 'underline',
    }
});

export default RegistroScreen;
