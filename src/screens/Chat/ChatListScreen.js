// src/screens/Chat/ChatListScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { auth, firestore } from '../../firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';

const ChatListScreen = ({ navigation }) => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const querySnapshot = await getDocs(collection(firestore, 'users'));
            const usersList = [];
            querySnapshot.forEach((doc) => {
                if (doc.id !== auth.currentUser.uid) {
                    usersList.push({ id: doc.id, ...doc.data() });
                }
            });
            setUsers(usersList);
        };

        fetchUsers();
    }, []);

    const handleChat = (user) => {
        navigation.navigate('Chat', { user });
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={users}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleChat(item)}>
                        <View style={styles.userItem}>
                            <Text style={styles.userName}>{item.name}</Text>
                            <Text style={styles.userEmail}>{item.email}</Text>
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
    userItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    userEmail: {
        fontSize: 14,
        color: '#555',
    },
});

export default ChatListScreen;
