import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import BottomTabNavigator from './BottomTabNavigator';
import AppNavigator from './DrawerNavigator';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
    return (
        <Drawer.Navigator>
            <Drawer.Screen name="Home" component={BottomTabNavigator} />
            {/* Agrega otras pantallas aquí si es necesario */}
        </Drawer.Navigator>
    );
};

export default AppNavigator;
