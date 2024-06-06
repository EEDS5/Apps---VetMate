import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { auth, firestore } from '../../firebase/firebase';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';

const ChatListScreen = ({ navigation }) => {
    const [chats, setChats] = useState([]);
    const [userDetails, setUserDetails] = useState({});
    const [refreshing, setRefreshing] = useState(false);

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

    useEffect(() => {
        fetchChats();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchChats().then(() => setRefreshing(false));
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
                        <TouchableOpacity onPress={() => handleChat(item)} style={styles.chatItemContainer}>
                            <View style={styles.chatItem}>
                                <Text style={styles.chatTitle}>Chat con {otherUserName}</Text>
                            </View>
                        </TouchableOpacity>
                    );
                }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#e9ecef',
    },
    chatItemContainer: {
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    chatItem: {
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        borderColor: '#ccc',
        borderWidth: 1,
    },
    chatTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#495057',
    },
});

export default ChatListScreen;
