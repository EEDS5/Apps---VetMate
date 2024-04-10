import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import RegistroScreen from './src/screens/RegistroScreen';
import LoginScreen from './src/screens/LoginScreen';
import BuscarMatchScreen from './src/screens/BuscarMatchScreen';
import PerfilScreen from './src/screens/PerfilScreen';
import HistorialMedicoScreen from './src/screens/HistorialMedicoScreen';


const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
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
    </NavigationContainer>
  );
};

export default App;
