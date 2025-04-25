// components/Dashboard.js
import React from 'react';
import '../css/dashboard.css';

export default function Dashboard() {
  return (
    <div className="dashboard">
      <h2 className="dashboard-title">Resumes</h2>
      
      <div className="resume-grid">
        {/* Create new resume */}
        <div className="create-resume-card">
          <span className="create-resume-text">+ Create new resume</span>
        </div>

        {/* Empty Resume Card */}
        <div className="resume-card">
          <p className="resume-main-text">Open resume to start</p>
          <p className="resume-subtext">
            <span className="resume-name">naveen</span><br />
            <span className="resume-date">Edited 6 days ago</span>
          </p>
        </div>

        {/* Filled Resume Card */}
        <div className="resume-card">
          <h3 className="resume-title">Naveenachari M</h3>
          <p className="resume-role">Full Stack Developer</p>
          <p className="resume-name">Naveen Resume</p>
          <p className="resume-date">Edited 6 days ago</p>
        </div>
      </div>
    </div>
  );
}
