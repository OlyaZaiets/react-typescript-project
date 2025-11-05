import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: any) => void;
  register: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ( { children } : {children: ReactNode} ) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate();

  const register = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      setUser(userCredential.user);
      console.log(userCredential);
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
    }
  }

    const login = async (email:string, password: string) => {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        setUser(userCredential.user);
        console.log('Logged in:', userCredential.user);
        navigate('/');
      } catch (error: any) {
      console.error('Login error:', error.message);
      throw error;
      }

  } 
  const logout = async () => {
    try {
      console.log('Logout clicked');
      await signOut(auth);
      setUser(null);
      navigate('/');
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user || null)
      setLoading(false);
    });
    return () => unsubscribe();
  }, [])
  
  return (
      <AuthContext.Provider value={{ user, loading, setUser, login, logout, register }}>
        {children}
      </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
} 
