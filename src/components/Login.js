import React, { useState } from 'react';
import '../css/login.css';
import { useNavigate, Link } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const res = await fetch('http://127.0.0.1:8000/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok && data.status === 'success') {
        localStorage.setItem('userId', data.user_id);
        if (typeof onLogin === 'function') {
          onLogin(data.user_id);
        }
        navigate('/'); // Redirect to dashboard
      } else {
        setMessage(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setMessage('Login failed. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='login-container'>
      <div className='left'>
        <div className='logo'>
          🔥 Resume Maker
          <h2>Welcome !</h2>
          <p>To stay connected with us please login with your personal info</p>
        </div>
      </div>
      <div className='right'>
        {message && <div className="alert alert-danger">{message}</div>}
        <h2>Welcome</h2>
        <p>Login in to your account to continue</p>
        <form onSubmit={handleSubmit}>
          <input type='text' placeholder='username...' name="username" value={form.username} onChange={handleChange} required className='login-input'/>
          <input type='password' placeholder='password...' name="password" value={form.password} onChange={handleChange} required className='login-input'/>
          <button type="submit" className="btn" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'LOG IN'}
          </button>
          <p className="signup">Don't have an account? <Link to="/register">Sign up</Link></p>
        </form>
      </div>
    </div>
  );
};

export default Login;