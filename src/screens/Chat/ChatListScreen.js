// src/screens/Chat/ChatListScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { auth, firestore } from '../../firebase/firebase';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';

const ChatListScreen = ({ navigation }) => {
    const [chats, setChats] = useState([]);
    const [userDetails, setUserDetails] = useState({});

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

            // Fetch user details for all chats
            const userIds = new Set();
            chatsList.forEach(chat => {
                chat.users.forEach(uid => {
                    if (uid !== user.uid) {
                        userIds.add(uid);
                    }
                });
            });

            const userDetailsPromises = Array.from(userIds).map(async uid => {
                const userDoc = await getDoc(doc(firestore, 'users', uid));
                return { uid, ...userDoc.data() };
            });

            const userDetailsArray = await Promise.all(userDetailsPromises);
            const userDetailsMap = userDetailsArray.reduce((acc, userDetail) => {
                acc[userDetail.uid] = userDetail;
                return acc;
            }, {});

            setUserDetails(userDetailsMap);
        };

        fetchChats();
    }, []);

    const handleChat = (chat) => {
        const otherUserId = chat.users.find(uid => uid !== auth.currentUser.uid);
        navigation.navigate('Chat', { user: { id: otherUserId, name: userDetails[otherUserId]?.name } });
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={chats}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                    const otherUserId = item.users.find(uid => uid !== auth.currentUser.uid);
                    const otherUserName = userDetails[otherUserId]?.name || 'Usuario';
                    return (
                        <TouchableOpacity onPress={() => handleChat(item)}>
                            <View style={styles.chatItem}>
                                <Text style={styles.chatTitle}>Chat con {otherUserName}</Text>
                            </View>
                        </TouchableOpacity>
                    );
                }}
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
