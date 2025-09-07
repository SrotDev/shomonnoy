import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import './map.css';

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


const mockRoadsData = [
  {
    "type": "Feature",
    "properties": {
      "name": "Mirpur Road Repair",
      "company": "WASA",
      "status": "Ongoing", 
      "timeline": "1 Oct - 30 Oct",
      "reason": "Main pipeline maintenance"
    },
    "geometry": { "type": "LineString", "coordinates": [[90.365, 23.775], [90.375, 23.785]] }
  },
  {
    "type": "Feature",
    "properties": {
      "name": "Gulshan Avenue Paving",
      "company": "RHD",
      "status": "Planned", 
      "timeline": "1 Nov - 15 Nov",
      "reason": "Road resurfacing project"
    },
    "geometry": { "type": "LineString", "coordinates": [[90.41, 23.79], [90.42, 23.80]] }
  },
  {
    "type": "Feature",
    "properties": {
      "name": "Dhanmondi Cable Work",
      "company": "BTCL",
      "status": "Completed", 
      "timeline": "1 Sep - 25 Sep",
      "reason": "Fiber optic cable installation"
    },
    "geometry": { "type": "LineString", "coordinates": [[90.37, 23.74], [90.38, 23.75]] }
  }
];

const MapView = ({ requestData, isCompany = false, uuid=undefined }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const highlightLayerRef = useRef(null);
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
    const geocoder = L.Control.geocoder({ defaultMarkGeocode: true, position: 'bottomleft' }).addTo(map);
    geocoder.on('markgeocode', (e) => map.panTo(e.geocode.center));

    const drawRoad = (feature) => {
      const props = feature.properties;
      const color =
        props.status === 'Ongoing' ? '#ef4444' :
          props.status === 'Completed' ? '#22c55e' :
            props.status === 'Planned' ? '#f97316' :
              '#888888';

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

    
    mockRoadsData.forEach(drawRoad);

    
    return () => { if (map) { map.remove(); mapInstanceRef.current = null; } };
  }, [isCompany]);

  
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (highlightLayerRef.current) {
      map.removeLayer(highlightLayerRef.current);
    }

    if (requestData && requestData.geometry) {
      const geoJsonFeature = {
        "type": "Feature",
        "properties": { ...requestData },
        "geometry": requestData.geometry
      };

      const requestLayer = L.geoJSON(geoJsonFeature, {
        style: {
          color: '#3b82f6',
          weight: 10,
          opacity: 0.9,
        }
      }).addTo(map);

      requestLayer.on('click', () => {
        const props = geoJsonFeature.properties;
        const popupContent = `
          <div class="map-popup selected-popup">
            <h3>Selected: ${props.id || 'N/A'}</h3>
            <p><strong>Timeline:</strong> ${props.from || ''} - ${props.to || ''}</p>
            ${props.isEmergency ? '<p><strong class="emergency">This is an emergency request.</strong></p>' : ''}
          </div>
        `;
        L.popup()
          .setLatLng(requestLayer.getBounds().getCenter())
          .setContent(popupContent)
          .openOn(map);
      });
      

      highlightLayerRef.current = requestLayer;
      map.flyToBounds(requestLayer.getBounds(), { padding: [50, 50] });
    }
  }, [requestData]);

  
  return (
    <>
      <div className="map-view-container" ref={mapContainerRef} />
      
    </>
  );
};

export default MapView;