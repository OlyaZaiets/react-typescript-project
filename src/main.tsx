import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss';
import App from './App.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { BrowserRouter } from 'react-router-dom';
import { BooksProvider } from './context/BooksContext.tsx';
import { UserBooksProvider } from './context/UserBooksContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <BooksProvider>
          <UserBooksProvider>
            <App />
          </UserBooksProvider>

        </BooksProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);