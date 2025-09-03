import React from 'react';
import MapView from '../components/Map/map';
import MapSidePanel from '../components/Map/MapSidePanel'; 
import './MapPage.css';

const MapPage = () => {
  return (
    <div className="map-page-container">
      <MapSidePanel />
      <div className="map-display-area">
        <MapView isCompany={true} />
      </div>
    </div>
  );
};

export default MapPage;