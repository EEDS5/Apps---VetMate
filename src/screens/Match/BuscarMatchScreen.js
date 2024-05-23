import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MatchCard from '../../services/api/matchApi';
import firestore from '@react-native-firebase/firestore';

const BuscarMatchScreen = ({ navigation }) => {
    const [dog, setDog] = useState(null);

    useEffect(() => {
        const loadDogData = async () => {
            try {
                const querySnapshot = await firestore().collection('Dogs').limit(1).get();
                if (!querySnapshot.empty) {
                    const docData = querySnapshot.docs[0].data();
                    setDog(docData);
                } else {
                    console.error("No dogs found");
                    // Puedes establecer algún estado para mostrar un mensaje específico si no se encuentran perros
                }
            } catch (error) {
                console.error("Failed to fetch dog data:", error);
                // Manejar el error adecuadamente aquí
            }
        };
    
        loadDogData();
    }, []);
    

    if (!dog) {
        return <Text>Cargando...</Text>; // Mostrar algo mientras los datos se cargan
    }

    return (
        <View style={styles.container}>
            <MatchCard
                name={dog.name}
                age={dog.age}
                gender={dog.gender}
                imageUrl={dog.imageUrl}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default BuscarMatchScreen;
