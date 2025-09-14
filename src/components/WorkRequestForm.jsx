import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function WorkRequestForm({ geometry, onSubmit, onCancel, state }) {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: '',

    budget: '',
    isEmergency: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const finalRequestData = {
      ...formData,
      geometry,
    };
    onSubmit(finalRequestData);
  };

  return (
    <motion.div
      className="work-request-form-container overflow-y-scroll"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
    >
      <form onSubmit={handleSubmit}>
        <h2>Work Request Details</h2>

        <div className="date-inputs">
          <div className="form-group">
            <label htmlFor="startDate">Start Date</label>
            <input type="date" id="startDate" name="startDate" value={formData.startDate} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="endDate">End Date</label>
            <input type="date" id="endDate" name="endDate" value={formData.endDate} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="reason">Reason for Work</label>
          <textarea id="reason" name="reason" value={formData.reason} onChange={handleChange} required placeholder="e.g., Main water pipeline repair..."></textarea>
        </div>


        <div className="form-group">
          <label htmlFor="budget">Budget (in BDT)</label>
          <input
            type="number"
            id="budget"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            required
            placeholder="e.g., 50000"
          />
        </div>
        {
          state === "Admin" && <div className="form-group">
            <label htmlFor="Stakeholder name">Stakeholder Name</label>
            <input
              type="text"
              id="stakeholder"
              name="stakeholder"

              onChange={handleChange}
              required
              placeholder="e.g., WASA"
            />
          </div>
        }



        <div className="checkbox-group">
          <input type="checkbox" id="isEmergency" name="isEmergency" checked={formData.isEmergency} onChange={handleChange} />
          <label htmlFor="isEmergency">This is an emergency request</label>
        </div>

        <div className="form-actions">
          <button type="button" className="form-button cancel" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="form-button submit">
            Submit Request
          </button>
        </div>
      </form>
    </motion.div>
  );
}