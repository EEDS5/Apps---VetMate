//src/context/UserContext/userReducer.js

// Este reducer maneja el estado global relacionado con el perfil del usuario.
export const userReducer = (state, action) => {
    switch (action.type) {
      case 'UPDATE_PROFILE':
        // La acción UPDATE_PROFILE se encarga de actualizar el estado con la nueva información del perfil
        return {
          ...state,
          userProfile: { ...state.userProfile, ...action.payload },
        };
      // Se podrían agregar más casos para diferentes tipos de acciones
      default:
        // Si la acción no es reconocida, se devuelve el estado actual sin cambios.
        return state;
    }
  };
   