// src/App.js - FINAL CORRECTED VERSION

import './App.css';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import ReportProblem from './pages/ReportProblem';
import MapPage from './pages/MapPage';
import { Routes, Route } from 'react-router-dom';
import NoticePage from './pages/NoticePage/NoticePage';
import Authentication from './pages/authentication';


const userLoggedIn = true;

function App() {
  return (
    <div className="app-container">
      <Navbar state="non_logged_in" />

    
      <main className="content-wrapper">
        <Routes>
         
         
          <Route path="/" element={<LandingPage />} />

          <Route path="/authenticate" element={<Authentication/>}/>
          
         
          <Route path="/authority" element={<MapPage />} />

         <Route path="/noticeboard" element={<NoticePage />} />

         
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

          

        </Routes>
      </main>


    </div>
  );
}

export default App;