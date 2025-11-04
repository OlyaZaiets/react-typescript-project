import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { BookItem, BooksApiResponse } from "../types"

interface BooksContextType {
  books: BookItem[] | null;
  setBooks: (books: BookItem[]) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const BooksContext = createContext<BooksContextType | undefined>(undefined)


export const BooksProvider = ( { children }: {children: ReactNode}) => {
  const [books, setBooks] = useState<BookItem[] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const key = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;;
  const criterion = 'inauthor:"Stephen King" AND books English';
  const MAX_RESULTS_PER_PAGE = 40; // Максимум, що дозволяє API
  const MAX_TOTAL_FETCH = 200; // Ліміт для уникнення надмірної кількості запитів
  
  async function fetchBooks(): Promise<void> {
    let allBooks: BookItem[] = []; 
    let startIndex = 0;
    let totalItems = 1; // Початкове значення, щоб цикл while розпочався

    const maxResultsParam = `maxResults=${MAX_RESULTS_PER_PAGE}`;
    
    try {

      while (startIndex < totalItems && allBooks.length < MAX_TOTAL_FETCH) {
        const url = `https://www.googleapis.com/books/v1/volumes?q=${criterion}&key=${key}&${maxResultsParam}&startIndex=${startIndex}`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: BooksApiResponse = await response.json();
        // Встановлюємо загальну кількість елементів при першому запиті
        if (startIndex === 0) {
          totalItems = Math.min(data.totalItems || 0, MAX_TOTAL_FETCH); 
        }
        if (!data.items || data.items.length === 0) {
          console.warn('No books found in API response');
          break;
        }
        
                    
        // 🛡️ ЖОРСТКА ФІЛЬТРАЦІЯ: Зберігаємо ТІЛЬКИ англомовні книги
        const englishBooks = data.items.filter(book => {
          const info = book.volumeInfo;
          return (
            info.language === 'en' && 
            info.authors &&
            info.authors.some(author =>
            author.toLowerCase().includes('stephen king')
              )
          );
        });

        allBooks = allBooks.concat(englishBooks);
      
      // Збільшуємо індекс для наступної сторінки
        startIndex += MAX_RESULTS_PER_PAGE;
      } 

      setBooks(allBooks);
      console.log(allBooks)
    } catch (error) {
        console.error('Fetch error:', error)
    } 
  } 

  useEffect(() => {
      fetchBooks();
    }, []);


  return (
    <BooksContext.Provider value={ {books, setBooks, searchQuery, setSearchQuery} }>
      {children}
    </BooksContext.Provider>
  );
};

export const useBooks = () => {
  const context = useContext(BooksContext);
  if (!context) throw new Error("useBooks must be used within BooksProvider");
  return context;

}