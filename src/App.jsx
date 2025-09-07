// src/App.js - FINAL CORRECTED VERSION

import './App.css';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import ReportProblem from './pages/ReportProblem';
import MapPage from './pages/MapPage';
import { Routes, Route } from 'react-router-dom';
import NoticePage from './pages/NoticePage/NoticePage';
import Authentication from './pages/authentication';
import StakeholderDashboard from './pages/stakeholderDashboard';
import StakeholderNewReq from './pages/stakeholderNewReq';
import StakeholderWorkReq from './pages/stakeholderWorkReq';
import AuthorityDashboard from './pages/authorityDashboard';
import AuthorityWorkRequests from './pages/authorityWorkRequests';
import AuthorityWorkReqConflicted from './components/authorityWorkReqConflict';
import AuthorityConflictChart from './pages/authorityConflictChart';
const userLoggedIn = true;

function App() {
  return (
    <div className="app-container">
      

    
      <main className="content-wrapper">
        <Routes>
         
         
        <Route path="/" element={<LandingPage />} />
        <Route path="/noticeboard" element={<NoticePage state="normal"/>} />
        <Route
            path="/complaint/issueReporting"
            element={
              userLoggedIn ? (
                <ReportProblem />
              ) : (
                <h2 style={{ textAlign: 'center', marginTop: '50px' }}>
                  🔒 অনুগ্রহ করে লগইন করুন (Please log in to access this page)
                </h2>
              )
            }
          />

          <Route path="/stakeholder/requestWork" element={<RequestWorkPage />}></Route>
        
        <Route path="/authenticate" element={<Authentication/>}/>


        <Route path="/stakeholder" element={<StakeholderDashboard /> } />
        <Route path="/stakeholder/new-request" element={<StakeholderNewReq/>} />
        <Route path="/stakeholder/pending-requests" element={<StakeholderWorkReq />} />
        <Route path="/stakeholder/noticeboard" element={<NoticePage state="normal"/>} />
         
        <Route path="/authority" element={<AuthorityDashboard />} />
        <Route path="/authority/work-requests" element={<AuthorityWorkRequests/>} />
        <Route path="/authority/conflict-chart" element={<AuthorityConflictChart/>} />
        <Route path="/authority/noticeboard" element={<NoticePage state="admin"/>} />
         
        </Routes>
      </main>


    </div>
  );
}

export default App;