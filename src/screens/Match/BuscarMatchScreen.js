import React, { useState } from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const BuscarMatchScreen = ({ navigation }) => {
    const [isLiked, setIsLiked] = useState(false);

    const handleLikePress = () => {
        setIsLiked(!isLiked);
    };

    const handleDislikePress = () => {
        // Lógica para el botón de dislike
    };

    return (
        <View style={styles.container}>
            <ImageBackground
                source={{ uri: 'https://img.freepik.com/foto-gratis/perro-pug-aislado-fondo-blanco_2829-11416.jpg?t=st=1714069910~exp=1714073510~hmac=2f36779f3ddcb32de5feab6e4dfca69c3eabc1baeb06d61b77b6963981831118&w=826' }}
                style={styles.card}
                resizeMode="cover"
            >
                {/* Contenedor de los botones de like y dislike */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.button, styles.dislikeButton]}
                        onPress={handleDislikePress}
                    >
                        <Icon name="times" style={styles.icon} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, isLiked ? styles.likedButton : styles.likeButton]}
                        onPress={handleLikePress}
                    >
                        <Icon name="heart" style={styles.icon} />
                    </TouchableOpacity>
                </View>
            </ImageBackground>
            {/* Contenedor de texto para el nombre y la edad */}
            <View style={styles.textContainer}>
                <Text style={styles.name}>Miguel</Text>
                <Text style={styles.age}>Edad: 100 años</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff', // Un fondo claro
    },
    card: {
        width: '95%',
        height: 600, // Tamaño grande para enfocar la atención en la imagen
        borderRadius: 20, // Esquinas redondeadas pero no totalmente redondo
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20, // Espacio para separar la imagen del texto
        backgroundColor: '#ffffff', // Fondo blanco para la tarjeta
        elevation: 10, // Sombra para elevar la tarjeta
        // Sombra para iOS
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
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff', // Botones claros para contrastar con la imagen
        // Sombra para elevar el botón
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    likeButton: {
        // Añade un borde para definir mejor el botón
        borderWidth: 1,
        borderColor: '#00C853', // Verde para el botón de like
    },
    likedButton: {
        backgroundColor: '#00C853', // Verde para indicar que se dio like
    },
    dislikeButton: {
        // Añade un borde para definir mejor el botón
        borderWidth: 1,
        borderColor: '#DD2C00', // Rojo para el botón de dislike
    },
    icon: {
        fontSize: 24,
        color: '#000', // Íconos oscuros para contraste
    },
    textContainer: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        alignItems: 'center', // Centra el texto horizontalmente
        backgroundColor: '#f8f8f8', // Un ligero fondo gris para destacar el texto
        width: '100%', // El texto se extiende a lo ancho
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    name: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#333', // Texto oscuro para facilitar la lectura
    },
    age: {
        fontSize: 20,
        color: '#555', // Un gris oscuro para la edad
    },
});


export default BuscarMatchScreen;
