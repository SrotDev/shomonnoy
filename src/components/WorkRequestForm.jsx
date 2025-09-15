import React, { useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useNavigate } from "react-router-dom"

const baseUrl = import.meta.env.VITE_BASE_URL;

export default function WorkRequestForm({ geometry, onSubmit, onCancel, state }) {
  const [stakeholders, setStakeholders] = useState([]);


  useEffect(() => {
    async function fetchStakeholders() {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) return;

      try {
        const response = await fetch(`${baseUrl}/users/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          console.error("Failed to fetch stakeholders");
          return;
        }

        const users = await response.json();
        console.log(users)
        const onlyStakeholders = users.filter(u => u.role === "stakeholder");
        setStakeholders(onlyStakeholders);
      } catch (err) {
        console.error("Error fetching stakeholders:", err);
      }
    }
    if(state === "Admin"){

      fetchStakeholders();
    }
  }, []);



  const [formData, setFormData] = useState({
    uuid: '',
    startDate: '',
    endDate: '',
    reason: '',
    city: '',
    budget: '',
    days: 0,
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
          <label htmlFor="budget">City</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            placeholder="e.g. Dhaka"
          />
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


        <div className="form-group">
          <label htmlFor="days">Estimated time (in days)</label>
          <input
            type="number"
            id="days"
            name="days"
            value={formData.days}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              if (value > 0 || e.target.value === "") {
                handleChange(e); 
              }
            }}
            required
            placeholder="e.g., 50"
            min={1}  
            step={1}  
          />
        </div>




        {
          state === "Admin" && (
            <div className="form-group">
              <label htmlFor="stakeholder">Stakeholder Name</label>
              <select
                id="uuid"
                name="uuid"
                value={formData.uuid || ""}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Stakeholder --</option>
                {stakeholders.map((s) => (
                  <option key={s.uuid} value={s.uuid}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          )
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