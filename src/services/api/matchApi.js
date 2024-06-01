// src/Services/api/matchApi.js
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const MatchApi = ({ dog, onLike, onDislike }) => {
    const [liked, setLiked] = useState(false);

    const handleLike = () => {
        setLiked(true);
        onLike(dog.id);
    };

    const handleDislike = () => {
        setLiked(false);
        onDislike(dog.id);
    };

    return (
        <View style={styles.card}>
            <Image source={{ uri: dog.imageUrl }} style={styles.image} />
            <Text style={styles.name}>{dog.name}</Text>
            <Text style={styles.breed}>{dog.breed}</Text>
            <Text style={styles.age}>{dog.ageYears} años, {dog.ageMonths} meses</Text>
            <View style={styles.actions}>
                <TouchableOpacity style={styles.button} onPress={handleDislike}>
                    <Text style={styles.buttonText}>Dislike</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleLike}>
                    <Text style={styles.buttonText}>Like</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        margin: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    image: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 15,
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    breed: {
        fontSize: 18,
        color: '#666',
        marginBottom: 5,
    },
    age: {
        fontSize: 16,
        color: '#999',
        marginBottom: 15,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
    },
    button: {
        backgroundColor: '#d32f2f',
        padding: 10,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default MatchApi;
