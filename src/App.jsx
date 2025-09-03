

import './App.css';
import MapView from './components/Map/map';
import Navbar from './components/Navbar';
import ReportProblem from './pages/ReportProblem';
import LandingPage from './pages/LandingPage'; 
import { Routes, Route } from 'react-router-dom';

const userLoggedIn = true;

function App() {
  return (
    <div className="app-container">
      <Navbar state="user_logged_in" />

    
      <main className="content-wrapper">
        <Routes>
         
          <Route path="/" element={<LandingPage />} />

         
          <Route path="/authority" element={
            <div className="map-wrapper">
              <div style={{ width: '100%', height: '800px' }}>
                <MapView center={[23.7806, 90.4070]} zoom={13} />
              </div>
            </div>
          } />

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

      <footer>
        <h3>Additional Content</h3>
      </footer>
    </div>
  );
}

export default App;