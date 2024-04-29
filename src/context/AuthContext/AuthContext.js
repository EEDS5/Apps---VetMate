import React, { createContext, useReducer, useContext } from 'react';
import auth from '@react-native-firebase/auth';

const AuthContext = createContext();

const authReducer = (state, action) => {
    switch (action.type) {
        case 'SIGN_IN':
            return { ...state, user: action.payload };
        case 'SIGN_OUT':
            return { ...state, user: null };
        default:
            return state;
    }
};

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, { user: null });

    const signIn = async (email, password) => {
        try {
            const result = await auth().signInWithEmailAndPassword(email, password);
            dispatch({ type: 'SIGN_IN', payload: result.user });
        } catch (error) {
            console.error(error);
        }
    };

    const signOut = async () => {
        try {
            await auth().signOut();
            dispatch({ type: 'SIGN_OUT' });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <AuthContext.Provider value={{ user: state.user, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
