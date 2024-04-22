// src/navigation/AppNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import RegistroScreen from '../screens/Auth/RegistroScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import BuscarMatchScreen from '../screens/Match/BuscarMatchScreen';
import PerfilScreen from '../screens/Profile/PerfilScreen';
import HistorialMedicoScreen from '../screens/Profile/HistorialMedicoScreen';

// Crea el stack navigator que manejará las transiciones entre pantallas.
const Stack = createStackNavigator();

// Componente AppNavigator que define la estructura de navegación de la aplicación.
const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'Inicio' }} 
      />
      <Stack.Screen 
        name="Registro" 
        component={RegistroScreen} 
        options={{ title: 'Registro' }} 
      />
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
        options={{ title: 'Iniciar Sesión' }} 
      />
      <Stack.Screen 
        name="BuscarMatch" 
        component={BuscarMatchScreen} 
        options={{ title: 'Buscar Match' }} 
      />
      <Stack.Screen 
        name="Perfil" 
        component={PerfilScreen} 
        options={{ title: 'Mi Perfil' }} 
      />
      <Stack.Screen 
        name="HistorialMedico" 
        component={HistorialMedicoScreen} 
        options={{ title: 'Historial Médico' }} 
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;