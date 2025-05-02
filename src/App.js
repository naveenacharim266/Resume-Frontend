import { useEffect, useState } from 'react';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import BasicDetailsForm from './components/BasicDetailsForm';
import ExperienceForm from './components/ExperienceForm';
import ProjectForm from './components/ProjectForm';
import EducationForm from './components/EducationForm';
import SkillsForm from './components/SkillsForm';
import Dashboard from './components/dashboard';
import ResumePreview from './components/ResumePreview';
import PrivateRoute from './components/PrivateRoute';
import { Routes, HashRouter, Route, Link, useNavigate } from 'react-router-dom';

function AppWrapper() {
  return (
    <HashRouter>
      <App />
    </HashRouter>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    setIsLoggedIn(!!userId);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <div className="d-flex vh-100">
      {isLoggedIn && (
        <aside className="bg-primary text-white p-4" style={{ width: '250px' }}>
          <h1 className="h4 fw-bold mb-4">Resume Maker</h1>
          <nav className="nav flex-column">
            <Link to="/basic" className="nav-link text-white">Profile</Link>
            <Link to="/experience" className="nav-link text-white">Experience</Link>
            <Link to="/project" className="nav-link text-white">Project</Link>
            <Link to="/skills" className="nav-link text-white">Skills</Link>
            <Link to="/education" className="nav-link text-white">Education</Link>
            <Link to="/preview" className="nav-link text-white">Preview</Link>
            <Link to="#" onClick={handleLogout} className="nav-link text-white">Logout</Link>
          </nav>
        </aside>
      )}

      <main className="flex-grow-1 p-4 bg-light overflow-auto">
        <Routes>
          <Route path="/login" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/basic" element={<PrivateRoute><BasicDetailsForm /></PrivateRoute>} />
          <Route path="/experience" element={<PrivateRoute><ExperienceForm /></PrivateRoute>} />
          <Route path="/project" element={<PrivateRoute><ProjectForm /></PrivateRoute>} />
          <Route path="/skills" element={<PrivateRoute><SkillsForm /></PrivateRoute>} />
          <Route path="/education" element={<PrivateRoute><EducationForm /></PrivateRoute>} />
          <Route path="/preview" element={<PrivateRoute><ResumePreview /></PrivateRoute>} />
        </Routes>
      </main>
    </div>
  );
}

export default AppWrapper;
