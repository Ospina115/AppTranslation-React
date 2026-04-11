import { STORAGE_KEYS, USER_ROLES } from '../utils/constants';
import { generateId } from '../utils/helpers';

const DEFAULT_ADMIN = {
  id: 'admin_001',
  name: 'Administrador',
  email: 'admin@apptranslation.edu',
  password: 'Admin123!',
  role: USER_ROLES.ADMIN,
  createdAt: new Date().toISOString(),
};

const DEFAULT_STUDENT = {
  id: 'student_001',
  name: 'Estudiante Demo',
  email: 'estudiante@apptranslation.edu',
  password: 'Student123!',
  role: USER_ROLES.STUDENT,
  createdAt: new Date().toISOString(),
  lastLogin: null,
};

const DEFAULT_USERS = [DEFAULT_ADMIN, DEFAULT_STUDENT];

function initUsersDB() {
  try {
    const existing = localStorage.getItem(STORAGE_KEYS.USERS_DB);
    if (!existing) {
      localStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(DEFAULT_USERS));
      return;
    }

    const users = JSON.parse(existing);
    const mergedUsers = [...users];

    DEFAULT_USERS.forEach((defaultUser) => {
      const alreadyExists = mergedUsers.some(
        (u) => u.email?.toLowerCase() === defaultUser.email.toLowerCase()
      );
      if (!alreadyExists) {
        mergedUsers.push(defaultUser);
      }
    });

    if (mergedUsers.length !== users.length) {
      localStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(mergedUsers));
    }
  } catch (error) {
    console.error('Error initializing users DB:', error);
  }
}

function getAllUsers() {
  try {
    initUsersDB();
    const data = localStorage.getItem(STORAGE_KEYS.USERS_DB);
    const users = data ? JSON.parse(data) : DEFAULT_USERS;
    return users.map(({ password, ...user }) => user);
  } catch (error) {
    console.error('Error getting users:', error);
    return [];
  }
}

async function register({ name, email, password }) {
  try {
    initUsersDB();
    const data = localStorage.getItem(STORAGE_KEYS.USERS_DB);
    const users = data ? JSON.parse(data) : DEFAULT_USERS;

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
    localStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(users));

    const { password: _, ...safeUser } = newUser;
    return { success: true, user: safeUser };
  } catch (error) {
    console.error('Register error:', error);
    return { success: false, error: 'Error al registrar. Intenta de nuevo.' };
  }
}

async function login({ email, password }) {
  try {
    initUsersDB();
    const data = localStorage.getItem(STORAGE_KEYS.USERS_DB);
    const users = data ? JSON.parse(data) : DEFAULT_USERS;

    const user = users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password
    );

    if (!user) {
      return { success: false, error: 'Correo o contraseña incorrectos.' };
    }

    const updatedUsers = users.map((u) =>
      u.id === user.id ? { ...u, lastLogin: new Date().toISOString() } : u
    );
    localStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(updatedUsers));

    const { password: _, ...safeUser } = user;
    return { success: true, user: safeUser };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Error al iniciar sesión.' };
  }
}

function saveSession(user) {
  try {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } catch (error) {
    console.error('Error saving session:', error);
  }
}

function getSession() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

function logout() {
  try {
    localStorage.removeItem(STORAGE_KEYS.USER);
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
