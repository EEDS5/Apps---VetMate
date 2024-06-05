import React, { useState, useEffect } from 'react';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Modal, FlatList } from 'react-native';
import { firestore, storage, auth } from '../../firebase/firebase'; 
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const initialDogBreeds = [
    "Akita Inu", "Beagle", "Border Collie", "Boxer", "Bulldog", "Chihuahua",
    "Cocker Spaniel", "Dachshund", "Doberman", "English Bulldog", "French Bulldog",
    "German Shepherd", "Golden Retriever", "Jack Russell Terrier", "Labrador Retriever",
    "Maltese", "Poodle", "Pug", "Rottweiler", "Shih Tzu", "Siberian Husky",
    "Schnauzer", "Pit Bull", "American Cocker Spaniel", "Yorkshire Terrier"
];

const CrearMascotaScreen = ({ navigation }) => {
    const [hasPermission, setHasPermission] = useState(null);
    const [nombreMascota, setNombreMascota] = useState('');
    const [raza, setRaza] = useState('');
    const [sexo, setSexo] = useState('macho');
    const [edadAnos, setEdadAnos] = useState('');
    const [edadMeses, setEdadMeses] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [breedModalVisible, setBreedModalVisible] = useState(false);
    const [dogBreeds, setDogBreeds] = useState(initialDogBreeds);
    const [newBreed, setNewBreed] = useState('');
    const [addingBreed, setAddingBreed] = useState(false);

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
        
        if (isNaN(edadAnos) || isNaN(edadMeses)) {
            alert("Error: La edad debe ser un número válido.");
            return;
        }

        setIsLoading(true);
        try {
            const user = auth.currentUser;
            if (!user) {
                throw new Error('No hay usuario autenticado.');
            }

            const petData = {
                name: nombreMascota,
                breed: raza,
                gender: sexo,
                ageYears: parseInt(edadAnos),
                ageMonths: parseInt(edadMeses),
                imageUrl: imageUrl,
                ownerId: user.uid // Añadir el uid del usuario
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
        <FlatList
            ListHeaderComponent={
                <View style={styles.container}>
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
                        <TouchableOpacity onPress={() => setBreedModalVisible(true)} style={styles.breedButton}>
                            <Text style={styles.breedButtonText}>{raza || "Seleccionar Raza"}</Text>
                        </TouchableOpacity>
                        <Text style={styles.label}>Sexo:</Text>
                        <View style={styles.pickerContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.pickerButton,
                                    sexo === 'macho' ? styles.pickerButtonSelected : {},
                                ]}
                                onPress={() => setSexo('macho')}
                            >
                                <Text style={styles.pickerButtonText}>Macho</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.pickerButton,
                                    sexo === 'hembra' ? styles.pickerButtonSelected : {},
                                ]}
                                onPress={() => setSexo('hembra')}
                            >
                                <Text style={styles.pickerButtonText}>Hembra</Text>
                            </TouchableOpacity>
                        </View>
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
                    <Modal visible={breedModalVisible} animationType="slide">
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Seleccionar Raza</Text>
                            <FlatList
                                data={dogBreeds}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.breedOption}
                                        onPress={() => {
                                            setRaza(item);
                                            setBreedModalVisible(false);
                                        }}
                                    >
                                        <Text style={styles.breedName}>{item}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                            <TouchableOpacity
                                style={styles.breedOption}
                                onPress={() => setAddingBreed(true)}
                            >
                                <Text style={styles.breedName}>Añadir Nueva Raza</Text>
                            </TouchableOpacity>
                            {addingBreed && (
                                <View style={styles.newBreedContainer}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Nombre de la nueva raza"
                                        value={newBreed}
                                        onChangeText={setNewBreed}
                                    />
                                    <TouchableOpacity
                                        style={styles.saveButton}
                                        onPress={() => {
                                            if (newBreed.trim()) {
                                                setRaza(newBreed.trim());
                                                setDogBreeds(prevBreeds => [...prevBreeds, newBreed.trim()]);
                                                setNewBreed('');
                                                setAddingBreed(false);
                                                setBreedModalVisible(false);
                                            } else {
                                                alert('El nombre de la raza no puede estar vacío.');
                                            }
                                        }}
                                    >
                                        <Text style={styles.buttonText}>Guardar Nueva Raza</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                            <TouchableOpacity
                                style={styles.modalCloseButton}
                                onPress={() => {
                                    setBreedModalVisible(false);
                                    setAddingBreed(false);
                                }}
                            >
                                <Text style={styles.modalCloseButtonText}>Cerrar</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                </View>
            }
            data={[]}
            renderItem={null}
            keyExtractor={(item, index) => index.toString()}
        />
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
    breedButton: {
        backgroundColor: '#e0e0e0',
        padding: 12,
        marginBottom: 15,
        borderRadius: 5,
        borderColor: '#ccc',
        borderWidth: 1,
        alignItems: 'center',
    },
    breedButtonText: {
        fontSize: 16,
        color: '#333',
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
    pickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 15,
    },
    pickerButton: {
        flex: 1,
        padding: 12,
        alignItems: 'center',
        borderRadius: 5,
        marginHorizontal: 5,
        backgroundColor: '#e0e0e0',
    },
    pickerButtonSelected: {
        backgroundColor: '#d32f2f',
    },
    pickerButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#d32f2f',
    },
    breedOption: {
        padding: 10,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        width: '100%',
        alignItems: 'center',
    },
    breedName: {
        fontSize: 18,
        color: '#333',
    },
    newBreedContainer: {
        marginTop: 20,
        width: '100%',
        alignItems: 'center',
    },
    modalCloseButton: {
        marginTop: 20,
        backgroundColor: '#d32f2f',
        padding: 10,
        borderRadius: 5,
    },
    modalCloseButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    }
});

export default CrearMascotaScreen;
