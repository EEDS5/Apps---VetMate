import React, { useState, useEffect } from 'react';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { firestore, storage } from '../../firebase/firebase'; 
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const EditarMascotaScreen = ({ navigation }) => {
    const [hasPermission, setHasPermission] = useState(null);
    const [nombreMascota, setNombreMascota] = useState('');
    const [raza, setRaza] = useState('');
    const [sexo, setSexo] = useState('macho');
    const [edadAnos, setEdadAnos] = useState('');
    const [edadMeses, setEdadMeses] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        (async () => {
            const cameraStatus = await Camera.requestCameraPermissionsAsync();
            const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
            setHasPermission(cameraStatus.status === 'granted' && galleryStatus.status === 'granted');
        })();
    }, []);

    const handleImageUpload = async (uri) => {
        setIsLoading(true);
        try {
            const response = await fetch(uri);
            const blob = await response.blob();
            const fileName = `${Date.now()}_image.jpg`;
            const storageRef = ref(storage, `images/${fileName}`);
            await uploadBytes(storageRef, blob);
            const url = await getDownloadURL(storageRef);
            setImageUrl(url);
        } catch (error) {
            console.log("Error al subir la imagen:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const takePicture = async () => {
        try {
            let result = await ImagePicker.launchCameraAsync({
                allowsEditing: false,
                quality: 1,
            });

            if (!result.canceled && result.assets) {
                const uri = result.assets[0].uri;
                await handleImageUpload(uri);
            }
        } catch (error) {
            console.log("Error al tomar la foto:", error);
        }
    };

    const pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: false,
                quality: 1,
            });

            if (!result.canceled && result.assets) {
                const uri = result.assets[0].uri;
                await handleImageUpload(uri);
            }
        } catch (error) {
            console.log("Error al seleccionar la imagen:", error);
        }
    };

    const savePetProfile = async () => {
        if (!nombreMascota || !raza || !sexo || (!edadAnos && !edadMeses) || !imageUrl) {
            alert("Error: Todos los campos son obligatorios.");
            return;
        }

        setIsLoading(true);
        try {
            const petData = {
                name: nombreMascota,
                breed: raza,
                gender: sexo,
                ageYears: edadAnos,
                ageMonths: edadMeses,
                imageUrl: imageUrl,
            };

            await addDoc(collection(firestore, 'Dogs'), petData);
            alert("Mascota guardada con éxito.");
            navigation.goBack();
        } catch (error) {
            alert("Error al guardar los datos de la mascota:", error.message);
        } finally {
            setIsLoading(false);
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
                <View style={styles.ageSection}>
                    <View style={styles.ageInputContainer}>
                        <Text style={styles.label}>Edad (años):</Text>
                        <TextInput
                            style={styles.input}
                            value={edadAnos}
                            onChangeText={setEdadAnos}
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={styles.ageInputContainer}>
                        <Text style={styles.label}>Edad (meses):</Text>
                        <TextInput
                            style={styles.input}
                            value={edadMeses}
                            onChangeText={setEdadMeses}
                            keyboardType="numeric"
                        />
                    </View>
                </View>
                <TouchableOpacity style={styles.button} onPress={takePicture}>
                    <Text style={styles.buttonText}>Tomar Foto</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={pickImage}>
                    <Text style={styles.buttonText}>Seleccionar de Galería</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={savePetProfile}
                    disabled={isLoading}
                >
                    <Text style={styles.buttonText}>Guardar Mascota</Text>
                </TouchableOpacity>
                {isLoading && <ActivityIndicator size="large" color="#d32f2f" />}
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
        backgroundColor: '#f0f0f0',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#d32f2f',
        marginBottom: 20,
    },
    section: {
        width: '100%',
        padding: 15,
        marginBottom: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 3,
    },
    label: {
        fontSize: 18,
        color: '#333',
        marginBottom: 10,
        fontWeight: '500',
    },
    input: {
        fontSize: 16,
        backgroundColor: '#e0e0e0',
        padding: 12,
        marginBottom: 15,
        borderRadius: 5,
        borderColor: '#ccc',
        borderWidth: 1,
    },
    ageSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    ageInputContainer: {
        flex: 1,
        marginRight: 10,
    },
    button: {
        backgroundColor: '#d32f2f',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 10,
        elevation: 2,
    },
    saveButton: {
        backgroundColor: '#388e3c',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        elevation: 2,
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
        borderColor: '#d32f2f',
        borderWidth: 2,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default EditarMascotaScreen;
