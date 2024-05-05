import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList } from 'react-native';

const VetChatScreen = () => {
    // Estado para almacenar los mensajes y el texto de entrada
    const [messages, setMessages] = useState([]);// Arreglo de mensajes
    const [inputText, setInputText] = useState('');// Texto de entrada del usuario

    // Función para manejar el envío de mensajes
    const handleSend = () => {
        if (inputText.trim() !== '') {// Verifica si el texto de entrada no está vacío
            // Crea un nuevo mensaje con un ID único y una marca de tiempo
            const newMessage = {
                id: messages.length + 1,
                text: inputText,
                timestamp: new Date().getTime(),
            };

            // Actualiza el estado de los mensajes agregando el nuevo mensaje
            setMessages(prevMessages => [...prevMessages, newMessage]);
            // Limpia el texto de entrada
            setInputText('');
        }
    };

    const formatTime = timestamp => {
        const date = new Date(timestamp);
        return `${date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}`; 
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={messages}
                renderItem={({ item }) => (
                    <View style={styles.messageContainer}>
                        <Text style={styles.message}>{item.text}</Text>
                        <Text style={styles.timestamp}>{formatTime(item.timestamp)}</Text>
                    </View>
                )}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.messagesList}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Escribe tu mensaje..."
                    value={inputText}
                    onChangeText={setInputText}
                    onSubmitEditing={handleSend}
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                    <Text style={styles.sendButtonText}>Enviar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    messagesList: {
        flexGrow: 1,
    },
    messageContainer: {
        backgroundColor: '#EEEEEE',
        borderRadius: 20,
        maxWidth: '70%',
        marginVertical: 5,
        marginHorizontal: 10,
        padding: 10,
        alignSelf: 'flex-end',
    },
    message: {
        fontSize: 16,
        marginBottom: 4,  // Minimal space between the message and the timestamp
    },
    timestamp: {
        fontSize: 12,
        color: '#d32f2f',  // Same color as the send button
        alignSelf: 'flex-end',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#CCCCCC',
        padding: 10,
    },
    input: {
        flex: 1,
        height: 40,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#CCCCCC',
        borderRadius: 20,
        paddingHorizontal: 10,
        marginRight: 10,
    },
    sendButton: {
        backgroundColor: '#d32f2f',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    sendButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
});

export default VetChatScreen;