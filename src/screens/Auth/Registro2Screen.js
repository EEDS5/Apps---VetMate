//src/screens/Auth/Registro2Screen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import * as Location from 'expo-location';

const Registro2Screen = ({ navigation, route }) => {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [department, setDepartment] = useState(null); // Inicializado en null para mostrar el placeholder
    const [city, setCity] = useState(null); // Inicializado en null para mostrar el placeholder
    const [departmentOpen, setDepartmentOpen] = useState(false);
    const [cityOpen, setCityOpen] = useState(false);
    const [departmentItems, setDepartmentItems] = useState([
        { label: 'Santa Cruz', value: 'Santa Cruz' },
        { label: 'La Paz', value: 'La Paz' },
        { label: 'Cochabamba', value: 'Cochabamba' },
        { label: 'Oruro', value: 'Oruro' },
        { label: 'Potosí', value: 'Potosí' },
        { label: 'Chuquisaca', value: 'Chuquisaca' },
        { label: 'Tarija', value: 'Tarija' },
        { label: 'Beni', value: 'Beni' },
        { label: 'Pando', value: 'Pando' },
    ]);
    const [cityItems, setCityItems] = useState([]);

    const cities = {
        'Santa Cruz': ['Santa Cruz de la Sierra', 'Montero', 'Warnes', 'La Guardia', 'Cotoca', 'San Ignacio de Velasco'],
        'La Paz': ['La Paz', 'El Alto', 'Viacha', 'Achacachi', 'Caranavi', 'Desaguadero'],
        'Cochabamba': ['Cochabamba', 'Quillacollo', 'Sacaba', 'Colcapirhua', 'Tiquipaya', 'Punata'],
        'Oruro': ['Oruro', 'Huanuni', 'Challapata', 'Poopó', 'Huari'],
        'Potosí': ['Potosí', 'Uyuni', 'Villazón', 'Tupiza', 'Llallagua'],
        'Chuquisaca': ['Sucre', 'Camargo', 'Monteagudo', 'Villa Serrano'],
        'Tarija': ['Tarija', 'Yacuiba', 'Bermejo', 'Villa Montes'],
        'Beni': ['Trinidad', 'Riberalta', 'Guayaramerín', 'San Borja'],
        'Pando': ['Cobija', 'Porvenir', 'Bolpebra'],
    };

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location.coords);
        })();
    }, []);

    const handleNext = () => {
        const { name, age, gender, phone, email, password } = route.params;
        if (!location) {
            Alert.alert('Error', 'No se pudo obtener la ubicación. Por favor, intenta de nuevo.');
            return;
        }
        if (!department) {
            Alert.alert('Error', 'Por favor, selecciona tu departamento.');
            return;
        }
        if (!city) {
            Alert.alert('Error', 'Por favor, selecciona tu ciudad.');
            return;
        }

        navigation.navigate('Registro3', {
            name,
            age,
            gender,
            phone,
            email,
            password,
            location,
            department,
            city
        });
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <Text style={styles.title}>Ubicación Geográfica</Text>
            <Text style={styles.text}>País: Bolivia</Text>
            <View style={{ zIndex: 5000, width: '90%' }}>
                <DropDownPicker
                    open={departmentOpen}
                    value={department}
                    items={departmentItems}
                    setOpen={setDepartmentOpen}
                    setValue={setDepartment}
                    setItems={setDepartmentItems}
                    placeholder="Selecciona tu departamento"
                    style={styles.dropdown}
                    dropDownContainerStyle={styles.dropdownContainer}
                    onChangeValue={(value) => {
                        setCityItems(cities[value].map((city) => ({ label: city, value: city })));
                        setCity(null); // Restablecemos el valor de la ciudad para mostrar el placeholder
                    }}
                />
            </View>
            <View style={{ zIndex: 4000, width: '90%' }}>
                <DropDownPicker
                    open={cityOpen}
                    value={city}
                    items={cityItems}
                    setOpen={setCityOpen}
                    setValue={setCity}
                    setItems={setCityItems}
                    placeholder="Selecciona tu ciudad"
                    style={styles.dropdown}
                    dropDownContainerStyle={styles.dropdownContainer}
                    disabled={!department}
                />
            </View>
            <TouchableOpacity style={styles.button} onPress={handleNext}>
                <Text style={styles.buttonText}>Siguiente</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
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
    text: {
        fontSize: 18,
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

export default Registro2Screen;


