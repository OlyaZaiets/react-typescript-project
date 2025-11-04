import './BookModal.scss';

interface BookModalProps {
  books: any[];
  title: string, 
  closeModal: () => void;
}

export const BookModal = ({books, title, closeModal}: BookModalProps ) => {
  return(
    <div className='modal-backdrop' onClick={closeModal}>
      <div className='modal-container' onClick={(e) => e.stopPropagation()}>
        <button className='close-btn' onClick={closeModal}>✖</button>
        <h2>{title}</h2>

        {books.length === 0 ? (
          <p className='no-books'>No books found in this list.</p>
        ) : (
          <ul className='book-list'>
            {books.map((book) => (
              <li key={book.id} className='book-item'>
                <div className='book-information'>
                  <h3>Title: {book.title}</h3>
                  <p>Category: {book.category?.join(', ') || 'No information'} </p>
                  <p>Rating: {book.rating || 'No information'}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
