import { useAuth } from '../../context/AuthContext';
import './BookActions.scss';
import { BookCheck, BookHeart, BookPlus } from 'lucide-react';
import type { BookItem } from '../../types';
import { deleteDoc, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import toast from 'react-hot-toast';
import { useUserBooks } from '../../context/UserBooksContext';

interface BookActionsProps {
  book: BookItem
}

export const BookActions = ( { book }: BookActionsProps ) => {
  const { user } = useAuth();
  const { readBooks, favoriteBooks, plannedBooks, loadingUserBooks } = useUserBooks();

  if (loadingUserBooks) {
    return (
      <div className="button-container loading">
        <BookCheck className="book-icons" />
        <BookHeart className="book-icons" />
        <BookPlus className="book-icons" />
      </div>
    );
  }

  const isRead = readBooks.has(book.id);
  const isFavorite = favoriteBooks.has(book.id);
  const isPlanned = plannedBooks.has(book.id);

  //Read work more
  const handleAddToRead  = async () => {
    if (!user) {
      toast('Please log in to mark books', {icon : '⚠️'})
      return;
    }
    const docRef = doc(db, 'users', user.uid, 'read', book.id)
    
    if (isRead) {
      await deleteDoc(docRef);
      toast('Remove from Read List 📖', { icon: '❌' });
    } else {
      await setDoc(docRef, {
        title: book.volumeInfo.title,
        rating: book.volumeInfo.averageRating || null,
        category: book.volumeInfo.categories || null,
        createdAt: serverTimestamp()
    })
    toast.success('Add to Read List 📖')
  }
}

// Fav
  const handleAddToFavorite  = async () => {
    if (!user) {
      toast('Please log in to mark books', {icon : '⚠️'})
      return;
    }
    const docRef = doc(db, 'users', user.uid, 'favorite', book.id)
    if (isFavorite) {
      await deleteDoc(docRef);
      toast('Removed from Favorites ❤️', { icon: '❌' });
    } else {
      await setDoc(docRef, {
        title: book.volumeInfo.title,
        rating: book.volumeInfo.averageRating || null,
        category: book.volumeInfo.categories || null,
        createdAt: serverTimestamp()
      })
    toast.success('Added to Favorites ❤️');
    }
  }

//Plan
  const handleAddToPlanned  = async () => {
    if (!user) {
      toast('Please log in to mark books', {icon : '⚠️'})
      return;
    }
    const docRef = doc(db, 'users', user.uid, 'toRead', book.id)
    if (isPlanned) {
      deleteDoc(docRef);
      toast('Remove from Read Plan 🔮', {icon: '❌'})
    } else {
      await setDoc(docRef, {
        title: book.volumeInfo.title,
        rating: book.volumeInfo.averageRating || null,
        category: book.volumeInfo.categories || null,
        createdAt: serverTimestamp()
    })
    toast.success('Add to Read Plan 🔮')
    }
}

  return(
    <div className='button-container'>
      <button>
        <BookCheck 
          className= {`book-icons ${isRead ? 'active' : ''}`}
          onClick={handleAddToRead}

        />
      </button>
      <button>
        <BookHeart 
          className= {`book-icons ${isFavorite ? 'active' : ''}`}
          onClick={handleAddToFavorite}
        />
      </button>
      <button>
        <BookPlus 
          className= {`book-icons ${isPlanned ? 'active' : ''}`}
          onClick={handleAddToPlanned}
        />
      </button>
    </div>
  )
}