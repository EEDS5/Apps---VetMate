import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, RefreshControl } from 'react-native';
import { auth, firestore } from '../../firebase/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, where, addDoc, getDoc, serverTimestamp } from 'firebase/firestore';

const MatchRequestsScreen = ({ navigation }) => {
    const [requests, setRequests] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const fetchRequests = async () => {
        const user = auth.currentUser;
        if (!user) {
            console.error('Usuario no autenticado');
            return;
        }

        const q = query(collection(firestore, 'MatchRequests'), where('receiverId', '==', user.uid), where('status', '==', 'pending'));
        const querySnapshot = await getDocs(q);
        const requestsList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        setRequests(requestsList);
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleAccept = async (requestId, senderId, dogId) => {
        try {
            await updateDoc(doc(firestore, 'MatchRequests', requestId), { status: 'accepted' });
            const chatId = [auth.currentUser.uid, senderId].sort().join('_');

            const chatRef = doc(firestore, 'chats', chatId);
            const chatDoc = await getDoc(chatRef);

            if (!chatDoc.exists()) {
                await setDoc(chatRef, {
                    users: [auth.currentUser.uid, senderId],
                    createdAt: serverTimestamp(),
                    chatId
                });
            }

            const senderDoc = await getDoc(doc(firestore, 'users', senderId));
            const senderName = senderDoc.data().name;

            const dogDoc = await getDoc(doc(firestore, 'Dogs', dogId));
            const dogData = dogDoc.data();

            navigation.navigate('Chat', { user: { id: senderId, name: senderName }, dog: dogData });
        } catch (error) {
            console.error("Error al aceptar la solicitud:", error);
        }
    };

    const handleReject = async (requestId) => {
        try {
            await deleteDoc(doc(firestore, 'MatchRequests', requestId));
            Alert.alert("Solicitud rechazada");
            fetchRequests();
        } catch (error) {
            console.error("Error al rechazar la solicitud:", error);
        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchRequests().then(() => setRefreshing(false));
    }, []);

    return (
        <View style={styles.container}>
            <FlatList
                data={requests}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.requestItem}>
                        <Text style={styles.requestText}>Solicitud de {item.senderName} para tu perro {item.dogName} ({item.dogBreed})</Text>
                        <View style={styles.buttons}>
                            <TouchableOpacity
                                style={styles.acceptButton}
                                onPress={() => handleAccept(item.id, item.senderId, item.dogId)}
                            >
                                <Text style={styles.buttonText}>Aceptar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.rejectButton}
                                onPress={() => handleReject(item.id)}
                            >
                                <Text style={styles.buttonText}>Rechazar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
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
        backgroundColor: '#fff',
    },
    requestItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 10,
    },
    requestText: {
        fontSize: 16,
        marginBottom: 10,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    acceptButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
    },
    rejectButton: {
        backgroundColor: '#f44336',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default MatchRequestsScreen;
