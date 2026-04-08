import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, USER_ROLES } from '../utils/constants';
import { generateId } from '../utils/helpers';

// Usuario administrador por defecto
const DEFAULT_ADMIN = {
  id: 'admin_001',
  name: 'Administrador',
  email: 'admin@apptranslation.edu',
  password: 'Admin123!',
  role: USER_ROLES.ADMIN,
  createdAt: new Date().toISOString(),
};

/**
 * Inicializa la base de datos de usuarios con el admin por defecto.
 */
async function initUsersDB() {
  try {
    const existing = await AsyncStorage.getItem(STORAGE_KEYS.USERS_DB);
    if (!existing) {
      await AsyncStorage.setItem(
        STORAGE_KEYS.USERS_DB,
        JSON.stringify([DEFAULT_ADMIN])
      );
    }
  } catch (error) {
    console.error('Error initializing users DB:', error);
  }
}

/**
 * Obtiene todos los usuarios (solo para admin).
 */
async function getAllUsers() {
  try {
    await initUsersDB();
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USERS_DB);
    const users = data ? JSON.parse(data) : [DEFAULT_ADMIN];
    // Excluir contraseñas en la respuesta
    return users.map(({ password, ...user }) => user);
  } catch (error) {
    console.error('Error getting users:', error);
    return [];
  }
}

/**
 * Registra un nuevo estudiante.
 */
async function register({ name, email, password }) {
  try {
    await initUsersDB();
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USERS_DB);
    const users = data ? JSON.parse(data) : [DEFAULT_ADMIN];

    // Verificar si el email ya existe
    const emailExists = users.some(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (emailExists) {
      return { success: false, error: 'Este correo ya está registrado.' };
    }

    const newUser = {
      id: generateId(),
      name,
      email: email.toLowerCase(),
      password,
      role: USER_ROLES.STUDENT,
      createdAt: new Date().toISOString(),
      lastLogin: null,
    };

    users.push(newUser);
    await AsyncStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(users));

    const { password: _, ...safeUser } = newUser;
    return { success: true, user: safeUser };
  } catch (error) {
    console.error('Register error:', error);
    return { success: false, error: 'Error al registrar. Intenta de nuevo.' };
  }
}

/**
 * Inicia sesión con email y contraseña.
 */
async function login({ email, password }) {
  try {
    await initUsersDB();
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USERS_DB);
    const users = data ? JSON.parse(data) : [DEFAULT_ADMIN];

    const user = users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password
    );

    if (!user) {
      return { success: false, error: 'Correo o contraseña incorrectos.' };
    }

    // Actualizar último login
    const updatedUsers = users.map((u) =>
      u.id === user.id ? { ...u, lastLogin: new Date().toISOString() } : u
    );
    await AsyncStorage.setItem(
      STORAGE_KEYS.USERS_DB,
      JSON.stringify(updatedUsers)
    );

    const { password: _, ...safeUser } = user;
    return { success: true, user: safeUser };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Error al iniciar sesión.' };
  }
}

/**
 * Guarda la sesión del usuario en almacenamiento local.
 */
async function saveSession(user) {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } catch (error) {
    console.error('Error saving session:', error);
  }
}

/**
 * Recupera la sesión guardada.
 */
async function getSession() {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

/**
 * Cierra la sesión del usuario.
 */
async function logout() {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER);
  } catch (error) {
    console.error('Logout error:', error);
  }
}

const authService = {
  register,
  login,
  logout,
  saveSession,
  getSession,
  getAllUsers,
  initUsersDB,
};

export default authService;
