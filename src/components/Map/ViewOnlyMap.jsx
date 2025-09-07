// src/components/Map/ViewOnlyMap.jsx
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './map.css'; 


import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: iconRetinaUrl,
    iconUrl: iconUrl,
    shadowUrl: shadowUrl,
});


const mockRoadsData = [
  { "type": "Feature", "properties": { "name": "Mirpur Road Repair", "company": "WASA", "status": "Ongoing" }, "geometry": { "type": "LineString", "coordinates": [[90.365, 23.775], [90.375, 23.785]] } },
  { "type": "Feature", "properties": { "name": "Gulshan Avenue Paving", "company": "RHD", "status": "Planned" }, "geometry": { "type": "LineString", "coordinates": [[90.41, 23.79], [90.42, 23.80]] } },
];

export default function ViewOnlyMap() {
    const mapRef = useRef(null);
    const isMapInitialized = useRef(false);

    useEffect(() => {
        if (mapRef.current && !isMapInitialized.current) {
            isMapInitialized.current = true;
            
            const map = L.map(mapRef.current, {
                zoomControl: false, 
                attributionControl: false,
            }).setView([23.8103, 90.4125], 13); 

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
            L.control.zoom({ position: 'bottomright' }).addTo(map);

           
            const drawRoad = (feature) => {
                const props = feature.properties;
                const color = props.status === 'Ongoing' ? '#ef4444' : '#f97316';
                const lineLayer = L.geoJSON(feature, { style: { color, weight: 6, opacity: 0.8 } }).addTo(map);
                
                lineLayer.bindPopup(`<div class="map-popup"><h3>${props.name}</h3><p><strong>Company:</strong> ${props.company}</p><p><strong>Status:</strong> ${props.status}</p></div>`);
            };

            mockRoadsData.forEach(drawRoad);
        }
    }, []);

    return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />;
}