const baseURL = 'http://localhost/';
async function requestToAPI(method, endpoint, data = null) {
  try {
      let response;

      // Configura la solicitud según el método
      const config = {
          mode: 'no-cors',
          method: method,
          headers: {
              'Content-Type': 'application/json',
          },
      };

      if (data) {
          config.body = JSON.stringify(data);
      }

      // Realiza la solicitud a la API
      response = await fetch(`${baseURL}/${endpoint}`, config);

      // Verifica si la solicitud fue exitosa
      if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(errorMessage || 'Network response was not ok');
      }

      // Devuelve los datos obtenidos de la API
      return await response.json();
  } catch (error) {
      console.error('Error:', error);
      throw error;
  }
}

// Función para obtener todos los usuarios
async function getAllUsers() {
  try {
      const users = await requestToAPI('GET', 'user/all');
      console.log('Usuarios:', users);
      return users;
  } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw error;
  }
}

// Función para obtener un usuario por su ID
async function getUserById(userId) {
  try {
      const user = await requestToAPI('GET', `user/${userId}`);
      console.log('Usuario encontrado:', user);
      return user;
  } catch (error) {
      console.error('Error al obtener usuario por ID:', error);
      throw error;
  }
}

// Función para registrar un nuevo usuario
async function registerUser(email, password) {
  try {
      const data = { email, password };
      await requestToAPI('POST', 'user/register', data);
      console.log('Usuario registrado exitosamente.');
  } catch (error) {
      console.error('Error al registrar usuario:', error);
      throw error;
  }
}

// Función para obtener un token JWT al iniciar sesión
async function login(user, password) {
  try {
      const data = { username: user, password: password };
      const response = await requestToAPI('POST', '/jwtauth/login', data);
      console.log('Token JWT:', response.token);
      return response.token;
  } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error;
  }
}

// Ejemplo de uso
(async () => {
  try {
      await getAllUsers();
      await getUserById(1);
      await registerUser('ejemplo@correo.com', 'contraseña123');
      await login('ejemplo@correo.com', 'contraseña123');
  } catch (error) {
      console.error('Ocurrió un error:', error);
  }
})();

export { getAllUsers, getUserById, registerUser, login }; // Exporta las funciones necesarias

