//src/screens/Match/BuscarMatchScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, RefreshControl } from 'react-native';
import { collection, getDocs, query, where, doc, addDoc, getDoc } from 'firebase/firestore';
import { firestore, auth } from '../../firebase/firebase';
import MatchApi from '../../services/api/matchApi';

const BuscarMatchScreen = () => {
    const [dogs, setDogs] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchDogs = async () => {
        const user = auth.currentUser;
        if (!user) {
            console.error('Usuario no autenticado');
            return;
        }

        try {
            const q = query(collection(firestore, 'Dogs'), where('ownerId', '!=', user.uid));
            const querySnapshot = await getDocs(q);
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

    useEffect(() => {
        fetchDogs();

        const intervalId = setInterval(fetchDogs, 60000); // Actualizar cada 60 segundos
        return () => clearInterval(intervalId);
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchDogs().then(() => setRefreshing(false));
    }, []);

    const handleLike = async (id) => {
        console.log("Liked dog with id:", id);
        await sendMatchRequest(id);
        showNextDog();
    };

    const handleDislike = (id) => {
        console.log("Disliked dog with id:", id);
        showNextDog();
    };

    const showNextDog = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % dogs.length);
    };

    const sendMatchRequest = async (likedDogId) => {
        const user = auth.currentUser;
        if (!user) {
            console.error('Usuario no autenticado');
            return;
        }
    
        try {
            const likedDogDoc = await getDoc(doc(firestore, 'Dogs', likedDogId));
            const likedDog = likedDogDoc.data();
    
            const userDoc = await getDoc(doc(firestore, 'users', user.uid));
            const senderName = userDoc.data().name;
    
            await addDoc(collection(firestore, 'MatchRequests'), {
                senderId: user.uid,
                senderName,
                receiverId: likedDog.ownerId,
                dogId: likedDogId,
                dogName: likedDog.name, // Añadir el nombre del perro
                dogBreed: likedDog.breed, // Añadir la raza del perro
                status: 'pending'
            });
        } catch (error) {
            console.error("Error al enviar la solicitud de match:", error);
        }
    };
    

    if (isLoading) {
        return <View style={styles.centered}><ActivityIndicator size="large" color="#d32f2f" /></View>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Buscar Match</Text>
            <FlatList
                data={dogs}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => (
                    index === currentIndex ? (
                        <MatchApi
                            key={item.id}
                            dog={item}
                            onLike={handleLike}
                            onDislike={handleDislike}
                        />
                    ) : null
                )}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                ListEmptyComponent={<Text style={styles.noDogsText}>No hay perros disponibles</Text>}
            />
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
