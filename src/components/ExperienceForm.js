import React,{useState} from "react";

const ExperienceForm = () => {
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
  
    const handleChange = e => {
      setForm({ ...form, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = e => {
      e.preventDefault();
      let userId = 1;
      let url = 'http://127.0.0.1:8000/api/addExperience/';
      let postData = {
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
          alert('Saved Successfully: ' + info.status);
        })
        .catch(error => {
          alert('Error: ' + error.message);
        });
    };
  
    return (
      <form onSubmit={handleSubmit} className="container">
        <h1>Add Experience Details</h1>
        {Object.entries(form).map(([key, value]) => (
          <div key={key} className="mb-2 row">
            <label className="inline-block text-capitalize">{key}</label>
            <input
              type={key.includes("date") ? "date" : "text"}
              name={key}
              value={value}
              onChange={handleChange}
              className="border rounded form-control"
            />
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
    );
  };
export default ExperienceForm;  