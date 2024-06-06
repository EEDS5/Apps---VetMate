// src/navigation/MatchRequestsStackNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MatchRequestsScreen from '../screens/Chat/MatchRequestsScreen';

const Stack = createStackNavigator();

const MatchRequestsStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="MatchRequests"
                component={MatchRequestsScreen}
                options={{ title: 'Solicitudes de Match' }}
            />
        </Stack.Navigator>
    );
};

export default MatchRequestsStackNavigator;
