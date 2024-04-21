import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const handleLogin = () => {
        if (!email || !password) {
            alert('Por favor, completa todos los campos.');
            return;
        }
        if (!email.includes('@')) {
            alert('Por favor, introduce un correo electrónico válido.');
            return;
        }
        // Aquí iría la lógica para conectar con tu backend y verificar las credenciales
        // Simulando una llamada al backend
        fetch('https://tuapi.com/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Lógica para manejar la respuesta exitosa
                console.log('Inicio de sesión exitoso');
            } else {
                throw new Error(data.message || 'Error al iniciar sesión');
            }
        })
        .catch(error => {
            alert(error.message);
        });
    };
    

    

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content"  />
            <Text style={styles.title}>Inicio de sesión</Text>
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
