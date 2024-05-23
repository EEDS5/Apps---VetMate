import React, { useState, useEffect } from 'react';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { firestore, storage } from '../../firebase/firebase'; 
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const CrearMascotaScreen = ({ navigation }) => {
    const [hasPermission, setHasPermission] = useState(null);
    const [nombreMascota, setNombreMascota] = useState('');
    const [raza, setRaza] = useState('');
    const [sexo, setSexo] = useState('macho');
    const [edad, setEdad] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        (async () => {
            const cameraStatus = await Camera.requestCameraPermissionsAsync();
            const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (cameraStatus.status !== 'granted' || galleryStatus.status !== 'granted') {
                console.log('Permiso de cámara o galería no concedido');
            }

            setHasPermission(cameraStatus.status === 'granted' && galleryStatus.status === 'granted');
        })();
    }, []);

    const handleImageUpload = async (uri) => {
        console.log("Iniciando la subida de la imagen:", uri);
        try {
            const response = await fetch(uri);
            console.log("Respuesta de fetch:", response);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const blob = await response.blob();
            const storageRef = ref(storage, `images/${Date.now()}_${uri.split('/').pop()}`);
            await uploadBytes(storageRef, blob);
            const url = await getDownloadURL(storageRef);
            console.log("Imagen subida con éxito, URL:", url);
            setImageUrl(url);
        } catch (error) {
            console.log("Error al subir la imagen:", error);
        }
    };

    const takePicture = async () => {
        try {
            let result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const uri = result.assets[0].uri;
                console.log("Imagen tomada:", uri);
                await handleImageUpload(uri);
            } else {
                console.log("La toma de la imagen fue cancelada");
            }
        } catch (error) {
            console.log("Error al tomar la foto:", error);
        }
    };

    const pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const uri = result.assets[0].uri;
                console.log("Imagen seleccionada:", uri);
                await handleImageUpload(uri);
            } else {
                console.log("La selección de la imagen fue cancelada");
            }
        } catch (error) {
            console.log("Error al seleccionar la imagen:", error);
        }
    };

    const savePetProfile = async () => {
        if (!nombreMascota) {
            console.log("Error: El nombre de la mascota está vacío.");
            return;
        }
        if (!raza) {
            console.log("Error: La raza de la mascota está vacía.");
            return;
        }
        if (!sexo) {
            console.log("Error: El sexo de la mascota está vacío.");
            return;
        }
        if (!edad) {
            console.log("Error: La edad de la mascota está vacía.");
            return;
        }
        if (!imageUrl) {
            console.log("Error: No se ha seleccionado una imagen para la mascota.");
            return;
        }

        try {
            const petData = {
                name: nombreMascota,
                breed: raza,
                gender: sexo,
                age: edad,
                imageUrl: imageUrl,
            };

            await addDoc(collection(firestore, 'Dogs'), petData);

            console.log("Mascota guardada con éxito.");
            navigation.goBack();
        } catch (error) {
            console.error("Error al guardar los datos de la mascota:", error);
        }
    };

    if (hasPermission === null) {
        return <View style={styles.centered}><Text>Solicitando permisos...</Text></View>;
    }

    if (!hasPermission) {
        return <View style={styles.centered}><Text>No se concedieron permisos para acceder a la cámara o galería</Text></View>;
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Crear Mascota</Text>
            {imageUrl && <Image source={{ uri: imageUrl }} style={styles.petImage} />}
            <View style={styles.section}>
                <Text style={styles.label}>Nombre del Perro:</Text>
                <TextInput
                    style={styles.input}
                    value={nombreMascota}
                    onChangeText={setNombreMascota}
                />
                <Text style={styles.label}>Raza:</Text>
                <TextInput
                    style={styles.input}
                    value={raza}
                    onChangeText={setRaza}
                />
                <Text style={styles.label}>Sexo:</Text>
                <Picker
                    selectedValue={sexo}
                    style={styles.input}
                    onValueChange={(itemValue) => setSexo(itemValue)}
                >
                    <Picker.Item label="Macho" value="macho" />
                    <Picker.Item label="Hembra" value="hembra" />
                </Picker>
                <Text style={styles.label}>Edad (años/meses):</Text>
                <TextInput
                    style={styles.input}
                    value={edad}
                    onChangeText={setEdad}
                    keyboardType="numeric"
                />
                <TouchableOpacity style={styles.button} onPress={takePicture}>
                    <Text style={styles.buttonText}>Tomar Foto</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={pickImage}>
                    <Text style={styles.buttonText}>Seleccionar de Galería</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={savePetProfile}
                >
                    <Text style={styles.buttonText}>Crear Mascota</Text>
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#d32f2f',
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
        color: '#333',
        marginBottom: 5,
    },
    input: {
        fontSize: 16,
        backgroundColor: '#fff',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    button: {
        backgroundColor: '#d32f2f',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 10,
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
    petImage: {
        width: 200,
        height: 200,
        borderRadius: 100,
        marginBottom: 20,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default CrearMascotaScreen;
