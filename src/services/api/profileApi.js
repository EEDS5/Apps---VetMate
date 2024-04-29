// src/services/api/profileApi.js
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const api = axios.create({
  baseURL: "http://localhost:3000" // Asegúrate de que esta URL sea la adecuada para tu API simulada.
});

// Crear el adaptador mock para axios
const mock = new MockAdapter(api);

// Simular la respuesta para obtener el perfil
mock.onGet("/profile").reply(200, {
  username: 'doglover',
  email: 'doglover@example.com',
  dog: {
    name: 'Rex',
    breed: 'Labrador',
    age: 3,
    medicalHistory: []
  }
});

// Simular la respuesta para actualizar el perfil
mock.onPost("/profile/update").reply(200, {
  message: "Perfil actualizado con éxito!"
});

// Exportar la instancia de axios para ser utilizada en lugar de fetch
export default api;