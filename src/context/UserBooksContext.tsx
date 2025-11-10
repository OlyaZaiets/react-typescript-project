import { createContext, useContext, useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';


interface UserBooksContextType {
  readBooks: Set<string>;
  favoriteBooks: Set<string>;
  plannedBooks: Set<string>;
  loadingUserBooks: boolean;
}

const UserBooksContext = createContext<UserBooksContextType | null>(null);

export const UserBooksProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [readBooks, setReadBooks] = useState<Set<string>>(new Set());
  const [favoriteBooks, setFavoriteBooks] = useState<Set<string>>(new Set());
  const [plannedBooks, setPlannedBooks] = useState<Set<string>>(new Set());
  const [loadingUserBooks, setLoadingUserBooks] = useState(true);

  useEffect(() => {
    if (!user) {
      setReadBooks(new Set());
      setFavoriteBooks(new Set());
      setPlannedBooks(new Set());
      setLoadingUserBooks(false);
      return;
    }

    setLoadingUserBooks(true);

    const readRef = collection(db, 'users', user.uid, 'read');
    const favRef = collection(db, 'users', user.uid, 'favorite');
    const planRef = collection(db, 'users', user.uid, 'toRead');

    const unsubRead = onSnapshot(readRef, (snap) => {
      setReadBooks(new Set(snap.docs.map((doc) => doc.id)));
    });
    const unsubFav = onSnapshot(favRef, (snap) => {
      setFavoriteBooks(new Set(snap.docs.map((doc) => doc.id)));
    });
    const unsubPlan = onSnapshot(planRef, (snap) => {
      setPlannedBooks(new Set(snap.docs.map((doc) => doc.id)));
    });

    setLoadingUserBooks(false);

    return () => {
      unsubRead();
      unsubFav();
      unsubPlan();
    };
  }, [user]);

  return (
    <UserBooksContext.Provider
      value={{ readBooks, favoriteBooks, plannedBooks, loadingUserBooks }}
    >
      {children}
    </UserBooksContext.Provider>
  );
};

export const useUserBooks = () => {
  const context = useContext(UserBooksContext);
  if (!context) {
    throw new Error('useUserBooks must be used within a UserBooksProvider');
  }
  return context;
};
