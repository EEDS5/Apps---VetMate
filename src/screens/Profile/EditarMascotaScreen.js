//src/screens/profile/EditarMascotaScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Modal, ScrollView, Alert
} from 'react-native';
import { firestore, auth } from '../../firebase/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

const initialDogBreeds = [
    "Akita Inu", "Beagle", "Border Collie", "Boxer", "Bulldog", "Chihuahua", "Cocker Spaniel", "Dachshund", "Doberman",
    "English Bulldog", "French Bulldog", "German Shepherd", "Golden Retriever", "Jack Russell Terrier", "Labrador Retriever",
    "Maltese", "Poodle", "Pug", "Rottweiler", "Shih Tzu", "Siberian Husky", "Schnauzer", "Pit Bull", "American Cocker Spaniel",
    "Yorkshire Terrier"
];

const EditarMascotaScreen = ({ navigation, route }) => {
    const { petId } = route.params;
    const [isLoading, setIsLoading] = useState(false);
    const [selectedPet, setSelectedPet] = useState(null);
    const [nombreMascota, setNombreMascota] = useState('');
    const [raza, setRaza] = useState('');
    const [sexo, setSexo] = useState('macho');
    const [edadAnos, setEdadAnos] = useState('');
    const [edadMeses, setEdadMeses] = useState('');
    const [breedModalVisible, setBreedModalVisible] = useState(false);
    const [dogBreeds, setDogBreeds] = useState(initialDogBreeds);
    const [newBreed, setNewBreed] = useState('');
    const [addingBreed, setAddingBreed] = useState(false);

    useEffect(() => {
        fetchPetData();
    }, [petId]);

    const fetchPetData = useCallback(async () => {
        setIsLoading(true);
        try {
            const petDoc = await getDoc(doc(firestore, 'Dogs', petId));
            if (petDoc.exists()) {
                const pet = petDoc.data();
                setSelectedPet(pet);
                setNombreMascota(pet.name);
                setRaza(pet.breed);
                setSexo(pet.gender);
                setEdadAnos(pet.ageYears.toString());
                setEdadMeses(pet.ageMonths.toString());
            } else {
                alert('Mascota no encontrada.');
                navigation.goBack();
            }
        } catch (error) {
            console.log("Error al obtener los datos de la mascota:", error);
        } finally {
            setIsLoading(false);
        }
    }, [petId, navigation]);

    const updatePet = useCallback(async () => {
        if (!nombreMascota || !raza || !sexo || (!edadAnos && !edadMeses)) {
            alert("Error: Todos los campos son obligatorios.");
            return;
        }

        setIsLoading(true);
        try {
            const petDocRef = doc(firestore, 'Dogs', petId);
            await updateDoc(petDocRef, {
                name: nombreMascota,
                breed: raza,
                gender: sexo,
                ageYears: parseInt(edadAnos),
                ageMonths: parseInt(edadMeses)
            });
            alert("Mascota actualizada con éxito.");
            navigation.goBack();
        } catch (error) {
            alert("Error al actualizar los datos de la mascota:", error.message);
        } finally {
            setIsLoading(false);
        }
    }, [nombreMascota, raza, sexo, edadAnos, edadMeses, petId, navigation]);

    if (isLoading) {
        return <View style={styles.centered}><ActivityIndicator size="large" color="#d32f2f" /></View>;
    }

    return (
        <View style={styles.container}>
            {selectedPet ? (
                <ScrollView style={styles.scrollContainer}>
                    <View style={styles.section}>
                        <Text style={styles.title}>Editar Mascota</Text>
                        {selectedPet.imageUrl && <Image source={{ uri: selectedPet.imageUrl }} style={styles.petImageLarge} />}
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
                        <TouchableOpacity style={styles.saveButton} onPress={updatePet} disabled={isLoading}>
                            <Text style={styles.buttonText}>Guardar Cambios</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
                            <Text style={styles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            ) : (
                <Text style={styles.loadingText}>Cargando datos de la mascota...</Text>
            )}
            <Modal visible={breedModalVisible} animationType="slide">
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Seleccionar Raza</Text>
                    <ScrollView>
                        {dogBreeds.map((breed, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.breedOption}
                                onPress={() => {
                                    setRaza(breed);
                                    setBreedModalVisible(false);
                                }}
                            >
                                <Text style={styles.breedName}>{breed}</Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity style={styles.breedOption} onPress={() => setAddingBreed(true)}>
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
                    </ScrollView>
                    <TouchableOpacity style={styles.modalCloseButton} onPress={() => {
                        setBreedModalVisible(false);
                        setAddingBreed(false);
                    }}>
                        <Text style={styles.modalCloseButtonText}>Cerrar</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    scrollContainer: {
        flexGrow: 1,
        padding: 20,
    },
    section: {
        width: '100%',
        padding: 15,
        marginBottom: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    label: {
        fontSize: 18,
        color: '#333',
        marginBottom: 10,
        fontWeight: '500',
    },
    input: {
        fontSize: 16,
        backgroundColor: '#e6e6e6',
        padding: 12,
        marginBottom: 15,
        borderRadius: 8,
        borderColor: '#ccc',
        borderWidth: 1,
    },
    breedButton: {
        backgroundColor: '#e6e6e6',
        padding: 12,
        marginBottom: 15,
        borderRadius: 8,
        borderColor: '#ccc',
        borderWidth: 1,
        alignItems: 'center',
    },
    breedButtonText: {
        fontSize: 16,
        color: '#333',
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
        borderRadius: 8,
        marginHorizontal: 5,
        backgroundColor: '#e6e6e6',
    },
    pickerButtonSelected: {
        backgroundColor: '#d32f2f',
    },
    pickerButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    ageSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    ageInputContainer: {
        flex: 1,
        marginRight: 10,
    },
    saveButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        elevation: 2,
        marginTop: 10,
    },
    cancelButton: {
        backgroundColor: '#f44336',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        elevation: 2,
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    petImageLarge: {
        width: 200,
        height: 200,
        borderRadius: 20,
        marginBottom: 15,
        borderColor: '#d32f2f',
        borderWidth: 2,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
        color: '#333',
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
        backgroundColor: '#f44336',
        padding: 10,
        borderRadius: 8,
    },
    modalCloseButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loadingText: {
        fontSize: 18,
        color: '#333',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default EditarMascotaScreen;
