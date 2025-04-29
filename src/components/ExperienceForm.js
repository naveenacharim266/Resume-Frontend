import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

const ExperienceForm = () => {
  const [experiences, setExperiences] = useState([]);
  const [form, setForm] = useState({
    title: '',
    employment_type: '',
    organization: '',
    startdate: new Date().toISOString().slice(0, 10),
    enddate: new Date().toISOString().slice(0, 10),
    location: '',
    location_type: '',
    description: '',
    skills_used: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const labels = {
    title: 'Job Title',
    employment_type: 'Employment Type',
    organization: 'Organization Name',
    startdate: 'Start Date',
    enddate: 'End Date',
    location: 'Location',
    location_type: 'Location Type',
    description: 'Job Description',
    skills_used: 'Skills Used'
  };

  const userId = localStorage.getItem('userId');
  const baseUrl = 'http://127.0.0.1:8000/api';

  const fetchExperiences = async () => {
    try {
      const response = await fetch(`${baseUrl}/addExperience/?user_id=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch experiences');

      const data = await response.json();
      if (data.status === 'success') {
        setExperiences(data.data || []);
      }
    } catch (err) {
      console.error('Fetch Error:', err.message);
      setError('Error fetching experiences.');
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = (exp) => {
    setForm({
      title: exp.title,
      employment_type: exp.employment_type,
      organization: exp.organization,
      startdate: exp.startdate,
      enddate: exp.enddate,
      location: exp.location,
      location_type: exp.location_type,
      description: exp.description,
      skills_used: exp.skills_used,
    });
    setEditingId(exp.id);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this experience?')) return;

    try {
      const response = await fetch(`${baseUrl}/addExperience/${id}/`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete experience');
      alert('Deleted successfully!');
      fetchExperiences();
    } catch (err) {
      console.error('Delete Error:', err.message);
      setError('Error deleting experience.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `${baseUrl}/addExperience/${editingId}/` : `${baseUrl}/addExperience/`;

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, user: userId })
      });

      if (!response.ok) throw new Error('Failed to save experience');
      const data = await response.json();
      alert(isEditing ? 'Updated Successfully!' : 'Added Successfully!');

      setIsEditing(false);
      setEditingId(null);
      setForm({
        title: '',
        employment_type: '',
        organization: '',
        startdate: new Date().toISOString().slice(0, 10),
        enddate: new Date().toISOString().slice(0, 10),
        location: '',
        location_type: '',
        description: '',
        skills_used: ''
      });
      fetchExperiences();
    } catch (error) {
      console.error('Save Error:', error.message);
      setError('Error saving experience.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">Manage Experience</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      {experiences.length > 0 && (
        <div className="mb-5">
          <h4>Existing Experiences</h4>
          {experiences.map((exp, idx) => (
            <div key={idx} className="border p-3 rounded mb-3">
              <h5>{exp.title} at {exp.organization}</h5>
              <p className="text-muted">{exp.startdate} - {exp.enddate}</p>
              <p>{exp.description}</p>
              <div className="d-flex gap-2 mt-2">
                <button className="btn btn-sm btn-warning" onClick={() => handleEdit(exp)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(exp.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <h4>{isEditing ? 'Edit Experience' : 'Add New Experience'}</h4>

        {Object.entries(form).map(([key, value]) => (
          <div key={key} className="mb-3">
            <label className="form-label text-capitalize">{labels[key] || key}</label>
            {key === "employment_type" ? (
              <select name={key} value={value} onChange={handleChange} className="form-control" required>
                <option value="">Select Employment Type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
                <option value="Freelance">Freelance</option>
              </select>
            ) : key === "location_type" ? (
              <select name={key} value={value} onChange={handleChange} className="form-control" required>
                <option value="">Select Location Type</option>
                <option value="On-site">On-site</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            ) : key === "description" ? (
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
        <button className="btn btn-outline-secondary" onClick={() => navigate('/basic')}>
          Back
        </button>
        <button className="btn btn-outline-primary" onClick={() => navigate('/project')}>
          Next
        </button>
      </div>
    </div>
  );
};

export default ExperienceForm;