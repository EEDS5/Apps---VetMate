import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/img/Logo VetMate.png')} // Asegúrate de que el nombre del archivo sea exacto, sin espacios
        style={styles.logo}
        resizeMode="contain" // Esta prop es opcional, ajusta la imagen dentro de las dimensiones definidas
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
    backgroundColor: '#FFFFFF', // Color de fondo blanco
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
    color: '#c62828', // Color rojo característico
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#d32f2f', // Un tono más oscuro de rojo para los botones
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: '#FFFFFF', // Texto blanco para garantizar legibilidad
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
