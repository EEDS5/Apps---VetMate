import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const BuscarMatchScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Buscar Match</Text>
            {/* Aquí puedes agregar el resto de los componentes de tu pantalla */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
});

export default BuscarMatchScreen;