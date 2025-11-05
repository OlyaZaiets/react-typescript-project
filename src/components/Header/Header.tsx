import { Link, NavLink } from 'react-router-dom';
import './Header.scss';
import {  LayoutDashboard, LibraryBig, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBooks } from '../../context/BooksContext';


export const Header = () => {
  const { user, logout } = useAuth();
  const { searchQuery, setSearchQuery } = useBooks();

  return (
    <header className='header-container'>
      <Link to='/' className='logo-text'>Stephen King's Universe</Link>
      <div className='search-container'>
        <input 
          type='text' 
          placeholder='Search books...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          />
      </div>
      
      <nav className='icons-container'>
        {user ? ( 
          <>
            <button onClick={logout} className='nav-link' title='Logout'>
              <LogOut className='head-icon'/>
            </button>
            <NavLink to='/dashboard' className='nav-link' title='Dashboard'>
              <LayoutDashboard className='head-icon'/>
            </NavLink>
          </>          
        ) : (   
          <NavLink to='/login' className='nav-link' title='Login'>
          <LogIn  className='head-icon'/>
        </NavLink> 
        )}
        <NavLink to='/catalogue' className='nav-link' title='Catalogue'>
          < LibraryBig className='head-icon'/>
        </NavLink>
      </nav>
    </header>
  )
}