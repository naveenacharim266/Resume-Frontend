import './App.css';
import BasicDetailsForm from './components/BasicDetailsForm';
import ExperienceForm from './components/ExperienceForm';
import ProjectForm from './components/ProjectForm';
import EducationForm from './components/EducationForm';
import SkillsForm from './components/SkillsForm';
import Dashboard from './components/dashboard';
import { Routes, HashRouter, Route, Link } from 'react-router-dom';

function App() {
  return (
    <HashRouter>
      <div className="d-flex vh-100">
        {/* Sidebar */}
        <aside className="bg-primary text-white p-4" style={{ width: '250px' }}>
          <h1 className="h4 fw-bold mb-4">Resume Maker</h1>
          <nav className="nav flex-column">
            <Link to="/" className="btn btn-light text-primary mb-2">Create New Resume</Link>
            <Link to="/dashboard" className="nav-link text-white">My Dashboard</Link>
            <Link to="/job-search" className="nav-link text-white">Job Search</Link>
            <Link to="/sample-library" className="nav-link text-white">Sample Library</Link>
            <Link to="/review-resume" className="nav-link text-white">Review My Resume</Link>
            <Link to="/ai-interview" className="nav-link text-white">AI Interview</Link>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-grow-1 p-4 bg-light overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/basic" element={<BasicDetailsForm />} />
            <Route path="/experience" element={<ExperienceForm />} />
            <Route path="/project" element={<ProjectForm />} />
            <Route path="/skills" element={<SkillsForm />} />
            <Route path="/education" element={<EducationForm />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}

export default App;
