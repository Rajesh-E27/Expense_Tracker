import React, { useState } from 'react';
import { sendPasswordResetEmail, getAuth } from 'firebase/auth';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const auth = getAuth();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('✅ Password reset email sent. Check your inbox!');
    } catch (error) {
      console.error('❌ Error sending password reset email:', error.message);
      setMessage('❌ Failed to send reset email. Please try again.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto' }}>
      <h2>Forgot Password</h2>
      <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send Reset Link</button>
      </form>
      {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
      <Link to="/login">🔙 Back to Login</Link>
    </div>
  );
};

export default ForgotPassword;
