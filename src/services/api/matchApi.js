// src/Services/api/matchApi.js
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

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
            <View style={styles.info}>
                <Text style={styles.name}>{dog.name}</Text>
                <Text style={styles.age}>{dog.ageYears} años</Text>
                <Text style={styles.age}>{dog.ageMonths} meses</Text>
            </View>
            <View style={styles.actions}>
                <TouchableOpacity style={[styles.button, styles.dislikeButton]} onPress={handleDislike}>
                    <FontAwesome name="times" size={32} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.likeButton]} onPress={handleLike}>
                    <FontAwesome name="heart" size={32} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        overflow: 'hidden',
        margin: 10,
        width: width - 40,
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    image: {
        width: '100%',
        height: width - 40, // Hacer que la imagen sea cuadrada
    },
    info: {
        padding: 15,
        alignItems: 'center',
    },
    name: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    age: {
        fontSize: 20,
        color: '#666',
        marginBottom: 5,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 15,
    },
    button: {
        backgroundColor: '#d32f2f',
        padding: 20,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dislikeButton: {
        backgroundColor: '#d32f2f',
    },
    likeButton: {
        backgroundColor: '#388e3c',
    },
});

export default MatchApi;
