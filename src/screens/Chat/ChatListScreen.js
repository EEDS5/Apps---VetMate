// src/screens/Chat/ChatListScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { auth, firestore } from '../../firebase/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

const ChatListScreen = ({ navigation }) => {
    const [chats, setChats] = useState([]);

    useEffect(() => {
        const fetchChats = async () => {
            const user = auth.currentUser;
            if (!user) {
                console.error('Usuario no autenticado');
                return;
            }

            const q = query(collection(firestore, 'chats'), where('users', 'array-contains', user.uid));
            const querySnapshot = await getDocs(q);
            const chatsList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setChats(chatsList);
        };

        fetchChats();
    }, []);

    const handleChat = (chat) => {
        const otherUserId = chat.users.find(uid => uid !== auth.currentUser.uid);
        navigation.navigate('Chat', { user: { id: otherUserId } });
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={chats}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleChat(item)}>
                        <View style={styles.chatItem}>
                            <Text style={styles.chatTitle}>Chat con {item.users.find(uid => uid !== auth.currentUser.uid)}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
    },
    chatItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    chatTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ChatListScreen;
