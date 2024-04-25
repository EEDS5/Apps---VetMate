// src/screens/Profile/EditarMascotaScreen.js
import React, { useState, useEffect } from 'react';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';

const EditarMascotaScreen = ({ navigation }) => {
    const [hasPermission, setHasPermission] = useState(null);
    const [nombreMascota, setNombreMascota] = useState('Tiranosaurio Rex');
    const [raza, setRaza] = useState('Labrador Retriever');
    const [image, setImage] = useState(null);

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

    const saveFile = async (fileUri) => {
        if (typeof fileUri !== 'string') {
            console.log("URI del archivo no válida: ", fileUri);
            return;
        }
    
        try {
            const asset = await MediaLibrary.createAssetAsync(fileUri);
            let album = await MediaLibrary.getAlbumAsync('VetMate');
            if (album === null) {
                album = await MediaLibrary.createAlbumAsync('VetMate', asset, false);
            } else {
                await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
            }
        } catch (error) {
            console.log("Error al guardar el archivo: ", error);
        }
    };

    const takePicture = async () => {
        try {
            let result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
    
            if (result.error) {
                console.log('Error de ImagePicker:', result.error);
                return;
            }
    
            console.log(result);
    
            if (!result.cancelled && result.uri) {
                setImage(result.uri);
                await saveFile(result.uri);
            }
        } catch (error) {
            console.log("Error al tomar la foto: ", error);
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
    
            if (result.error) {
                console.log('Error de ImagePicker:', result.error);
                return;
            }
    
            if (!result.cancelled && result.uri) {
                setImage(result.uri);
                await saveFile(result.uri);
            }
        } catch (error) {
            console.log("Error al seleccionar la imagen: ", error);
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
            <Text style={styles.title}>Editar Mascota</Text>
            {image && <Image source={{ uri: image }} style={styles.petImage} />}
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
                <TouchableOpacity style={styles.button} onPress={takePicture}>
                    <Text style={styles.buttonText}>Tomar Foto</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={pickImage}>
                    <Text style={styles.buttonText}>Seleccionar de Galería</Text>
                </TouchableOpacity>
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#d32f2f', // Color del título acorde al logotipo
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

export default EditarMascotaScreen;