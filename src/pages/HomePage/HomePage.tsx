import { Link } from 'react-router-dom';
import HomePagePicture from '../../assets/HomePage_picture.png'; 
import './HomePage.scss';
import { useAuth } from '../../context/AuthContext';

export const HomePage = () => {
  const { user } = useAuth(); 
  return (
      <div className='main-container'>
          <div className='container-text'>
            <h2 className='introduction-title'>Welcome to the World of Stephen King</h2>
            <p className='introduction-text'>If, like me, you are afraid to start the King of Horror but respect him as a master storyteller, 
              this site is created just for you. <br /> Consider it your guide to the realms of mysticism, mystery, 
              horror, and fear — a place to explore, learn, and immerse yourself in chilling tales.
            </p>
            {user ? (
              <div className='buttons'>
                <Link 
                  to='/catalogue' 
                  className='btn'
                >
                  View Catalogue
                </Link>

                <Link 
                  to='/dashboard' 
                  className='btn'
                >
                  Dashboard
                </Link>
            </div>
            ) : (
              <div className='buttons'>
                <Link 
                  to='/catalogue' 
                  className='btn'
                >
                  View Catalogue
                </Link>

                <Link 
                  to='/login' 
                  className='btn'
                >
                  Log In
                </Link>
  
            </div>
            )}
          </div>
          <div className='homepage-picture'>
            <img 
              src={HomePagePicture} 
              alt="Dark atmospheric welcome banner inspired by Stephen King book covers, shadowy hotel and eerie small town " 
              className='picture'
            />
        </div>
      </div>

  )
}
