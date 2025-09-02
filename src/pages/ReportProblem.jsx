import React, { useState } from 'react';
import './ReportProblem.css'; // Optional styling — make sure this file exists or remove this line
console.log("🧾 ReportProblem component loaded");

const ReportProblem = () => {
  const [formData, setFormData] = useState({
    name: '',
    issueType: '',
    description: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("🚀 Submitted:", formData);

    // Temporary confirmation
    alert("✅ Your report has been saved locally. Backend coming soon!");
  };

  return (
    <div className="report-problem">
      <h2>🛠 Citizen Report Form</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Affected Road Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <select
          name="issueType"
          value={formData.issueType}
          onChange={handleChange}
          required
        >
          <option value="">Select Problem Type</option>
          <option value="potholes">Potholes</option>
          <option value="blocked_drain">Blocked Drain</option>
          <option value="waterlogging">Waterlogging</option>
          <option value="damaged_road">Damaged Road</option>
        </select>

        <textarea
          name="description"
          placeholder="Describe the issue briefly"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <button type="submit">Submit Report</button>
      </form>
    </div>
  );
};

export default ReportProblem;
