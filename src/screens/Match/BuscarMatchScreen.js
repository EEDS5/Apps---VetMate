import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { collection, getDocs, query, where, updateDoc, arrayUnion, doc, getDoc, setDoc } from 'firebase/firestore';
import { firestore, auth } from '../../firebase/firebase';
import MatchApi from '../../services/api/matchApi';

const BuscarMatchScreen = () => {
    const [dogs, setDogs] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
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

        fetchDogs();

        const intervalId = setInterval(fetchDogs, 60000); // Actualizar cada 60 segundos
        return () => clearInterval(intervalId);
    }, []);

    const handleLike = async (id) => {
        console.log("Liked dog with id:", id);
        await registerLike(id);
        showNextDog();
    };

    const handleDislike = (id) => {
        console.log("Disliked dog with id:", id);
        showNextDog();
    };

    const showNextDog = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % dogs.length);
    };

    const registerLike = async (likedDogId) => {
        const user = auth.currentUser;
        if (!user) {
            console.error('Usuario no autenticado');
            return;
        }

        try {
            await updateDoc(doc(firestore, 'Dogs', likedDogId), {
                likedBy: arrayUnion(user.uid)
            });

            const likedDogDoc = await getDoc(doc(firestore, 'Dogs', likedDogId));
            const likedBy = likedDogDoc.data().likedBy || [];

            if (likedBy.includes(user.uid)) {
                console.log("It's a match!");
                // Handle the match logic here (e.g., update Firestore, notify users, etc.)
                const chatId = [auth.currentUser.uid, likedDogDoc.data().ownerId].sort().join('_');
                await setDoc(doc(firestore, 'chats', chatId), {
                    users: [auth.currentUser.uid, likedDogDoc.data().ownerId],
                    createdAt: new Date()
                });
            }
        } catch (error) {
            console.error("Error al registrar el like:", error);
        }
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
