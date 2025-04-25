import React, { useState } from "react";

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

  const [isSubmitting, setIsSubmitting] = useState(false);

  const url = 'http://127.0.0.1:8000/api/basicDetails/';
  const userId = 1;

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    setIsSubmitting(true);

    const postData = {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({ ...form, user: userId })
    };

    fetch(url, postData)
      .then(response => {
        if (!response.ok) {
          return response.json().then(err => {
            throw new Error(err.message || "Unknown error");
          });
        }
        return response.json();
      })
      .then(info => {
        alert('Saved successfully: ' + info.status);
      })
      .catch(error => {
        alert('Error: ' + error.message);
      })
      .finally(() => setIsSubmitting(false));
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md">
      <h2 className="text-xl font-bold mb-4">Basic Details</h2>
      {
        Object.entries(form).map(([key, value]) => (
          <div key={key} className="mb-3 row">
            <label className="inline-block text-capitalize">{key}</label>
            <input
              type="text"
              name={key}
              value={value}
              onChange={handleChange}
              className="border rounded w-full p-2 form-control"
            />
          </div>
        ))
      }
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};

export default BasicDetailsForm;
