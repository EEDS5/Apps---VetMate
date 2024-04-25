import React, { useState } from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';

const BuscarMatchScreen = ({ navigation }) => {
    const [isLiked, setIsLiked] = useState(false);

    const handleLikePress = () => {
        setIsLiked(!isLiked);
    };

    const handleDislikePress = () => {
        // Aquí puedes manejar la lógica para el botón de dislike si es necesario
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <ImageBackground
                    source={{ uri: 'https://img.freepik.com/foto-gratis/perro-pug-aislado-fondo-blanco_2829-11416.jpg?t=st=1714069910~exp=1714073510~hmac=2f36779f3ddcb32de5feab6e4dfca69c3eabc1baeb06d61b77b6963981831118&w=826' }}
                    style={styles.imageBackground}
                    resizeMode="cover"
                >
                    <View style={styles.overlay}>
                        <Text style={styles.name}>Miguel</Text>
                        <Text style={styles.age}>Edad: 100 años</Text>
                    </View>
                </ImageBackground>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, styles.dislikeButton]}
                    onPress={handleDislikePress}
                >
                    <Text style={styles.buttonText}>X</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, isLiked ? styles.likedButton : styles.likeButton]}
                    onPress={handleLikePress}
                >
                    <Text style={styles.buttonText}>♥</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 5,
        width: '90%',
        aspectRatio: 0.6,
        overflow: 'hidden',
    },
    imageBackground: {
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 20,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 5,
    },
    age: {
        fontSize: 16,
        color: '#FFFFFF',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        width: '80%',
    },
    button: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    likeButton: {
        backgroundColor: '#FFFFFF',
    },
    likedButton: {
        backgroundColor: 'red',
    },
    dislikeButton: {
        backgroundColor: '#FF5733',
    },
    buttonText: {
        fontSize: 24,
        color: '#FFFFFF',
    },
});

export default BuscarMatchScreen;
