//src/screens/Auth/Registro3Screen.js
import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { auth, firestore } from '../../firebase/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Importa módulos de Storage

const defaultImages = {
    male: require('../../../assets/img/Male_Transparent.png'),
    female: require('../../../assets/img/Female_Transparent.png'),
    other: require('../../../assets/img/Neutral_Transparent.png')
};

const Registro3Screen = ({ navigation, route }) => {
    const { gender } = route.params;
    const [image, setImage] = useState(defaultImages[gender]);
    const [imageUri, setImageUri] = useState(null);
    const [bio, setBio] = useState('Explora el mundo de las conexiones caninas.');

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImageUri(result.uri);
        }
    };

    const handleSubmit = async () => {
        const { name, age, gender, phone, email, password, location, department, city } = route.params;
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            let imageUrl = null;
            if (imageUri) {
                const storage = getStorage();
                const profileImageRef = ref(storage, `profile_images/${user.uid}/profile.jpg`);
                const response = await fetch(imageUri);
                const blob = await response.blob();
                await uploadBytes(profileImageRef, blob);
                imageUrl = await getDownloadURL(profileImageRef);
            } else {
                imageUrl = image;
            }

            await setDoc(doc(firestore, 'users', user.uid), {
                name,
                age,
                gender,
                phone,
                email,
                location,
                department,
                city,
                bio,
                image: imageUrl,
            });

            console.log('Usuario registrado y perfil actualizado:', user);
            navigation.navigate('Home');
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            alert(error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Foto de Perfil y Descripción</Text>
            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                {imageUri ? (
                    <Image source={{ uri: imageUri }} style={styles.image} />
                ) : (
                    <Image source={image} style={styles.image} />
                )}
            </TouchableOpacity>
            <TextInput
                style={[styles.input, { textAlign: 'center' }]}
                placeholder="Descripción"
                placeholderTextColor="#ccc"
                value={bio}
                onChangeText={setBio}
                autoCapitalize="sentences"
                multiline
            />
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Finalizar</Text>
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
        fontWeight: 'bold',
    },
    imagePicker: {
        width: 200,
        height: 200,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        borderWidth: 1,
        borderColor: '#c62828',
        marginBottom: 10,
        overflow: 'hidden',
    },
    imagePickerText: {
        color: '#ccc',
        fontSize: 18,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 100,
    },
    input: {
        width: '90%',
        minHeight: 50,
        maxHeight: 150,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#c62828',
        marginBottom: 10,
        textAlignVertical: 'top',
        textAlign: 'center',
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

export default Registro3Screen;
