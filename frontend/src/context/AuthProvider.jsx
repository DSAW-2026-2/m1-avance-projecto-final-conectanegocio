import { useState } from 'react';
import { demoUsers } from '../data/demoUsers.js';
import { createRegisteredAccount, findAccount } from '../utils/authService.js';
import { loadAuthState, saveRegisteredUsers, saveSession } from '../utils/authStorage.js';
import { AuthContext } from './AuthContext.js';

export default function AuthProvider({ children }) {
  const [auth, setAuth] = useState(loadAuthState);
  const currentUser = [...demoUsers, ...auth.registeredUsers]
    .find((user) => user.id === auth.currentUserId) ?? null;

  function register(input) {
    const result = createRegisteredAccount(input, auth.registeredUsers);
    if (!result.ok) return result;
    const registeredUsers = [...auth.registeredUsers, result.user];
    const persisted = saveRegisteredUsers(registeredUsers);
    setAuth((previous) => ({ ...previous, registeredUsers, persistenceAvailable: persisted }));
    return { ok: true, persistenceWarning: !persisted };
  }

  function login(email, password) {
    const user = findAccount(email, password, auth.registeredUsers);
    if (!user) return { ok: false, message: 'Correo o contraseña incorrectos.' };
    const persisted = saveSession(user.id);
    setAuth((previous) => ({ ...previous, currentUserId: user.id, persistenceAvailable: persisted }));
    return { ok: true, user, persistenceWarning: !persisted };
  }

  function logout() {
    const persisted = saveSession(null);
    setAuth((previous) => ({ ...previous, currentUserId: null, persistenceAvailable: persisted }));
    return { persistenceWarning: !persisted };
  }

  const value = { currentUser, registeredUsers: auth.registeredUsers, login, register, logout,
    persistenceAvailable: auth.persistenceAvailable };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
