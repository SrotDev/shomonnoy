// src/components/Map/MapView.jsx - FINAL CORRECTED VERSION

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import './map.css'; // Use the simplified CSS for the map view

import 'leaflet-control-geocoder';
import 'leaflet-draw';


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
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [drawnGeometry, setDrawnGeometry] = useState(null);
  const [showRequestForm, setShowRequestForm] = useState(false);

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false,
    }).setView([23.75, 90.39], 13);
    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    L.control.zoom({ position: 'bottomleft' }).addTo(map);
    L.control.attribution({ position: 'bottomright' }).addTo(map);
    
    const geocoder = L.Control.geocoder({ defaultMarkGeocode: true, position: 'bottomleft' });
    geocoder.on('markgeocode', (e) => map.panTo(e.geocode.center));
    geocoder.addTo(map);

    if (isCompany) {
      const drawControl = new L.Control.Draw({
        position: 'bottomright',
        draw: { polyline: true, polygon: false, rectangle: false, circle: false, marker: false, circlemarker: false },
        edit: false,
      });
      map.addControl(drawControl);

      map.on('draw:created', (e) => {
        const layer = e.layer;
        const latlngs = layer.getLatLngs();
        const coordinates = latlngs.map(p => [p.lng, p.lat]);
        setDrawnGeometry({ type: 'LineString', coordinates });
        setShowRequestForm(true);
      });
    }

    const drawRoad = (feature) => {
      const props = feature.properties;

      // FIX: This logic correctly colors lines based on their STATUS to match the 3-color legend.
      const color = 
        props.status === 'Ongoing' ? '#ef4444' :   // Red
        props.status === 'Completed' ? '#22c55e' : // Green
        props.status === 'Planned' ? '#f97316' :   // Orange
        '#888888'; // A neutral grey for any data without a valid status

      const lineLayer = L.geoJSON(feature, { 
        style: { color, weight: 8, opacity: 0.85, lineCap: 'round', lineJoin: 'round' } 
      }).addTo(map);

      lineLayer.on('click', () => {
        const popupContent = `
          <div class="map-popup">
            <h3>${props.name || 'Unnamed Project'}</h3>
            <p><strong>Company:</strong> ${props.company || 'N/A'}</p>
            <p><strong>Status:</strong> <span class="status-${props.status?.toLowerCase()}">${props.status || 'N/A'}</span></p>
            <p><strong>Timeline:</strong> ${props.timeline || 'N/A'}</p>
            <p><strong>Reason:</strong> ${props.reason || 'N/A'}</p>
          </div>
        `;
        L.popup().setLatLng(lineLayer.getBounds().getCenter()).setContent(popupContent).openOn(map);
      });
    };

    fetch('http://localhost:5000/api/roads')
      .then(res => res.json())
      .then(geojson => geojson.features.forEach(drawRoad))
      .catch(err => console.error('❌ Error loading roads:', err));
      
    return () => { map.remove(); mapInstanceRef.current = null; };
  }, [isCompany]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = {
      name: formData.get('name'),
      company: formData.get('company'),
      status: formData.get('status'),
      timeline: `${formData.get('start_date')} to ${formData.get('end_date')}`,
      reason: formData.get('reason'),
      geometry: drawnGeometry,
    };

    fetch('http://localhost:5000/api/road_requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(res => res.json())
      .then(data => {
        alert('✅ Request submitted successfully!');
        setShowRequestForm(false);
        setDrawnGeometry(null);
        window.location.reload();
      })
      .catch(err => alert('❌ Submission failed.'));
  };

  return (
    <>
      <div className="map-view-container" ref={mapContainerRef} />
      
      {showRequestForm && (
        <div className="map-modal-overlay">
          <div className="map-modal-content">
            <h2>🚧 Submit Road Work Request</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group"><label>Road Name</label><input type="text" name="name" required /></div>
              <div className="form-group"><label>Company</label><input type="text" name="company" required /></div>
              <div className="form-row">
                <div className="form-group"><label>Start Date</label><input type="date" name="start_date" required /></div>
                <div className="form-group"><label>End Date</label><input type="date" name="end_date" required /></div>
              </div>
              <div className="form-group"><label>Status</label>
                <select name="status" required>
                  <option value="Planned">Planned</option>
                  <option value="Ongoing">Ongoing</option>
                </select>
              </div>
              <div className="form-group"><label>Reason for Work</label><textarea name="reason" required rows="3" /></div>
              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowRequestForm(false)}>Cancel</button>
                <button type="submit" className="btn-submit">Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default MapView;