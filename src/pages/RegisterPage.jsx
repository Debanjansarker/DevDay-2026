import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../firebase/auth.js';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  async function handleRegister(e) {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (cleanPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try { 
      await registerUser(cleanEmail, cleanPassword);
      navigate('/login'); // Redirect to home page on successful registration
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already in use. Try logging in.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Email/password sign-in is disabled in Firebase. Enable it in Firebase Console > Authentication > Sign-in method.');
      } else if (err.code === 'auth/invalid-api-key') {
        setError('Invalid Firebase API key. Recheck REACT_APP_FIREBASE_API_KEY and restart the dev server.');
      } else if (err.code === 'auth/network-request-failed') {
        setError('Network error while contacting Firebase. Check your connection and try again.');
      } else {
        setError(err.message || 'Something went wrong. Please try again.');
      }
    }

    setLoading(false);
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <div className='bg-white rounded-2xl shadow-xl p-10 w-full max-w-md'>

        {/* Header */}
        <h1 className='text-3xl font-bold text-center mb-2'>
          Best <span className='text-orange-600'>Eats</span>
        </h1>
        <p className='text-center text-gray-500 mb-8'>Create an account to save your favorites</p>

        {/* Error message */}
        {error && (
          <div className='bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-6 text-sm font-medium'>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleRegister} className='flex flex-col gap-4'>
          <input
            id='register-email'
            type='email'
            placeholder='Email address'
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent'
          />
          <input
            id='register-password'
            type='password'
            placeholder='Password (min 6 characters)'
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent'
          />
          <button
            id='register-submit'
            type='submit'
            disabled={loading}
            className='bg-orange-600 text-white font-bold py-3 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 mt-2'
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        {/* Link to login */}
        <p className='text-center text-gray-500 text-sm mt-6'>
          Already have an account?{' '}
          <Link to='/login' className='text-orange-600 font-bold hover:underline'>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
