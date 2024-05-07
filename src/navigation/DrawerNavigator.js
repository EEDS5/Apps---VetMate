import React, { useEffect, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import BottomTabNavigator from './BottomTabNavigator';
import RegistroScreen from '../screens/Auth/RegistroScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import VetChatScreen from '../screens/Match/VetChatScreen';

const Drawer = createDrawerNavigator();

const getHeaderTitle = (route) => {
    const routeName = route.state?.routes[route.state.index]?.name ?? route.params?.screen ?? 'Home';
    return routeName === 'Home' ? '' : routeName;
};

const DrawerNavigator = () => {
    const [user, setUser] = useState(null);
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, setUser);
        return unsubscribe; // Limpia la suscripción al desmontar
    }, []);

    return (
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
            {!user ? (
                <>
                    <Drawer.Screen name="Registro" component={RegistroScreen} />
                    <Drawer.Screen name="Login" component={LoginScreen} />
                </>
            ) : (
                <Drawer.Screen name="VetChatGPT" component={VetChatScreen} />
            )}
        </Drawer.Navigator>
    );
};

export default DrawerNavigator;
