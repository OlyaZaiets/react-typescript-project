import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './BookActions.scss';
import { BookCheck, BookHeart, BookPlus } from 'lucide-react';
import type { BookItem } from '../../types';
import { deleteDoc, doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import toast from 'react-hot-toast';

interface BookActionsProps {
  book: BookItem
}

export const BookActions = ( { book }: BookActionsProps ) => {
  const { user } = useAuth();
  const [isRead, setIsRead] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPlanned, setIsPlanned] = useState(false);

  // check books in Firebase store 
  useEffect(() => {
    if(!user) return;

    const checkBookStatus = async() => {
      try {
        const readRef= doc(db, 'users', user.uid, 'read', book.id);
        const favoriteRef= doc(db, 'users', user.uid, 'favorite', book.id);
        const planRef= doc(db, 'users', user.uid, 'toRead', book.id)

        const [readSnap, favSnap, planSnap] = await Promise.all ([
          getDoc(readRef),
          getDoc(favoriteRef),
          getDoc(planRef)
        ]);

        setIsRead(readSnap.exists());
        setIsFavorite(favSnap.exists());
        setIsPlanned(planSnap.exists());


        console.log('READ snapshot:', readSnap);
        console.log('FAVORITES snapshot:', favSnap);
        console.log('PLAN snapshot:', planSnap);

        console.log('Statuses:', {
          read: readSnap.exists(),
          favorites: favSnap.exists(),
          toRead: planSnap.exists(),
});
        
      } catch (error) {
        console.log('Error checking book status:', error)
      }
    }

    checkBookStatus();
  }, [user, book.id])


 // Handle books 

  //Read
  const handleAddToRead  = async () => {
    if (!user) {
      toast('Please log in to mark books', {icon : '⚠️'})
      return;
    }
    const docRef = doc(db, 'users', user.uid, 'read', book.id)
    
    if (isRead) {
      await deleteDoc(docRef);
      setIsRead(false);
      toast('Remove from Read List 📖', { icon: '❌' });
      console.log('Removed from READ');
      
      
    } else {
      await setDoc(docRef, {
        title: book.volumeInfo.title,
        rating: book.volumeInfo.averageRating || null,
        category: book.volumeInfo.categories || null,
        createdAt: serverTimestamp()
    })

    setIsRead(true);
    toast.success('Add to Read List 📖')
    console.log('Add to READ');
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
      setIsFavorite(false);
      toast('Removed from Favorites ❤️', { icon: '❌' });
      console.log('Removed from FAV');
      
    } else {
      await setDoc(docRef, {
        title: book.volumeInfo.title,
        rating: book.volumeInfo.averageRating || null,
        category: book.volumeInfo.categories || null,
        createdAt: serverTimestamp()
      })

    setIsFavorite(true);
    toast.success('Added to Favorites ❤️');
    console.log('Add to FAV');
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
      setIsPlanned(false);
      toast('Remove from Read Plan 🔮', {icon: '❌'})
      console.log('first')
    } else {
      await setDoc(docRef, {
        title: book.volumeInfo.title,
        rating: book.volumeInfo.averageRating || null,
        category: book.volumeInfo.categories || null,
        createdAt: serverTimestamp()
    })
    setIsPlanned(true);
    toast.success('Add to Read Plan 🔮')
    console.log('Add to PLAN');
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
      {/* <button>
        <MessageSquareText className='book-icons'/>
      </button> */}
    </div>
  )
}