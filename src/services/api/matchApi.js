import React, { useState } from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';

const MatchCard = ({ id, name, age, gender, imageUrl }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [isDisliked, setIsDisliked] = useState(false);

    const handleLikePress = async () => {
        const newLikeState = !isLiked;
        setIsLiked(newLikeState);
        if (isDisliked) setIsDisliked(false);

        await firestore().collection('Dogs').doc(id).update({
            liked: newLikeState
        });
    };

    const handleDislikePress = async () => {
        const newDislikeState = !isDisliked;
        setIsDisliked(newDislikeState);
        if (isLiked) setIsLiked(false);

        await firestore().collection('Dogs').doc(id).update({
            disliked: newDislikeState
        });
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <ImageBackground
                source={{ uri: imageUrl }}
                style={styles.card}
                resizeMode="cover"
            >
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.button, isDisliked ? styles.dislikedButton : styles.button]}
                        onPress={handleDislikePress}
                    >
                        <Icon name="times" style={styles.icon} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, isLiked ? styles.likedButton : styles.button]}
                        onPress={handleLikePress}
                    >
                        <Icon name="heart" style={styles.icon} />
                    </TouchableOpacity>
                </View>
            </ImageBackground>
            <View style={styles.textContainer}>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.age}>Edad: {age} años</Text>
                <Text style={styles.gender}>Sexo: {gender}</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        paddingVertical: 20,
    },
    card: {
        width: '90%',
        height: 500, // Reducimos la altura
        borderRadius: 20,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: '#ffffff',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        position: 'absolute',
        bottom: 20,
    },
    button: {
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    likeButton: {
        borderWidth: 1,
        borderColor: '#00C853',
    },
    likedButton: {
        backgroundColor: '#00C853',
    },
    dislikeButton: {
        borderWidth: 1,
        borderColor: '#DD2C00',
    },
    dislikedButton: {
        backgroundColor: '#DD2C00',
    },
    icon: {
        fontSize: 28,
        color: '#000',
    },
    textContainer: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        width: '100%',
        borderRadius: 20,
    },
    name: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
    },
    age: {
        fontSize: 22,
        color: '#555',
    },
    gender: {
        fontSize: 22,
        color: '#555',
    },
});

export default MatchCard;
