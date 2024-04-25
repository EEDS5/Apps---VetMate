import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Platform } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/img/Logo-VetMate-Rojo.png')}
        style={styles.logo}
      />
      
      <Text style={styles.title}>Bienvenido a VetMate</Text>
      
      <TouchableOpacity
        style={[styles.button, styles.shadow]}
        onPress={() => navigation.navigate('Registro')}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.button, styles.shadow]}
        onPress={() => navigation.navigate('Login')}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.button, styles.shadow]}
        onPress={() => navigation.navigate('BuscarMatch')}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Buscar Match</Text>
      </TouchableOpacity>

      {/* Nuevo botón para el chat */}
      <TouchableOpacity
        style={[styles.button, styles.shadow]}
        onPress={() => navigation.navigate('Chat')}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Mensajes</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#c62828',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#d32f2f',
    paddingVertical: 12,
    paddingHorizontal: 36,
    borderRadius: 25,
    marginVertical: 8,
    minWidth: 250,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: {
        elevation: 5,
      },
    }),
  },
});

export default HomeScreen;
