import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://127.0.0.1:8000/api/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.status === 'success') {
      localStorage.setItem('userId', data.user_id);  // 🔐 Save user ID for later use
      onLogin(data.user_id);  // optional callback
    } else {
      setMessage(data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container py-4">
      <h2>Login</h2>
      {message && <div className="alert alert-danger">{message}</div>}
      <input type="text" name="username" value={form.username} onChange={handleChange} placeholder="Username" className="form-control mb-2" required />
      <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Password" className="form-control mb-2" required />
      <button type="submit" className="btn btn-primary">Login</button>
    </form>
  );
};

export default Login;