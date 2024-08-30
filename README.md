### Documentación de la Aplicación Móvil VetMate

#### Introducción
VetMate, una fusión de "Veterinary" (veterinaria) y "Mate" (compañero), es una aplicación móvil innovadora que facilita la búsqueda de parejas compatibles para perros, integrando conocimientos veterinarios para asegurar la salud y compatibilidad genética de los animales. Destinada a propietarios de mascotas que buscan el bienestar y una adecuada reproducción para sus perros, VetMate ofrece una interfaz amigable y funcionalidades avanzadas basadas en tecnología de punta.

#### Características Principales
- **Registro y Manejo de Perfiles**: Los usuarios pueden crear y gestionar perfiles tanto para ellos como para sus mascotas, incluyendo detalles como raza, edad y registros médicos.
- **Algoritmo de Matching**: Implementación de un algoritmo avanzado para sugerir parejas potenciales basado en criterios genéticos y de compatibilidad.
- **Intercambio de Información Médica**: Capacidad para cargar y compartir información médica y genética de las mascotas, asegurando transparencia y decisiones informadas.

#### Configuración del Entorno
Para contribuir al desarrollo de VetMate, es necesario configurar el entorno de desarrollo siguiendo estos pasos:
1. **Instalación de Node.js y npm**: Asegúrate de tener instalado Node.js y npm, ya que son esenciales para manejar las dependencias del proyecto.
2. **Instalación de Expo CLI**: VetMate utiliza Expo para la gestión del desarrollo y pruebas en dispositivos móviles. Instala Expo CLI ejecutando `npm install -g expo-cli`.
3. **Clonar y Configurar el Proyecto**: Clona el repositorio del proyecto y ejecuta `npm install` para instalar todas las dependencias requeridas.

#### Estructura del Proyecto
El proyecto está organizado en varias carpetas principales:
- **src**: Contiene todos los componentes, pantallas, y la lógica de navegación.
- **assets**: Almacena recursos estáticos como imágenes y estilos globales.
- **context**: Define el contexto de React utilizado para manejar el estado global de la aplicación.
- **services**: Incluye la lógica para interactuar con APIs externas y servicios de backend.

#### Desarrollo
##### Navegación
VetMate utiliza `React Navigation` para la gestión de la navegación en la aplicación, con una combinación de `DrawerNavigator`, `BottomTabNavigator`, y `ProfileStackNavigator`.

###### DrawerNavigator
Configurado en `src/navigation/DrawerNavigator.js`, maneja la navegación principal a través de un menú lateral que permite acceso a las pantallas de inicio, registro, login, y chat veterinario. Aquí se configura cada pantalla como un `Drawer.Screen`, vinculando cada una a su respectiva componente.

###### BottomTabNavigator
En `src/navigation/BottomTabNavigator.js`, gestiona la navegación entre las pantallas de inicio, búsqueda de matches y perfil mediante una barra de pestañas en la parte inferior de la interfaz. Se utiliza `createBottomTabNavigator` para definir cada pestaña y asociarla con una pantalla específica.


###### ProfileStackNavigator
Localizado

 en `src/navigation/ProfileStackNavigator.js`, controla la navegación entre las pantallas relacionadas con el perfil del usuario y la edición de datos de las mascotas. Utiliza `createStackNavigator` para manejar la transición entre pantallas de perfil y edición.

#### Pantallas

Cada pantalla en VetMate está diseñada para ofrecer funcionalidades específicas que permiten a los usuarios interactuar efectivamente con la aplicación. A continuación se detallan las características y funcionalidades principales de cada pantalla.

##### Inicio (HomeScreen)
La pantalla de inicio es el punto de entrada a VetMate después de la autenticación o registro. Proporciona accesos directos para navegar a las principales funciones de la aplicación como registrarse, iniciar sesión y buscar matches. Se destaca por un diseño amigable que incluye el logotipo de VetMate y botones prominentes que guían al usuario a través de las opciones disponibles.

