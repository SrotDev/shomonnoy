

import React, { useState } from 'react';
import './ReportProblem.css';
import illustrationImage from './my-illustration.png';
import Navbar from '../components/Navbar';

const ReportProblem = () => {

  const [formData, setFormData] = useState({ name: '', issueType: '', description: '' });
  const handleChange = (e) => { setFormData(prev => ({ ...prev, [e.target.name]: e.target.value })); };
  const handleSubmit = (e) => { e.preventDefault(); alert("Submitted!"); };

  return (
    <>
      <Navbar state="user_logged_in"/>
      <div className="main-wrapper">
        <div className="form-container">

          <div className="graphic-side">
            <img
              src={illustrationImage}
              alt="Citizen Report Illustration"
              className="illustration"
            />
          </div>

          <div className="form-side">

            <h2>Report an Issue</h2>
            <p className="subtitle">Please fill out the form below.</p>
            <form onSubmit={handleSubmit}>

              <div className="form-group">
                <label htmlFor="name">Affected Road Name</label>
                <input type="text" id="name" name="name" className="form-control" placeholder="e.g., Main Street, Block 5" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="issueType">Select Problem Type</label>
                <div className="select-wrapper"><select id="issueType" name="issueType" className="form-control" value={formData.issueType} onChange={handleChange} required><option value="" disabled>Choose a problem...</option>
                  <option value="potholes">Potholes</option>
                  <option value="blocked_drain">Blocked Drain</option>
                </select>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="description">Describe the issue briefly</label>
                <textarea id="description" name="description" className="form-control" placeholder="Provide details like landmark, severity, etc." value={formData.description} onChange={handleChange} required /></div>
              <button type="submit" className="submit-btn">Submit Report</button>
            </form>
          </div>
        </div>
      </div>
    </>

  );
};

export default ReportProblem;