import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import BuscarMatchScreen from '../screens/Match/BuscarMatchScreen';
import ProfileStackNavigator from './ProfileStackNavigator';
import ChatStackNavigator from './ChatStackNavigator'; // Importa el nuevo stack de chat
import { Ionicons } from '@expo/vector-icons';
import { getAuth, onAuthStateChanged } from 'firebase/auth'; 

const Tab = createBottomTabNavigator();

const activeTintColor = '#d32f2f';
const inactiveTintColor = 'gray';

const BottomTabNavigator = () => {
    const [user, setUser] = useState(null);
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, setUser);
        return unsubscribe; // Limpia la suscripción al desmontar
    }, []);

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false, 
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'HomeTab') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'BuscarMatch') {
                        iconName = focused ? 'heart' : 'heart-outline';
                    } else if (route.name === 'PerfilTab') {
                        iconName = focused ? 'person' : 'person-outline';
                    } else if (route.name === 'ChatTab') {
                        iconName = focused ? 'chatbox' : 'chatbox-outline';
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: activeTintColor,
                tabBarInactiveTintColor: inactiveTintColor,
                tabBarVisible: route.name === 'HomeTab' || user !== null,
            })}
        >
            <Tab.Screen
                name="HomeTab"
                component={HomeScreen}
                options={{
                    tabBarLabel: 'Home',
                }}
            />
            {user && (
                <>
                
                    <Tab.Screen name="BuscarMatch" component={BuscarMatchScreen} options={{ tabBarLabel: 'Match' }} />
                    <Tab.Screen
                        name="ChatTab"
                        component={ChatStackNavigator} // Componente del stack de chat
                        options={{ tabBarLabel: 'Chat' }}
                    />
                    <Tab.Screen
                        name="PerfilTab"
                        component={ProfileStackNavigator} 
                        options={{ tabBarLabel: 'Perfil' }}
                    />
                    
                </>
            )}
        </Tab.Navigator>
    );
};

export default BottomTabNavigator;
