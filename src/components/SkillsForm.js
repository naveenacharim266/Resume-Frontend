import React, { useState } from "react";

const Skills = () => {
  const [skill, setSkill] = useState({});

  const handleChange = (e) => {
    setSkill({ [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = "http://127.0.0.1:8000/api/addSkills/";

    const payload = {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify(skill),
    };

    fetch(url, payload)
      .then((response) => {
        if (!response.ok) {
          return response.json().then((err) => {
            throw new Error(err.message || "Unknown error");
          });
        }
        return response.json();
      })
      .then((info) => {
        alert("Saved successfully: " + info.status);
      })
      .catch((error) => {
        alert("Error: " + error.message);
      });
  };

  return (
    <form onSubmit={handleSubmit} className="container">
      <h1>Skills</h1>
      <div>
        <label>Skill name</label>
        <input
          className="form-control"
          type="text"
          onChange={handleChange}
          name="skillname"
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default Skills;
