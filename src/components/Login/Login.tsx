import { Link } from 'react-router-dom';
import './Login.scss';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

export const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await login(email, password);
      setError('');
    } catch (error: any) {
      setError(error.message);
    }

    console.log('Email:', email);
    console.log('Password:', password);
  };

  return (
    <div className="login-wrapper">
      <div className='login-container'>

        <div className='wrapper'>
          <div className='login-text'>
            <h1>Welcome Back to Stephen King's Universe</h1>
            <p>Log in to access your personal dashboard, track your reading progress, 
                and engage with our community of Constant Readers.</p>
          </div>
          <form 
            className='user-info'
            onSubmit={handleSubmit}
          >
          {error && <p className="error-message">{error}</p>}
            <input 
              type="email" 
              placeholder="[Enter your email]"
              onChange={(e) => setEmail(e.target.value)}
              required
              />
            <input 
              type="password" 
              placeholder="[Enter your password]"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type='submit' className='button-login'>Log In</button>
          </form>
          <p className='registration-question'>New to our site?</p> 
          <Link to='/registration'>Sign Up Here</Link>
        </div>
      </div>
    </div>
  )
}