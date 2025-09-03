
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';


import 'leaflet/dist/leaflet.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-draw/dist/leaflet.draw.css';


import 'leaflet-control-geocoder';
import 'leaflet-draw';


import './map.css';


import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});



const MapView = ({ isCompany = true }) => {
 
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);

 
  const [drawnGeometry, setDrawnGeometry] = useState(null);
  const [showRequestForm, setShowRequestForm] = useState(false);

  
  useEffect(() => {
   
    if (!mapRef.current || leafletMapRef.current) return;

   
    const map = L.map(mapRef.current, {
      zoomControl: false, 
    }).setView([23.75, 90.39], 13); 

    
    leafletMapRef.current = map;

    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

 
    L.control.zoom({ position: 'bottomleft' }).addTo(map);
    L.Control.geocoder({ defaultMarkGeocode: true, position: 'bottomleft' }).addTo(map);

   
    if (isCompany) {
      const drawControl = new L.Control.Draw({
        position: 'bottomright',
        draw: {
          polyline: true, 
          polygon: false, rectangle: false, circle: false, marker: false, circlemarker: false,
        },
        edit: false, 
      });
      map.addControl(drawControl);

      
      map.on('draw:created', function (e) {
        const layer = e.layer;
        if (!layer) return;

       
        const latlngs = layer.getLatLngs();
        const coordinates = latlngs.map((p) => [p.lng, p.lat]);
        const geojsonLine = { type: 'LineString', coordinates };

        console.log('✅ Stakeholder drew a road:', geojsonLine);

       
        setDrawnGeometry(geojsonLine);
        setShowRequestForm(true);
      });
    }

    const drawRoad = (feature) => {
      const props = feature.properties;
      const color = props.status === 'under_construction' ? 'red' :
                    props.status === 'fixed' ? 'green' :
                    props.status === 'upcoming' ? 'orange' : '#3b82f6'; 

      const lineLayer = L.geoJSON(feature, { style: { color, weight: 5, opacity: 0.9 } }).addTo(map);

 
      lineLayer.on('click', () => {
        const popupContent = `
          <b>${props.name || 'Unnamed Project'}</b><br/>
          <b>Company:</b> ${props.company || 'N/A'}<br/>
          <b>Reason:</b> ${props.reason || 'N/A'}<br/>
          <b>Status:</b> ${props.status || 'Pending'}<br/>
        `;
        L.popup().setLatLng(lineLayer.getBounds().getCenter()).setContent(popupContent).openOn(map);
      });
    };

    
    fetch('http://localhost:5000/api/roads')
      .then((res) => res.json())
      .then((geojson) => {
        console.log('🗺️ Loaded road data from backend:', geojson);
        geojson.features.forEach(drawRoad);
      })
      .catch((err) => console.error('❌ Error loading roads:', err));
    
    return () => {
        map.remove();
        leafletMapRef.current = null;
    };
  }, [isCompany]); 


  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = {
      name: formData.get('name'),
      company: formData.get('company'),
      start_date: formData.get('start'),
      end_date: formData.get('end'),
      reason: formData.get('reason'),
      geometry: drawnGeometry
    };

    console.log('Submitting payload:', payload);

    fetch('http://localhost:5000/api/road_requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        alert('✅ Request submitted successfully!');
        setShowRequestForm(false);
        setDrawnGeometry(null);
        
      })
      .catch(err => {
        alert('❌ Submission failed. See console for details.');
        console.error(err);
      });
  };

  return (
    <div className="map-view-container">
      <div ref={mapRef} className="leaflet-container" />

      {showRequestForm && drawnGeometry && (
        <div className="map-modal-overlay">
          <div className="map-modal-content">
            <h2>🚧 Submit Road Work Request</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label>Road Name</label>
                <input type="text" name="name" required />
              </div>
              <div className="form-group">
                <label>Company</label>
                <input type="text" name="company" required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <input type="date" name="start" required />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input type="date" name="end" required />
                </div>
              </div>
              <div className="form-group">
                <label>Reason for Work</label>
                <textarea name="reason" required rows="3" />
              </div>
              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowRequestForm(false)}>Cancel</button>
                <button type="submit" className="btn-submit">Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;