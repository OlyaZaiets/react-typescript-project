import { useEffect, useState } from 'react';
import './BookPage.scss';
import { useAuth } from '../../context/AuthContext';
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useLocation, useParams } from 'react-router-dom';
import type { BookItem } from '../../types';
import { BookActions } from '../BookActions/BookActions';
import NoCoverBook from '../../assets/No_cover_book.jpg'; 
import { Trash2 } from 'lucide-react';

interface Comment {
  bookId: string,
  userId: string,
  userEmail: string,
  text: string,
  createdAt: Timestamp,
}

interface CommentsList extends Comment {
  id: string
}

export const BookPage = () => {
  const { user } = useAuth();
  const { id } = useParams(); 
  const location = useLocation();
  const passedBook = (location.state as { book: BookItem })?.book;

  const [book, setBook] = useState<BookItem | null>(passedBook || null)
  const [comment, setComment] = useState('');
  const [commentsList, setCommentsList] = useState<CommentsList[]>([]);


  useEffect(() => {
    if (!book && id) {
      const fetchBook = async () => {
        const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${id}`);
        const data = await res.json();
        setBook(data);
      };
      fetchBook();
    }
  }, [id, book]);

  useEffect(() => {
    if (!id) return;
    const commentsRef = collection(db, 'books', id, 'comments');
    const q = query(commentsRef, orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched: CommentsList[] = snapshot.docs.map((doc) => {
        const data = doc.data() as Omit<CommentsList, 'id'>; // тип без id
        return {
          id: doc.id,
          ...data,
        };
      });

      setCommentsList(fetched);
      console.log(fetched);
    });


    return () => unsubscribe();
  }, [id]);




  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !user || !id) return;
    
    const newComment = {
      userId: user.uid,
      userEmail: user.email,
      text: comment,
      createdAt: serverTimestamp(),
    }
    try {
      const docRef = await addDoc(collection(db, 'books', id, 'comments'), newComment);
      console.log(docRef)
    } catch (error) {
      console.log('Error adding comment:', error)
    }

    console.log(newComment);
    console.log('Comment', comment);
    setComment('');
  }

  const handleDelete = async (commentId: string) => {
  if (!id || !user) return;

  const confirmDelete = window.confirm('Are you sure you want to delete this comment?');
  if (!confirmDelete) return;

  try {
    const commentRef = doc(db, 'books', id, 'comments', commentId);
    await deleteDoc(commentRef);
    console.log('Comment deleted:', commentId);
  } catch (error) {
    console.error('Error deleting comment:', error);
  }
};


  if (!book) return <p className='loading'>Loading book details...</p>;

  const { volumeInfo } = book;
  const { title, pageCount, description, categories, averageRating, imageLinks } = volumeInfo;

  return(
    <div className='book-container'>
      <div className='book-body'>
        <div className='book-left-cover'>
          {imageLinks?.thumbnail ? (
            <img src={imageLinks.thumbnail} alt={title} className='book-cover' />
          ) : (
            <img src={NoCoverBook} alt='No cover available' className='book-cover'/>
          )}
        </div>

        <div className='book-info'>
          <h2>{title}</h2>
          <p>Average Rating: {averageRating || 'Unknown'}</p>
          <p>Category: {categories || 'Unknown'}</p>
          <p>Pages: {pageCount || 'Unknown'}</p>
          <p>Description: {description || 'No description available.'}</p>
        </div>    
        <div className='button-action'>
          <BookActions book ={book}/>
        </div>

        <div className='container-comments'>
          <div className='comment-form-container'>
            <form className='comment-form' onSubmit={ handleSubmit}>
              <textarea 
              id='comment'
              placeholder='Write your comment here...'
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              ></textarea>
              <button type='submit'>Submit</button>
            </form>
          </div>

          <div className='comments-list'>
            {commentsList.length === 0 ? (
              <p className='no-comments'>No comments yet.</p>
            ) : (
              commentsList.map((c) => (
                <div key={c.id} className='comment-item'>
                  <div className='comment-header'>
                    <span className='comment-meta'>
                      {c.userEmail || 'Unknown user'}
                      {c.createdAt?.toDate
                        ? ' · ' + c.createdAt.toDate().toLocaleString()
                        : ''}
                    </span>

                    {user && user.uid === c.userId && (
                      <button
                        className='delete-btn'
                        onClick={() => handleDelete(c.id)}
                        title='Delete comment'
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                  <p>{c.text}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}