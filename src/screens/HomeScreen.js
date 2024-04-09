import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require('assets\svg\logo-vetmate-1.svg')} // Asegúrate de cambiar esto por la ruta real de tu logo
        style={styles.logo}
      />
      <Text style={styles.title}>Bienvenido a VetMate</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Registro')}
      >
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('BuscarMatch')}
      >
        <Text style={styles.buttonText}>Buscar Match</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // color de fondo principal
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4C9A2A', // un color que contraste bien con el logo
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#7BCDBA', // un color secundario del logo
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: '#FFFFFF', // un color que asegure legibilidad
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
