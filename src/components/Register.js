import React, { useState } from 'react';

const Register = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://127.0.0.1:8000/api/register/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setMessage(data.message);
    if (data.status === 'success') setForm({ username: '', email: '', password: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="container py-4">
      <h2>Register</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <input type="text" name="username" value={form.username} onChange={handleChange} placeholder="Username" className="form-control mb-2" required />
      <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" className="form-control mb-2" required />
      <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Password" className="form-control mb-2" required />
      <button type="submit" className="btn btn-primary">Register</button>
    </form>
  );
};

export default Register;