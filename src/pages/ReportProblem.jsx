

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import './ReportProblem.css';
import illustrationImage from './my-illustration.png';
import Navbar from '../components/Navbar';
import PreLoader2 from './LoadingPage';

const baseUrl = "https://shomonnoy-backend.onrender.com/api";

const ReportProblem = () => {

  const [formData, setFormData] = useState({ name: '', issueType: '', description: '' });
  const handleChange = (e) => { setFormData(prev => ({ ...prev, [e.target.name]: e.target.value })); };
  const handleSubmit = (e) => { e.preventDefault(); };
  const [navState, setNavState] = useState("non_logged_in");
  const [navName, setNavName] = useState("");
  const [isLoading, setIsLoading] = useState(true)
  const [uuid, setuuid] = useState("")


  const Navigate = useNavigate()

  async function checkAvailablility() {
    try {
      console.log("request sent");
      const response = await fetch(`${baseUrl}/`, { method: "GET" });

      if (!response.ok) {
        console.log("Backend not ready, status:", response.status);
        return false;
      }

      const data = await response.json();
      console.log("Backend response:", data);
      return true;
    } catch (err) {
      console.error("Error checking availability:", err);
      return false;
    }
  }

  useEffect(() => {
    let intervalId;

    async function pollAvailability() {
      const available = await checkAvailablility();
      if (available) {
        var accessToken = localStorage.getItem('access_token');
        if (accessToken) {

          const userInfo = await fetch(`${baseUrl}/profile/`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            },

          });

          const userData = await userInfo.json()
          if (!userInfo.ok) {
            console.log("Here")
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("access_token")
            Navigate("/authenticate")
          } else {
            if (userData.role === "stakeholder") {
              setNavState("stakeholder_logged_in")
            } else {
              console.log("Here")
              localStorage.removeItem("refresh_token");
              localStorage.removeItem("access_token")
              Navigate("/authenticate")
            }

            setNavName(userData.name)
            setuuid(userData.uuid)
          }






        } else {
          setNavState("non_logged_in");
          setNavName("Login")
        }

        setIsLoading(false)
        if (intervalId) {
          clearInterval(intervalId);
        }
      }
    }

    async function getUserRole(accessToken) {

    }



    pollAvailability();
    intervalId = setInterval(pollAvailability, 5000);



    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);



  if (isLoading) {
    return (
      <PreLoader2 />
    )
  }

  return (
    <>
      <Navbar state={navState} name={navName} />
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