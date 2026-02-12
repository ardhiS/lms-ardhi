import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

// Demo users for testing without backend
const DEMO_USERS = [
  {
    id: 'demo-user-1',
    name: 'Demo Student',
    email: 'demo@lms.com',
    password: 'demo123',
    role: 'student',
    created_at: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'demo-user-2',
    name: 'Demo Instructor',
    email: 'instructor@lms.com',
    password: 'instructor123',
    role: 'instructor',
    created_at: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'demo-user-3',
    name: 'Demo Admin',
    email: 'admin@lms.com',
    password: 'admin123',
    role: 'admin',
    created_at: '2024-01-01T00:00:00.000Z',
  },
];

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing token on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      const isDemo = localStorage.getItem('isDemo') === 'true';

      if (token && storedUser) {
        // Demo mode: just restore user from localStorage
        if (isDemo) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (e) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('isDemo');
          }
          setLoading(false);
          return;
        }

        // Real mode: verify token with backend
        try {
          const response = await api.getProfile();
          setUser(response.data.user);
        } catch (err) {
          // Token invalid, clear storage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('isDemo');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);

      // Try backend first
      try {
        const response = await api.login(email, password);
        const { user, token } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('isDemo', 'false');
        setUser(user);

        return { success: true };
      } catch (backendErr) {
        // Backend failed, try demo login
        const demoUser = DEMO_USERS.find(
          (u) =>
            u.email.toLowerCase() === email.toLowerCase() &&
            u.password === password,
        );

        if (demoUser) {
          const { password: _, ...userWithoutPassword } = demoUser;
          const demoToken = 'demo-token-' + demoUser.id;

          localStorage.setItem('token', demoToken);
          localStorage.setItem('user', JSON.stringify(userWithoutPassword));
          localStorage.setItem('isDemo', 'true');
          setUser(userWithoutPassword);

          return { success: true, isDemo: true };
        }

        // Neither backend nor demo login worked
        throw backendErr;
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const register = async (name, email, password, role = 'student') => {
    try {
      setError(null);

      // Try backend first
      try {
        const response = await api.register(name, email, password, role);
        const { user, token } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('isDemo', 'false');
        setUser(user);

        return { success: true };
      } catch (backendErr) {
        // Backend failed, create demo user
        const newUser = {
          id: 'demo-user-' + Date.now(),
          name,
          email,
          role,
          created_at: new Date().toISOString(),
        };
        const demoToken = 'demo-token-' + newUser.id;

        localStorage.setItem('token', demoToken);
        localStorage.setItem('user', JSON.stringify(newUser));
        localStorage.setItem('isDemo', 'true');
        setUser(newUser);

        return { success: true, isDemo: true };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isDemo');
    setUser(null);
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';
  const isInstructor = user?.role === 'instructor' || user?.role === 'admin';
  const isDemo = localStorage.getItem('isDemo') === 'true';

  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    isInstructor,
    isDemo,
    login,
    register,
    logout,
    setError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
