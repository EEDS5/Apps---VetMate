//src/context/UserContext/UserContext.js
// En UserContext.js, dentro de UserProvider
import React, { createContext, useReducer, useEffect } from 'react';
import { userReducer } from './userReducer';
import api from '../../services/api/profileApi'; // Asegúrate de que la ruta sea correcta

const initialState = {
  userProfile: {
    username: '',
    email: '',
    dog: {
      name: '',
      breed: '',
      age: 0,
      medicalHistory: [],
    },
  },
};

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/profile");
        if (response.data) {
          dispatch({ type: 'UPDATE_PROFILE', payload: response.data });
        }
      } catch (error) {
        console.error("Error al cargar el perfil:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <UserContext.Provider value={{ ...state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};

