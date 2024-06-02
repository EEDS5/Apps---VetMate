// src/screens/Match/BuscarMatchScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../../firebase/firebase';
import MatchApi from '../../services/api/matchApi';

const BuscarMatchScreen = () => {
    const [dogs, setDogs] = useState([]);

    useEffect(() => {
        const fetchDogs = async () => {
            try {
                const querySnapshot = await getDocs(collection(firestore, 'Dogs'));
                const dogsList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setDogs(dogsList);
            } catch (error) {
                console.error("Error al obtener los datos de los perros:", error);
            }
        };

        fetchDogs();
    }, []);

    const handleLike = (id) => {
        console.log("Liked dog with id:", id);
        // Implementar lógica adicional para manejar el "like"
    };

    const handleDislike = (id) => {
        console.log("Disliked dog with id:", id);
        // Implementar lógica adicional para manejar el "dislike"
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Buscar Match</Text>
            <ScrollView contentContainerStyle={styles.scrollView}>
                {dogs.map((dog) => (
                    <MatchApi key={dog.id} dog={dog} onLike={handleLike} onDislike={handleDislike} />
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#d32f2f',
        textAlign: 'center',
        marginVertical: 20,
    },
    scrollView: {
        padding: 10,
    },
});

export default BuscarMatchScreen;
