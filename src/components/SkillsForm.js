import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

const SkillsForm = () => {
  const [form, setForm] = useState({ skillname: "" });
  const [skills, setSkills] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const rawUserId = localStorage.getItem("userId");
  const userId = rawUserId ? Number(rawUserId) : null;
  const baseUrl = "http://127.0.0.1:8000/api";

  const fetchSkills = async () => {
    try {
      const response = await fetch(`${baseUrl}/addSkills/?user=${userId}`);
      if (!response.ok) throw new Error("Failed to fetch skills");
      const data = await response.json();
      if (data.status === "success") {
        setSkills((data.skills || []).sort((a, b) => a.name.localeCompare(b.name)));
      }
    } catch (err) {
      console.error("Fetch Error:", err.message);
      setError("Error fetching skills.");
    }
  };

  useEffect(() => {
    if (!userId) {
      setError("User ID not found. Please log in.");
      return;
    }
    fetchSkills();
  }, []);

  const handleChange = (e) => {
    setForm({ [e.target.name]: e.target.value });
  };

  const handleEdit = (skill) => {
    setForm({ skillname: skill.name });
    setEditingId(skill.id);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this skill?")) return;
  
    try {
      const userId = localStorage.getItem("userId"); // or get it from state
      const response = await fetch(`${baseUrl}/addSkills/${id}/?user=${userId}`, {
        method: "DELETE",
      });
  
      if (!response.ok) throw new Error("Failed to delete skill");
  
      alert("Deleted successfully!");
      fetchSkills();
    } catch (err) {
      console.error("Delete Error:", err.message);
      setError("Error deleting skill.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const method = isEditing ? "PUT" : "POST";
    const url = isEditing ? `${baseUrl}/addSkills/${editingId}/` : `${baseUrl}/addSkills/`;

    try {
      const payload = {
        skillname: form.skillname.trim(),
        user: userId,
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to save skill");

      alert(isEditing ? "Updated Successfully!" : "Added Successfully!");
      setForm({ skillname: "" });
      setIsEditing(false);
      setEditingId(null);
      fetchSkills();
    } catch (error) {
      console.error("Save Error:", error.message);
      setError("Error saving skill.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">Manage Skills</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      {skills.length > 0 && (
        <div className="mb-5">
          <h4>Existing Skills</h4>
          {skills.map((skill) => (
            <div key={skill.id} className="border p-3 rounded mb-2 d-flex justify-content-between">
              <span>{skill.name}</span>
              <div>
                <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(skill)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(skill.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <h4>{isEditing ? "Edit Skill" : "Add New Skill"}</h4>
        <div className="mb-3">
          <label className="form-label">Skill Name</label>
          <input
            type="text"
            name="skillname"
            value={form.skillname}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
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
        <button className="btn btn-outline-primary" onClick={() => navigate('/preview')}>
          Next
        </button>
      </div>
    </div>
  );
};

export default SkillsForm;
