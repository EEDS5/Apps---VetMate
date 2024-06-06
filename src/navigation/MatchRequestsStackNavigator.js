import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MatchRequestsScreen from '../screens/Chat/MatchRequestsScreen';
import ChatScreen from '../screens/Chat/ChatScreen'; 

const Stack = createStackNavigator();

const MatchRequestsStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="MatchRequests" component={MatchRequestsScreen} options={{ title: 'Solicitudes' }} />
            <Stack.Screen name="Chat" component={ChatScreen} options={{ title: 'Chat' }} />
        </Stack.Navigator>
    );
};

export default MatchRequestsStackNavigator;
