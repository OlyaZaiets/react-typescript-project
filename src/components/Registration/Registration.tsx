import { Link } from 'react-router-dom';
import './Registration.scss';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export const Registration = () => {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Password do not match')
      return
    }

    try {
      await register(email, password)
    } catch (error: any) {
      setError(error.message)
    }
    console.log('Email', email)
    console.log('Password', password)
    console.log('confirm', confirmPassword);
  };


  return (
    <div className="registration-wrapper">
      <div className='registration-container'>
        <div className='wrapper'>
          <div className='login-text'>
            <h1>Join the Stephen King Community</h1>
            <p>Create an account to unlock full features.</p>
          </div>
          <form  
            className='user-info-registration'
            onSubmit={handleSubmit}
          >
            {error && <p className='error-message'>{error}</p>}
            <div className="input-group">
              <label htmlFor="firstName">First Name:</label>
              <input 
                type="text" 
                id='firstName' 
                placeholder="[Enter your first name]"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="lastName">Last Name: </label>
              <input 
                type="text" 
                id='lastName' 
                placeholder="[Enter your last name]"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="email">Email:</label>
              <input 
                type="email"
                id='email'
                placeholder="[Enter your email address]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password:</label>
              <input 
                type="password"
                id='password'
                placeholder="[Create a password]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="confirmPassword">Confirm Password:</label>
              <input 
                type="password"
                id='confirmPassword'
                placeholder="[Confirm your password]"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button className='create-btn' type='submit'>Create Account</button>
        </form >
          <p className='login-question'>Already have an account?</p> 
          <Link to='/login'>Log In Here</Link>
        </div>
      </div>
    </div>
  )
}