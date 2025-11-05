import './CatalogueList.scss';
import importedBooksWithoutCover from '../../assets/booksWithoutCover.json';
import {  ChevronLeft, ChevronRight} from 'lucide-react';
import { useEffect, useState } from 'react';
import { CircularProgressWithLabel } from '../../components/Loader/Loader' ;
import { Link } from 'react-router-dom';
import { BookActions } from '../BookActions/BookActions';
import NoCoverBook from '../../assets/No_cover_book.jpg'; 
import { useBooks } from '../../context/BooksContext';

export const CatalogueList = () => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const { books, searchQuery } = useBooks();

  useEffect(() => {
    if (books) {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            setLoading(false);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
  }, [books]);

    if (!books) {
    return (
      <div className='loading-container'>
        <CircularProgressWithLabel value={progress} />
        <p className='loader-text'>Fetching King's Universe...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className='loading-container'>
        <CircularProgressWithLabel value={progress} />
        <p className='loader-text'>Fetching King's Universe...</p>
      </div>
    );
  }

  const filtered = searchQuery
    ? books.filter(b =>
        b.volumeInfo?.title?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : books;

  const highlight = (title: string) =>
    searchQuery
      ? title.replace(
          new RegExp(`(${searchQuery})`, 'gi'),
          '<mark>$1</mark>'
        )
      : title;

  const booksWithCustomCover = importedBooksWithoutCover as { 
    id: string; 
    title: string; 
    coverUrl: string;
    }[];

  const booksWithoutCoverFromApi = books
      ? books.filter(book => !book.volumeInfo?.imageLinks)
      : [];

  console.log('Books without cover from API:', booksWithoutCoverFromApi);

  const ITEMS_PER_PAGE = 8;
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

    // 🔹 Книги, які відображаються на поточній сторінці
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentBooks = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // 🔹 Функції для переходу між сторінками
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  return (
    <div className='container'>
      <div className='catalogue-introduction'>
        <h1>Interactive Book Catalogue: Mark Read, Favorite & Comment</h1>
        <p> Welcome to the King Catalogue!
          Browse his chilling stories, from the mildest mysteries to the truly terrifying horrors. 
          Ready to face your fears? Mark Read, Favorite, Read List, and Comment 
          to share your journey through the worlds of the Master Storyteller!
        </p>
      </div>

      <div className='book-wrapper'>
        {currentBooks.map(book => {
        const volumeInfo = book.volumeInfo;
        const title = volumeInfo?.title || 'Unknown Title';
            
        const customCoverData = booksWithCustomCover.find(bwc => bwc.id === book.id && bwc.title === title);

        let imageSrc = volumeInfo?.imageLinks?.thumbnail || 
          volumeInfo?.imageLinks?.smallThumbnail ||
          customCoverData?.coverUrl ||
          NoCoverBook;

          return (
            <div key={book.id} 
              className='book-card'
            >
              <Link 
                to={`/book/${book.id}`} 
                className='book-link'
                state={{ book }}
              >
                <img 
                  src={imageSrc} 
                  alt={`Cover for ${title}`} 
                  className='book-cover-image'
                  loading='lazy'
                /> 
                <h3 dangerouslySetInnerHTML={{ __html: highlight(title) }}/>
              </Link>

            <BookActions book={book}/>
            </div>
            )
        })}
      </div>

      <div className='pagination'>
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          <ChevronLeft />
        </button>
        <span>
        {currentPage} of {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          <ChevronRight />
        </button>
      </div>
    </div>
  )
}