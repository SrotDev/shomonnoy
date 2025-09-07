
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet-draw';

import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetinaUrl,
  iconUrl: iconUrl,
  shadowUrl: shadowUrl,
});

export default function DrawingMap({ onDrawComplete }) {
  const mapRef = useRef(null);
  const isMapInitialized = useRef(false);

 
  const onDrawCompleteRef = useRef(onDrawComplete);
  useEffect(() => {
    onDrawCompleteRef.current = onDrawComplete;
  });

 
  useEffect(() => {
    if (mapRef.current && !isMapInitialized.current) {
      isMapInitialized.current = true;

      const map = L.map(mapRef.current).setView([23.8103, 90.4125], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      const drawnItems = new L.FeatureGroup();
      map.addLayer(drawnItems);

      const drawControl = new L.Control.Draw({
        edit: { featureGroup: drawnItems },
        draw: {
          polygon: false, marker: false, circle: false,
          circlemarker: false, rectangle: false,
          polyline: { shapeOptions: { color: '#f357a1', weight: 5 } }
        }
      });
      map.addControl(drawControl);

      map.on(L.Draw.Event.CREATED, function (event) {
        const layer = event.layer;
        const geoJsonData = layer.toGeoJSON();
        
        drawnItems.clearLayers();
        drawnItems.addLayer(layer);

       
        if (onDrawCompleteRef.current) {
          onDrawCompleteRef.current(geoJsonData.geometry);
        }
      });
    }
  }, []); 

  return <div ref={mapRef} className="drawing-map-container" />;
}