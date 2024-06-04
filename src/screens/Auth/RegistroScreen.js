//src/screens/Auth/RegistroScreen.js
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

const RegistroScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [age, setAge] = useState(null);
    const [gender, setGender] = useState(null); // Inicializamos con null para que muestre el placeholder
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [ageOpen, setAgeOpen] = useState(false);
    const [genderOpen, setGenderOpen] = useState(false);
    const [ageItems, setAgeItems] = useState([
        { label: '18-25', value: '18-25' },
        { label: '26-35', value: '26-35' },
        { label: '36-45', value: '36-45' },
        { label: '46-55', value: '46-55' },
        { label: '56+', value: '56+' },
    ]);
    const [genderItems, setGenderItems] = useState([
        { label: 'Masculino', value: 'male' },
        { label: 'Femenino', value: 'female' },
        { label: 'Otro', value: 'other' },
    ]);

    const handleNext = () => {
        if (!name || !age || !gender || !phone || !email || !password || !confirmPassword) {
            Alert.alert('Error', 'Por favor, completa todos los campos.');
            return;
        }
        if (!validateName(name)) {
            Alert.alert('Error', 'Por favor, ingresa un nombre válido.');
            return;
        }
        if (!validateEmail(email)) {
            Alert.alert('Error', 'Por favor, ingresa un correo electrónico válido.');
            return;
        }
        if (!validatePhone(phone)) {
            Alert.alert('Error', 'Por favor, ingresa un número de teléfono válido.');
            return;
        }
        if (!validatePassword(password)) {
            Alert.alert('Error', 'La contraseña debe tener al menos 8 caracteres, incluir al menos un símbolo y un número.');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Las contraseñas no coinciden.');
            return;
        }
        navigation.navigate('Registro2', {
            name,
            age,
            gender,
            phone,
            email,
            password
        });
    };

    const validateName = (name) => {
        const re = /^[a-zA-Z\sáéíóúÁÉÍÓÚñÑüÜ]+$/;
        return re.test(String(name));
    };       

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const validatePhone = (phone) => {
        const re = /^[6-7][0-9]{7}$/;
        return re.test(String(phone));
    };

    const validatePassword = (password) => {
        const re = /^(?=.*[!@#$%^&*])(?=.*[0-9])/; // Al menos un símbolo y un número
        return password.length >= 8 && re.test(password);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <Text style={styles.title}>Registro</Text>
            <TextInput
                style={styles.input}
                placeholder="Nombre Completo"
                placeholderTextColor="#ccc"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
            />
            <View style={{ zIndex: 6000, width: '90%' }}>
                <DropDownPicker
                    open={ageOpen}
                    value={age}
                    items={ageItems}
                    setOpen={setAgeOpen}
                    setValue={setAge}
                    setItems={setAgeItems}
                    placeholder="Selecciona tu edad"
                    style={styles.dropdown}
                    dropDownContainerStyle={styles.dropdownContainer}
                />
            </View>
            <View style={{ zIndex: 5000, width: '90%' }}>
                <DropDownPicker
                    open={genderOpen}
                    value={gender}
                    items={genderItems}
                    setOpen={setGenderOpen}
                    setValue={setGender}
                    setItems={setGenderItems}
                    placeholder="Selecciona tu género"
                    style={styles.dropdown}
                    dropDownContainerStyle={styles.dropdownContainer}
                />
            </View>
            <TextInput
                style={styles.input}
                placeholder="Número de Teléfono"
                placeholderTextColor="#ccc"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                autoCapitalize="none"
            />
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
            <TextInput
                style={styles.input}
                placeholder="Confirmar Contraseña"
                placeholderTextColor="#ccc"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                autoCapitalize="none"
            />
            <TouchableOpacity style={styles.button} onPress={handleNext}>
                <Text style={styles.buttonText}>Siguiente</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
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
    dropdown: {
        width: '100%',
        height: 50,
        marginBottom: 10,
        borderColor: '#c62828',
        borderWidth: 1,
        borderRadius: 5,
    },
    dropdownContainer: {
        borderColor: '#c62828',
        borderWidth: 1,
        borderRadius: 5,
    },
    button: {
        backgroundColor: '#d32f2f',
        padding: 10,
        borderRadius: 5,
        width: '90%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    }
});

export default RegistroScreen;