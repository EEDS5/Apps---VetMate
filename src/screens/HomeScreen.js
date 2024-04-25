//src/screens/HomeScreen.js
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
      <Text style={styles.subtitle}>Tu compañero ideal para encontrar la pareja perfecta para tu perro</Text>
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
        onPress={() => navigation.navigate('VetChat')}
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
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#c62828',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
    textAlign: 'center',
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
