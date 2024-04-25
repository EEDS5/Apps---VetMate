import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList } from 'react-native';

const VetChatScreen = () => {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');

    const sendMessage = () => {
        if (inputText.trim() === '') return;
        setMessages(prevMessages => [...prevMessages, inputText]);
        setInputText('');
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={messages}
                renderItem={({ item }) => (
                    <View style={styles.messageContainer}>
                        <Text style={styles.message}>{item}</Text>
                    </View>
                )}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.messagesList}
                inverted
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Escribe tu mensaje..."
                    value={inputText}
                    onChangeText={setInputText}
                    onSubmitEditing={sendMessage}
                />
                <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
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
        justifyContent: 'flex-end',
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