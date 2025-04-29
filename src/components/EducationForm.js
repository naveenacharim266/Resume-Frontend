import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const EducationForm = () => {
  const [form, setForm] = useState({
    degree: '',
    university: '',
    course_type: '',
    specialization: '',
    startdate: new Date().toISOString().slice(0, 10),
    enddate: new Date().toISOString().slice(0, 10),
    course_duration: '',
    grading_system: '',
    marks: ''
  });

  const [educations, setEducations] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem('userId');
  const baseUrl = 'http://127.0.0.1:8000/api';
  const navigate = useNavigate();

  const fetchEducations = async () => {
    try {
      const response = await fetch(`${baseUrl}/addEducation/?user_id=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch education');
      const data = await response.json();
      if (data.status === 'success') {
        setEducations(data.data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEducations();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = (edu) => {
    setForm({
      degree: edu.degree,
      university: edu.university,
      course_type: edu.course_type,
      specialization: edu.specialization,
      startdate: edu.startdate,
      enddate: edu.enddate,
      course_duration: edu.course_duration,
      grading_system: edu.grading_system,
      marks: edu.marks
    });
    setEditingId(edu.id);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this education?')) return;
    try {
      const response = await fetch(`${baseUrl}/addEducation/${id}/`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete education');
      alert('Deleted successfully!');
      fetchEducations();
    } catch (err) {
      setError('Error deleting education.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `${baseUrl}/addEducation/${editingId}/` : `${baseUrl}/addEducation/`;

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, user: userId })
      });

      if (!response.ok) throw new Error('Failed to save education');
      alert(isEditing ? 'Updated Successfully!' : 'Added Successfully!');
      fetchEducations();

      setForm({
        degree: '',
        university: '',
        course_type: '',
        specialization: '',
        startdate: new Date().toISOString().slice(0, 10),
        enddate: new Date().toISOString().slice(0, 10),
        course_duration: '',
        grading_system: '',
        marks: ''
      });
      setIsEditing(false);
      setEditingId(null);
    } catch (err) {
      setError('Error saving education.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderInput = (key, value) => {
    if (key === 'course_type') {
      return (
        <select
          name={key}
          value={value}
          onChange={handleChange}
          className="form-control"
          required
        >
          <option value="">Select Course Type</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Distance">Distance</option>
        </select>
      );
    } else if (key === 'grading_system') {
      return (
        <select
          name={key}
          value={value}
          onChange={handleChange}
          className="form-control"
          required
        >
          <option value="">Select Grading System</option>
          <option value="Percentage">Percentage</option>
          <option value="CGPA">CGPA</option>
          <option value="GPA">GPA</option>
        </select>
      );
    } else {
      return (
        <input
          type={key.includes("date") ? "date" : "text"}
          name={key}
          value={value}
          onChange={handleChange}
          className="form-control"
          required={key === 'degree' || key === 'university'}
        />
      );
    }
  };

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">Manage Education</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      {educations.length > 0 ? (
        <div className="mb-5">
          <h4>Existing Education</h4>
          {educations.map((edu, idx) => (
            <div key={idx} className="border p-3 rounded mb-3">
              <h5>{edu.degree} at {edu.university}</h5>
              <p className="text-muted">{edu.startdate} - {edu.enddate}</p>
              <p>Specialization: {edu.specialization}</p>
              <div className="d-flex gap-2 mt-2">
                <button className="btn btn-sm btn-warning" onClick={() => handleEdit(edu)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(edu.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-info">No education records found. Please add your education details below.</div>
      )}

      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <h4>{isEditing ? 'Edit Education' : 'Add New Education'}</h4>
        {Object.entries(form).map(([key, value]) => (
          <div key={key} className="mb-3">
            <label className="form-label text-capitalize">{key.replace('_', ' ')}</label>
            {renderInput(key, value)}
          </div>
        ))}

        <div className="d-flex justify-content-end mt-3">
          <button type="submit" disabled={isSubmitting} className="btn btn-primary">
            {isSubmitting ? "Saving..." : isEditing ? "Update" : "Add"}
          </button>
        </div>
      </form>

      <div className="d-flex justify-content-between mt-4">
        <button className="btn btn-outline-secondary" onClick={() => navigate('/project')}>
          Back
        </button>
        <button className="btn btn-outline-primary" onClick={() => navigate('/skills')}>
          Next
        </button>
      </div>
    </div>
  );
};

export default EducationForm;