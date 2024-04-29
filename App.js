// App.js
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { UserProvider } from './src/context/UserContext/UserContext';

// Componente principal App que configura el contenedor de navegación y la barra de estado.
const App = () => {
  return (
    <UserProvider>
      
      <NavigationContainer>
        <StatusBar style="auto" />
        <AppNavigator />
      </NavigationContainer>

    </UserProvider>
  );
};

export default App;