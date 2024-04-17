import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const handleLogin = () => {
        // Lógica para iniciar sesión
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