##### Registro (RegistroScreen)
La pantalla de registro permite a los usuarios crear una nueva cuenta en VetMate. Los campos requeridos incluyen nombre, correo electrónico y contraseña. Se implementan validaciones para asegurar que el correo electrónico tenga un formato adecuado y que la contraseña cumpla con los requisitos mínimos de seguridad. Esta pantalla es crucial para capturar la información esencial de los usuarios y facilitar la creación de perfiles para sus mascotas en etapas posteriores.

##### Login (LoginScreen)
En la pantalla de login, los usuarios pueden acceder a sus cuentas proporcionando su correo electrónico y contraseña. Incluye validaciones para verificar que los campos no estén vacíos y que el formato del correo sea correcto. En caso de credenciales inválidas o errores de conexión, se muestra un mensaje adecuado para informar al usuario del problema. Esta pantalla es fundamental para el control de acceso a la aplicación.

##### Buscar Match (BuscarMatchScreen)
Esta pantalla es el corazón de la funcionalidad de matchmaking de VetMate. Muestra perfiles de perros en formato de tarjetas deslizables que los usuarios pueden aceptar o rechazar. Implementa un algoritmo de matching basado en criterios genéticos y de compatibilidad, presentando solo aquellas opciones que tienen un alto grado de coincidencia con las características de la mascota del usuario. Los usuarios pueden interactuar con los perfiles mediante botones de 'like' o 'dislike', influenciando el algoritmo de recomendaciones futuras.

##### Mi Perfil (PerfilScreen)
La pantalla de perfil del usuario muestra información detallada del usuario y sus mascotas. Desde aquí, los usuarios pueden acceder a la funcionalidad para editar sus datos personales o la información de sus mascotas. También proporciona un resumen visual de la información del perfil, mejorando la experiencia de usuario al permitir una gestión fácil y directa de los datos personales y de las mascotas.

##### Editar Perfil (EditarPerfilScreen)
En la pantalla de editar perfil, los usuarios pueden actualizar su información personal, como nombre y correo electrónico. La interfaz proporciona formularios sencillos para la entrada de datos y botones para guardar los cambios realizados, facilitando a los usuarios mantener su información actualizada y relevante.

##### Editar Mascota (EditarMascotaScreen)
Esta pantalla ofrece a los usuarios la capacidad de actualizar la información de sus mascotas, como el nombre, la raza y añadir fotos. Incluye funcionalidades para tomar fotos con la cámara o seleccionarlas de la galería del dispositivo, integrando aspectos de interacción multimedia que enriquecen la experiencia del usuario al personalizar los perfiles de sus mascotas.

##### Vet Chat (VetChatScreen)
Un chat interactivo 
<Completar esta sección>

### Código Fuente Ejemplo

#### Función de Login
En la pantalla de login, se implementa un método de autenticación que incluye validación de los campos de correo electrónico y contraseña para garantizar que se cumplen los criterios básicos antes de enviar una solicitud al servidor.

```javascript
// LoginScreen.js
const handleLogin = () => {
    if (!email || !password) {
        alert('Por favor, completa todos los campos.');
        return;
    }
    if (!email.includes('@')) {
        alert('Por favor, introduce un correo electrónico válido.');
        return;
    }
    // Simulando una llamada al backend
    fetch('https://tuapi.com/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Inicio de sesión exitoso');
        } else {
            throw new Error(data.message || 'Error al iniciar sesión');
        }
    })
    .catch(error => {
        alert(error.message);
    });
};
```

#### Función de Registro
El proceso de registro recoge información esencial del usuario, como nombre, correo electrónico y contraseña, realizando verificaciones para asegurar que los datos son válidos antes de crear la cuenta en la base de datos.

```javascript
// RegistroScreen.js
const handleSignUp = () => {
    if (!name || !email || !password) {
        alert('Por favor, completa todos los campos.');
        return;
    }
    if (!email.includes('@')) {
        alert('Por favor, introduce un correo electrónico válido.');
        return;
    }
    if (password.length < 6) {
        alert('La contraseña debe tener al menos 6 caracteres.');
        return;
    }

    auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log('Registro exitoso', userCredential);
        })
        .catch(error => {
            alert(error.message);
        });
};
```
