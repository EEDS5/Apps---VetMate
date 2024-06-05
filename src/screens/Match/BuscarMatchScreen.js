import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../../firebase/firebase';
import MatchApi from '../../services/api/matchApi';

const BuscarMatchScreen = () => {
    const [dogs, setDogs] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

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
            } finally {
                setIsLoading(false);
            }
        };

        fetchDogs();

        const intervalId = setInterval(fetchDogs, 60000); // Actualizar cada 60 segundos
        return () => clearInterval(intervalId);
    }, []);

    const handleLike = (id) => {
        console.log("Liked dog with id:", id);
        // Implementar lógica adicional para manejar el "like"
        showNextDog();
    };

    const handleDislike = (id) => {
        console.log("Disliked dog with id:", id);
        // Implementar lógica adicional para manejar el "dislike"
        showNextDog();
    };

    const showNextDog = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % dogs.length);
    };

    if (isLoading) {
        return <View style={styles.centered}><ActivityIndicator size="large" color="#d32f2f" /></View>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Buscar Match</Text>
            {dogs.length > 0 ? (
                <MatchApi
                    key={dogs[currentIndex].id}
                    dog={dogs[currentIndex]}
                    onLike={handleLike}
                    onDislike={handleDislike}
                />
            ) : (
                <Text style={styles.noDogsText}>No hay perros disponibles</Text>
            )}
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
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noDogsText: {
        fontSize: 18,
        color: '#333',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default BuscarMatchScreen;
