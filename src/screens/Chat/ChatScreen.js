import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { auth, firestore } from '../../firebase/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { MaterialIcons } from '@expo/vector-icons';

const ChatScreen = ({ route }) => {
    const { user } = route.params;
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const chatId = [auth.currentUser.uid, user.id].sort().join('_');
        const messagesRef = collection(firestore, 'chats', chatId, 'messages');
        const q = query(messagesRef, orderBy('createdAt', 'asc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const messagesList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setMessages(messagesList);
        });

        return () => unsubscribe();
    }, [user.id]);

    const sendMessage = async () => {
        if (message.trim() === '') return;

        const chatId = [auth.currentUser.uid, user.id].sort().join('_');
        const messagesRef = collection(firestore, 'chats', chatId, 'messages');

        await addDoc(messagesRef, {
            text: message,
            createdAt: serverTimestamp(),
            senderId: auth.currentUser.uid
        });

        setMessage('');
    };

    const renderItem = ({ item }) => (
        <View style={item.senderId === auth.currentUser.uid ? styles.myMessage : styles.otherMessage}>
            <Text style={styles.messageText}>{item.text}</Text>
            <Text style={styles.messageTime}>{new Date(item.createdAt?.toDate()).toLocaleTimeString()}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.chatTitle}>Chat con {user.name}</Text>
            <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.chatList}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Escribe un mensaje..."
                />
                <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
                    <MaterialIcons name="send" size={24} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f0f0f0',
    },
    chatTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#3b5998',
        textAlign: 'center',
    },
    chatList: {
        flexGrow: 1,
        justifyContent: 'flex-end',
    },
    myMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#d1e7dd',
        padding: 10,
        borderRadius: 15,
        marginVertical: 5,
        maxWidth: '80%',
    },
    otherMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#f8d7da',
        padding: 10,
        borderRadius: 15,
        marginVertical: 5,
        maxWidth: '80%',
    },
    messageText: {
        fontSize: 16,
        color: '#000',
    },
    messageTime: {
        fontSize: 12,
        color: '#555',
        alignSelf: 'flex-end',
        marginTop: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#fff',
        paddingVertical: 5,
    },
    input: {
        flex: 1,
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 20,
        marginRight: 10,
        backgroundColor: '#fff',
    },
    sendButton: {
        backgroundColor: '#3b5998',
        borderRadius: 20,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ChatScreen;
