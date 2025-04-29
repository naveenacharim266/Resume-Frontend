import React, { useRef, useEffect, useState } from 'react';
import html2pdf from 'html2pdf.js';
import '../css/ResumePreview.css'; // optional custom CSS

const ResumePreview = () => {
  const resumeRef = useRef();
  const [resumeData, setResumeData] = useState(null);
  const [error, setError] = useState(null);

  // Function to download as PDF
  const handleDownloadPDF = () => {
    const opt = {
      margin: 0.3,
      filename: 'Naveenachari_Resume.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
    };
    html2pdf().set(opt).from(resumeRef.current).save();
  };

  // Function to fetch resume data
  const fetchResumeData = async () => {
    try {
      const userId = localStorage.getItem('userId');
    //   if (!userId) {
    //     throw new Error('User ID not found. Please login.');
    //   }
        //`http://127.0.0.1:8000/api/getResumeData/?user_id=${userId}
      const response = await fetch(`http://127.0.0.1:8000/api/getResumeData/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.status === 'success') {
        setResumeData(data.data);
      } else {
        throw new Error(data.message || 'Unknown error from API');
      }
    } catch (error) {
      console.error('Fetching resume failed:', error.message);
      setError(error.message);
    }
  };

  // useEffect to fetch data when component loads
  useEffect(() => {
    fetchResumeData();
  }, []);

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-center mb-3">
        <button className="btn btn-primary px-4" onClick={handleDownloadPDF}>
          Download as PDF
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      
      {resumeData ? (
        <div ref={resumeRef} className="resume-box p-5 bg-white rounded shadow mx-auto">

          {/* Header */}
          <div className="text-center">
            <h2 className="fw-bold">{resumeData.basic.name}</h2>
            <p className="mb-0">{resumeData.basic.location || 'Bengaluru, Karnataka, India'}</p>
            <p className="mb-0">{resumeData.basic.email} | {resumeData.basic.phone}</p>
            <p>
              <a href={resumeData.basic.linkedin} target="_blank" rel="noreferrer">LinkedIn</a> |{' '}
              <a href={resumeData.basic.website} target="_blank" rel="noreferrer">Portfolio</a>
            </p>
          </div>

          <hr />

          {/* Summary */}
          <section className="mb-4">
            <h5 className="fw-bold">Summary</h5>
            <p>{resumeData.basic.summary}</p>
          </section>

          {/* Experience */}
          <section className="mb-4">
            <h5 className="fw-bold">Experience</h5>
            {resumeData.experience.map((exp, idx) => (
              <div key={idx}>
                <p className="fw-semibold mb-1">{exp.title} at {exp.organization}</p>
                <p className="text-muted">{exp.startdate} - {exp.enddate}</p>
                <p>{exp.description}</p>
              </div>
            ))}
          </section>

          {/* Projects */}
          <section className="mb-4">
            <h5 className="fw-bold">Projects</h5>
            {resumeData.projects.map((proj, idx) => (
              <div key={idx}>
                <p><strong>{proj.project_title}</strong> — {proj.client}</p>
                <p>{proj.project_details}</p>
              </div>
            ))}
          </section>

          {/* Education */}
          <section className="mb-4">
            <h5 className="fw-bold">Education</h5>
            {resumeData.education.map((edu, idx) => (
              <div key={idx}>
                <p><strong>{edu.degree}</strong> - {edu.university}</p>
                <p className="text-muted">{edu.startdate} - {edu.enddate}</p>
                <p>{edu.specialization}</p>
              </div>
            ))}
          </section>

          {/* Skills */}
          <section className="mb-4">
            <h5 className="fw-bold">Skills</h5>
            <ul className="mb-0">
              {resumeData.skills.map((skill, idx) => (
                <li key={idx}>{skill}</li>
              ))}
            </ul>
          </section>

        </div>
      ) : (
        <p className="text-center">Loading resume data...</p>
      )}
    </div>
  );
};

export default ResumePreview;
