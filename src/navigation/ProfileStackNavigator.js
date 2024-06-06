// src/navigation/ProfileStackNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import PerfilScreen from '../screens/Profile/PerfilScreen';
import EditarPerfilScreen from '../screens/Profile/EditarPerfilScreen';
import EditarMascotaScreen from '../screens/Profile/EditarMascotaScreen';
import CrearMascotaScreen from '../screens/Profile/CrearMascotaScreen';

const Stack = createStackNavigator();

const ProfileStackNavigator = () => {
  return (
    <Stack.Navigator 
      initialRouteName="Perfil"
      screenOptions={{
        headerShown: false  // Esto ocultará el encabezado para todas las pantallas en este Stack
      }}
    >
      <Stack.Screen name="Perfil" component={PerfilScreen} />
      <Stack.Screen name="EditarPerfil" component={EditarPerfilScreen} />
      <Stack.Screen name="EditarMascota" component={EditarMascotaScreen} />
      <Stack.Screen name="CrearMascota" component={CrearMascotaScreen} />
    </Stack.Navigator>
  );
};

export default ProfileStackNavigator;
