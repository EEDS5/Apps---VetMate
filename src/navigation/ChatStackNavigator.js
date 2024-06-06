// src/navigation/ChatStackNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ChatListScreen from '../screens/Chat/ChatListScreen';
import ChatScreen from '../screens/Chat/ChatScreen';
import MatchRequestsScreen from '../screens/Chat/MatchRequestsScreen';

const Stack = createStackNavigator();

const ChatStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="ChatList" component={ChatListScreen} options={{ title: 'Chats' }} />
            <Stack.Screen name="Chat" component={ChatScreen} options={{ title: 'Chat' }} />
            <Stack.Screen name="MatchRequests" component={MatchRequestsScreen} options={{ title: 'Solicitudes' }} />
        </Stack.Navigator>
    );
};

export default ChatStackNavigator;
