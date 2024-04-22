// src/navigation/DrawerNavigator.js
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import BottomTabNavigator from './BottomTabNavigator';
import RegistroScreen from '../screens/Auth/RegistroScreen';
import LoginScreen from '../screens/Auth/LoginScreen';

const Drawer = createDrawerNavigator();

// La función getHeaderTitle permite establecer un título dinámico en base a la ruta actual
const getHeaderTitle = (route) => {
    // Obtienes el nombre de la ruta activa
    const routeName = route.state?.routes[route.state.index]?.name ?? route.params?.screen ?? 'Home';

    // Si la ruta activa es 'Home', devuelve una cadena vacía, de lo contrario devuelve el nombre de la ruta
    return routeName === 'Home' ? '' : routeName;
};

const DrawerNavigator = () => {
    return (
        <Drawer.Navigator
            screenOptions={{
                headerTitle: getHeaderTitle, // Título dinámico para el encabezado
                drawerActiveTintColor: '#d32f2f', // Color del texto para el elemento activo
                drawerInactiveTintColor: 'gray', // Color del texto para los elementos inactivos
                drawerActiveBackgroundColor: '#ffebee', // Un color de fondo suave para el elemento activo que complementa el esquema de colores
                drawerInactiveBackgroundColor: 'transparent', // Mantenemos los elementos inactivos transparentes
                itemStyle: { marginVertical: 5 }, // Estilo para cada elemento
            }}
        >
            <Drawer.Screen
                name="Home"
                component={BottomTabNavigator}
            />
            <Drawer.Screen name="Registro" component={RegistroScreen} />
            <Drawer.Screen name="Login" component={LoginScreen} />
            {/* Más Drawer.Screen según sea necesario */}
        </Drawer.Navigator>
    );
};

export default DrawerNavigator;