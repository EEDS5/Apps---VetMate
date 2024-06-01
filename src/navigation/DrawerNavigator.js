// src/navigation/DrawerNavigator.js
import React, { useEffect, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import BottomTabNavigator from './BottomTabNavigator';
import RegistroScreen from '../screens/Auth/RegistroScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import VetChatScreen from '../screens/Match/VetChatScreen';
import HomeScreen from '../screens/HomeScreen'; // Asegúrate de importar tu pantalla de inicio

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const DrawerContent = () => (
    <Drawer.Navigator
        screenOptions={{
            headerTitle: getHeaderTitle,
            drawerActiveTintColor: '#d32f2f',
            drawerInactiveTintColor: 'gray',
            drawerActiveBackgroundColor: '#ffebee',
            drawerInactiveBackgroundColor: 'transparent',
            itemStyle: { marginVertical: 5 },
        }}
    >
        <Drawer.Screen
            name="Home"
            component={BottomTabNavigator}
        />
        <Drawer.Screen name="VetChatGPT" component={VetChatScreen} />
    </Drawer.Navigator>
);

const AuthStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Registro" component={RegistroScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
);

const getHeaderTitle = (route) => {
    const routeName = route.state?.routes[route.state.index]?.name ?? route.params?.screen ?? 'Home';
    return routeName === 'Home' ? '' : routeName;
};

const AppNavigator = () => {
    const [user, setUser] = useState(undefined); // undefined para el estado inicial
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });
        return unsubscribe; // Limpia la suscripción al desmontar
    }, []);

    if (user === undefined) {
        // Puedes agregar un indicador de carga aquí si lo deseas
        return null;
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {user ? (
                <Stack.Screen name="Main" component={DrawerContent} />
            ) : (
                <Stack.Screen name="Auth" component={AuthStack} />
            )}
        </Stack.Navigator>
    );
};

export default AppNavigator;
