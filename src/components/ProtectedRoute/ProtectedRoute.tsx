import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type {  ReactNode } from 'react';
import { CircularIndeterminate } from '../Loader/Loader';


export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  console.log(location)

  if (loading) {
  return  (
        <div className='loading-container'>
          <CircularIndeterminate />
          <p className='loader-text'>Checking authentication...</p>
        </div>
      );
}
  if (!user) {
    if(location.pathname === '/dashboard') {
      return <Navigate to='/' replace />;
    }
  
    return <Navigate to='/login' replace />;
  }

  return children;
};
