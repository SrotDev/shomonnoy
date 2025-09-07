// src/pages/AuthorityConflictChart.js
import React, { useState } from 'react';
import Navbar from "../components/Navbar";
import ConflictChartWithButtons from "../components/conflictChart";
import MapModal from '../components/MapModal.jsx'; 
import '../css/ConflictChart.css';

export default function AuthorityConflictChart() {
  
  const [isMapModalOpen, setMapModalOpen] = useState(false);
  const [selectedTaskForMap, setSelectedTaskForMap] = useState(null);

  
  const handleOpenMap = (taskGroup) => {
    console.log("Opening map for conflict group:", taskGroup);
   
    if (taskGroup && taskGroup.length > 0) {
      setSelectedTaskForMap(taskGroup[0]);
      setMapModalOpen(true);
    }
  };

  const handleCloseMap = () => {
    setMapModalOpen(false);
    setSelectedTaskForMap(null);
  };

  return (
    <>
      <Navbar state="authority_logged_in" />
      <div className="content-wrapper">
        <div className="conflict-page-container">
       
          <ConflictChartWithButtons onMapClick={handleOpenMap} />
        </div>
      </div>

      
      <MapModal
        isOpen={isMapModalOpen}
        onClose={handleCloseMap}
        taskData={selectedTaskForMap}
      />
    </>
  );
}