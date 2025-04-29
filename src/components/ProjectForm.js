import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProjectForm = () => {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({
    project_title: '',
    role: '',
    client: '',
    startdate: new Date().toISOString().slice(0, 10),
    enddate: new Date().toISOString().slice(0, 10),
    project_details: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const labels = {
    project_title: 'Project Title',
    role: 'Role',
    client: 'Client',
    startdate: 'Start Date',
    enddate: 'End Date',
    project_details: 'Project Details'
  };

  const userId = localStorage.getItem('userId');
  const baseUrl = 'http://127.0.0.1:8000/api';

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${baseUrl}/addProjects/?user_id=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch projects');

      const data = await response.json();
      if (data.status === 'success') {
        setProjects(data.data || []);
      }
    } catch (err) {
      console.error('Fetch Error:', err.message);
      setError('Error fetching projects.');
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = (project) => {
    setForm({
      project_title: project.project_title,
      role: project.role,
      client: project.client,
      startdate: project.startdate,
      enddate: project.enddate,
      project_details: project.project_details,
    });
    setEditingId(project.id);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      const response = await fetch(`${baseUrl}/addProjects/${id}/`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete project');
      alert('Deleted successfully!');
      fetchProjects();
    } catch (err) {
      console.error('Delete Error:', err.message);
      setError('Error deleting project.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `${baseUrl}/addProjects/${editingId}/` : `${baseUrl}/addProjects/`;

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, user: userId })
      });

      if (!response.ok) throw new Error('Failed to save project');
      const data = await response.json();
      alert(isEditing ? 'Updated Successfully!' : 'Added Successfully!');

      setIsEditing(false);
      setEditingId(null);
      setForm({
        project_title: '',
        role: '',
        client: '',
        startdate: new Date().toISOString().slice(0, 10),
        enddate: new Date().toISOString().slice(0, 10),
        project_details: ''
      });
      fetchProjects();
    } catch (error) {
      console.error('Save Error:', error.message);
      setError('Error saving project.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">Manage Projects</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      {projects.length > 0 && (
        <div className="mb-5">
          <h4>Existing Projects</h4>
          {projects.map((project, idx) => (
            <div key={idx} className="border p-3 rounded mb-3">
              <h5>{project.project_title}</h5>
              <p className="text-muted">{project.startdate} - {project.enddate}</p>
              <p>{project.project_details}</p>
              <div className="d-flex gap-2 mt-2">
                <button className="btn btn-sm btn-warning" onClick={() => handleEdit(project)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(project.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <h4>{isEditing ? 'Edit Project' : 'Add New Project'}</h4>

        {Object.entries(form).map(([key, value]) => (
          <div key={key} className="mb-3">
            <label className="form-label text-capitalize">{labels[key] || key}</label>
            {key === "project_details" ? (
              <textarea name={key} value={value} onChange={handleChange} className="form-control" rows={4} required />
            ) : (
              <input
                type={key.includes("date") ? "date" : "text"}
                name={key}
                value={value}
                onChange={handleChange}
                className="form-control"
              />
            )}
          </div>
        ))}

        <div className="d-flex justify-content-end mt-3">
          <button type="submit" disabled={isSubmitting} className="btn btn-primary">
            {isSubmitting ? "Saving..." : isEditing ? "Update" : "Add"}
          </button>
        </div>
      </form>

      <div className="d-flex justify-content-between mt-4">
        <button className="btn btn-outline-secondary" onClick={() => navigate('/experience')}>
          Back
        </button>
        <button className="btn btn-outline-primary" onClick={() => navigate('/education')}>
          Next
        </button>
      </div>
    </div>
  );
};

export default ProjectForm;
