//src/navigation/BottomTabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import BuscarMatchScreen from '../screens/Match/BuscarMatchScreen';
import PerfilScreen from '../screens/Profile/PerfilScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

// Colores utilizados en HomeScreen para mantener la consistencia
const activeTintColor = '#d32f2f';
const inactiveTintColor = 'gray';

// Componente BottomTabNavigator que define la estructura de la barra de navegación inferior.
const BottomTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({

                headerShown: false, // Esto oculta el encabezado para todas las pantallas en el BottomTabNavigator
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'HomeTab') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'BuscarMatch') {
                        iconName = focused ? 'heart' : 'heart-outline';
                    } else if (route.name === 'Perfil') {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    // Asegúrate de devolver el componente Ionicons con el nombre correcto
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: activeTintColor,
                tabBarInactiveTintColor: inactiveTintColor,
            })}
        >
            {/* Cambia el nombre de la ruta pero usa el parámetro 'options' para mantener la etiqueta como 'Home' */}
            <Tab.Screen
                name="HomeTab" // Nombre de ruta único
                component={HomeScreen}
                options={{
                    tabBarLabel: 'Home', // Etiqueta visual que se muestra en la barra de navegación inferior
                    headerShown: false,
                }}
            />
            <Tab.Screen name="BuscarMatch" component={BuscarMatchScreen} />
            <Tab.Screen name="Perfil" component={PerfilScreen} />
        </Tab.Navigator>
    );
};

export default BottomTabNavigator;