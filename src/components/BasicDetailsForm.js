import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BasicDetailsForm = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    summary: '',
    linkedin: '',
    github: '',
    website: '',
  });

  const [originalForm, setOriginalForm] = useState(null); // For comparing
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingId, setExistingId] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const url = `http://127.0.0.1:8000/api/basicDetails/?user_id=${userId}`;

  // ✅ Fetch existing details
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (response.ok && data.status === "success" && data.basicdetails && typeof data.basicdetails === "object") {
          const details = data.basicdetails;
          
          const sanitize = (val) => typeof val === "string" ? val : (val ?? "").toString();
  
          const fetchedForm = {
            name: sanitize(details.name),
            email: sanitize(details.email),
            phone: sanitize(details.phone),
            summary: sanitize(details.summary),
            linkedin: sanitize(details.linkedin),
            github: sanitize(details.github),
            website: sanitize(details.website),
          };
          
          setForm(fetchedForm);
          setOriginalForm(fetchedForm);
          setExistingId(data.basicdetails.id);
        } else if (response.status === 404) {
          setOriginalForm(form);
          setExistingId(null);
        } else {
          throw new Error('Unexpected server response');
        }
      } catch (err) {
        console.error('Fetch Error:', err.message);
        setError('Error fetching existing details.');
      } finally {
        setLoading(false);
      }
    
    };
    fetchDetails();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Function to save data
  const saveData = async () => {
    const methodType = existingId ? 'PUT' : 'POST';
    const finalUrl = existingId ? `${url}${existingId}/` : url;
  
    const postData = {
      method: methodType,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, user: userId }),
    };
  
    try {
      const response = await fetch(finalUrl, postData);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save data');
      }
  
      const data = await response.json();
      console.log('Saved Successfully:', data);
      setOriginalForm(form);
      setExistingId(data.id); // update with ID if newly created
      return true;
    } catch (error) {
      console.error('Save Error:', error.message);
      setError(error.message);
      return false;
    }
  };
  

  // ✅ Compare form and originalForm
  const isFormChanged = () => {
    return JSON.stringify(form) !== JSON.stringify(originalForm);
  };

  // ✅ Handle Next
  const handleNext = async () => {
    setIsSubmitting(true);

    if (originalForm && !isFormChanged()) {
      console.log("No changes detected, moving next...");
      navigate('/experience');
    } else {
      const success = await saveData();
      if (success) {
        navigate('/experience');
      } else {
        alert('Failed to save data.');
      }
    }

    setIsSubmitting(false);
  };

  // ✅ Handle Back
  const handleBack = async () => {
    setIsSubmitting(true);

    if (originalForm && !isFormChanged()) {
      console.log("No changes detected, moving back...");
      navigate('/dashboard');
    } else {
      const success = await saveData();
      if (success) {
        navigate('/dashboard');
      } else {
        alert('Failed to save data.');
      }
    }

    setIsSubmitting(false);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container py-4">
      <form className="max-w-md mx-auto">
        <h2 className="text-center mb-4">Basic Details</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        {Object.entries(form).map(([key, value]) => (
          <div key={key} className="mb-3">
            <label className="form-label text-capitalize">{key}</label>
            <input
              type="text"
              name={key}
              value={value}
              onChange={handleChange}
              className="form-control"
              required={key === 'name' || key === 'email' || key === 'phone'} // mandatory fields
            />
          </div>
        ))}

        <div className="d-flex justify-content-between mt-4">
          <button
            type="button"
            onClick={handleBack}
            disabled={isSubmitting}
            className="btn btn-outline-secondary"
          >
            {isSubmitting ? "Saving..." : "Back"}
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={isSubmitting}
            className="btn btn-primary"
          >
            {isSubmitting ? "Saving..." : "Next"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BasicDetailsForm;
