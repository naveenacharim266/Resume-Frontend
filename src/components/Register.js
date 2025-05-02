import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm_password: '' });
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsSuccess(false);

    if (form.password !== form.confirm_password) {
      setMessage('Passwords do not match');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('http://127.0.0.1:8000/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();
      setMessage(data.message);

      if (data.status === 'success') {
        setIsSuccess(true);
        setForm({ username: '', email: '', password: '', confirm_password: '' });
        setTimeout(() => navigate('/login'), 2000); // redirect to login
      }

    } catch (error) {
      setMessage('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='login-container'>
      <div className='left'>
        <div className='logo'>
          🔥 Resume Maker
          <h2>Welcome!</h2>
          <p>To stay connected with us, please sign up with your personal info</p>
        </div>
      </div>

      <div className='right'>
        {message && (
          <div className={`alert ${isSuccess ? 'alert-success' : 'alert-danger'}`}>
            {message}
          </div>
        )}

        <h2>Create Account</h2>
        <p>Sign up to continue</p>

        <form onSubmit={handleSubmit}>
          <input
            type='text'
            placeholder='Username...'
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            className='login-input'
          />
          <input
            type='email'
            placeholder='Email...'
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className='login-input'
          />
          <input
            type='password'
            placeholder='Password...'
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            className='login-input'
          />
          <input
            type="password"
            name="confirm_password"
            placeholder="Confirm Password..."
            value={form.confirm_password}
            onChange={handleChange}
            required
            className='login-input'
          />
          <button type="submit" className="btn" disabled={isSubmitting}>
            {isSubmitting ? 'Signing up...' : 'SIGN UP'}
          </button>
          <p className="signup">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
