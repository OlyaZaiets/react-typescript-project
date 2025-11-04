import './App.scss';
import { HomePage } from './pages/HomePage/HomePage';
import { Catalogue } from './pages/Catalogue/Catalogue';
import {  Route, Routes } from 'react-router-dom';
import { HomeLayout } from './layouts/HomeLayout';
import { MainLayout } from './layouts/MainLayout';
import { Login } from './components/Login/Login';
import { Registration } from './components/Registration/Registration';
import { Dashboard } from './components/Dashboard/Dashboard';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';
import { BookPage } from './components/BookPage/BookPage';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Routes>
        <Route element={<HomeLayout/>}>
          <Route path='/' element={<HomePage />}/>
        </Route>

        <Route element={<MainLayout/>}>
          <Route path="/catalogue" element={<Catalogue />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/book/:id" element={<BookPage />} />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard/>
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
    </>
  )
}

export default App
