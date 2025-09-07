
import React, { useState, useCallback } from 'react'; 
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from '../components/Navbar.jsx';
import DrawingMap from '../components/DrawingMap.jsx';
import WorkRequestForm from '../components/WorkRequestForm.jsx';
import '../css/RequestWork.css';

export default function RequestWorkPage() {
  const [drawnGeometry, setDrawnGeometry] = useState(null);

 
  const handleDrawComplete = useCallback((geometry) => {
    setDrawnGeometry(geometry);
  }, []);

  const handleFinalSubmit = (requestData) => {
    console.log("--- FINAL DATA TO BE SENT TO BACKEND ---");
    console.log(JSON.stringify(requestData, null, 2));  
    
    /*
    try {
      const response = await fetch('/api/work-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // If you have authentication, you'll need to add the token here
          // 'Authorization': `Bearer ${your_auth_token}`
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        // Handle server errors (e.g., 400, 500)
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong on the server.');
      }

      const result = await response.json();
      console.log('Successfully submitted:', result);
      alert("Work request has been successfully submitted!");
      setDrawnGeometry(null); // Reset the form on success

    } catch (error) {
      console.error('Failed to submit work request:', error);
      alert(`Error: ${error.message}`);
    }
    */                                                                       //<<=========backend integration point
    
    alert("Work request has been submitted!");
    setDrawnGeometry(null); 

  };

  return (
    <>
      <Navbar state="stakeholder_logged_in" />
      <div className="content-wrapper">
        <div className="request-work-page">
          {!drawnGeometry && (
             <motion.div 
                className="map-instruction-overlay" 
                initial={{ y: -50, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }}
             >
                Please draw the work area on the map to begin
             </motion.div>
          )}

         
          <DrawingMap onDrawComplete={handleDrawComplete} />

          <AnimatePresence>
            {drawnGeometry && (
              <WorkRequestForm
                geometry={drawnGeometry}
                onSubmit={handleFinalSubmit}
                onCancel={() => setDrawnGeometry(null)}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}