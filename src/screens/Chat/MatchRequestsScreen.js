// src/screens/Chat/MatchRequestsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { auth, firestore } from '../../firebase/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';

const MatchRequestsScreen = ({ navigation }) => {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
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

        fetchRequests();
    }, []);

    const handleAccept = async (requestId, senderId) => {
        try {
            await updateDoc(doc(firestore, 'MatchRequests', requestId), { status: 'accepted' });
            const chatId = [auth.currentUser.uid, senderId].sort().join('_');
            await updateDoc(doc(firestore, 'chats', chatId), {
                users: arrayUnion(auth.currentUser.uid, senderId),
                createdAt: serverTimestamp(),
            });
            navigation.navigate('Chat', { user: { id: senderId } });
        } catch (error) {
            console.error("Error al aceptar la solicitud:", error);
        }
    };

    const handleReject = async (requestId) => {
        try {
            await deleteDoc(doc(firestore, 'MatchRequests', requestId));
            Alert.alert("Solicitud rechazada");
        } catch (error) {
            console.error("Error al rechazar la solicitud:", error);
        }
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={requests}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.requestItem}>
                        <Text style={styles.requestText}>Solicitud de {item.senderId} para {item.dogId}</Text>
                        <View style={styles.buttons}>
                            <TouchableOpacity
                                style={styles.acceptButton}
                                onPress={() => handleAccept(item.id, item.senderId)}
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
