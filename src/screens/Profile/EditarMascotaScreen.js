import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ActivityIndicator, FlatList, Modal, ScrollView, Alert
} from 'react-native';
import { firestore, auth } from '../../firebase/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';

const initialDogBreeds = [
    "Akita Inu", "Beagle", "Border Collie", "Boxer", "Bulldog", "Chihuahua", "Cocker Spaniel", "Dachshund", "Doberman",
    "English Bulldog", "French Bulldog", "German Shepherd", "Golden Retriever", "Jack Russell Terrier", "Labrador Retriever",
    "Maltese", "Poodle", "Pug", "Rottweiler", "Shih Tzu", "Siberian Husky", "Schnauzer", "Pit Bull", "American Cocker Spaniel",
    "Yorkshire Terrier"
];

const EditarMascotaScreen = ({ navigation }) => {
    const [mascotas, setMascotas] = useState([]);
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
        fetchPets();
    }, []);

    const fetchPets = useCallback(async () => {
        setIsLoading(true);
        try {
            const user = auth.currentUser;
            if (!user) {
                throw new Error('No hay usuario autenticado.');
            }

            const q = query(collection(firestore, 'Dogs'), where('ownerId', '==', user.uid));
            const querySnapshot = await getDocs(q);
            const pets = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMascotas(pets);
        } catch (error) {
            console.log("Error al obtener las mascotas:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const selectPet = useCallback((pet) => {
        setSelectedPet(pet);
        setNombreMascota(pet.name);
        setRaza(pet.breed);
        setSexo(pet.gender);
        setEdadAnos(pet.ageYears.toString());
        setEdadMeses(pet.ageMonths.toString());
    }, []);

    const updatePet = useCallback(async () => {
        if (!nombreMascota || !raza || !sexo || (!edadAnos && !edadMeses)) {
            alert("Error: Todos los campos son obligatorios.");
            return;
        }

        setIsLoading(true);
        try {
            const petDocRef = doc(firestore, 'Dogs', selectedPet.id);
            await updateDoc(petDocRef, {
                name: nombreMascota,
                breed: raza,
                gender: sexo,
                ageYears: parseInt(edadAnos),
                ageMonths: parseInt(edadMeses)
            });
            alert("Mascota actualizada con éxito.");
            fetchPets();
            setSelectedPet(null);
        } catch (error) {
            alert("Error al actualizar los datos de la mascota:", error.message);
        } finally {
            setIsLoading(false);
        }
    }, [nombreMascota, raza, sexo, edadAnos, edadMeses, selectedPet, fetchPets]);

    const deletePet = useCallback(async (petId) => {
        Alert.alert(
            "Confirmar Eliminación",
            "¿Estás seguro de que deseas eliminar esta mascota?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar",
                    onPress: async () => {
                        setIsLoading(true);
                        try {
                            await deleteDoc(doc(firestore, 'Dogs', petId));
                            alert("Mascota eliminada con éxito.");
                            fetchPets();
                        } catch (error) {
                            alert("Error al eliminar la mascota:", error.message);
                        } finally {
                            setIsLoading(false);
                        }
                    }
                }
            ]
        );
    }, [fetchPets]);

    const renderPetItem = ({ item }) => (
        <View style={styles.petCard}>
            <Image source={{ uri: item.imageUrl }} style={styles.petImage} />
            <View style={styles.petInfoContainer}>
                <Text style={styles.petName}>{item.name}</Text>
                <Text style={styles.petInfo}>Raza: {item.breed}</Text>
                <Text style={styles.petInfo}>Sexo: {item.gender}</Text>
                <Text style={styles.petInfo}>Edad: {item.ageYears} años, {item.ageMonths} meses</Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.editButton} onPress={() => selectPet(item)}>
                        <Text style={styles.buttonText}>Editar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deleteButton} onPress={() => deletePet(item.id)}>
                        <Text style={styles.buttonText}>Eliminar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

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
                        <TouchableOpacity style={styles.cancelButton} onPress={() => setSelectedPet(null)}>
                            <Text style={styles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            ) : (
                <FlatList
                    data={mascotas}
                    keyExtractor={(item) => item.id}
                    renderItem={renderPetItem}
                />
            )}
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
    petCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
    },
    petImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginRight: 15,
    },
    petImageLarge: {
        width: 200,
        height: 200,
        borderRadius: 20,
        marginBottom: 15,
        borderColor: '#d32f2f',
        borderWidth: 2,
    },
    petInfoContainer: {
        flex: 1,
    },
    petName: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    petInfo: {
        fontSize: 16,
        color: '#555',
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 10,
    },
    editButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 8,
        marginRight: 10,
    },
    deleteButton: {
        backgroundColor: '#f44336',
        padding: 10,
        borderRadius: 8,
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
});

export default EditarMascotaScreen;
