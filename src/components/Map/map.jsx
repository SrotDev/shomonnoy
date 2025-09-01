import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-control-geocoder';

// Marker fix
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});


const ORS_API_KEY = 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImUzMzFiMTcwMTkwZDQxYjhiNDA2OGJlM2JkMDc0MmRlIiwiaCI6Im11cm11cjY0In0='; // ← Replace with valid key

const MapView = () => {
  const mapRef = useRef(null);
  const leafletRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current || leafletRef.current) return;

    const map = L.map(mapRef.current, {
      zoomControl: false,
    }).setView([23.75, 90.39], 13);

    // Add zoom and search control
    L.control.zoom({ position: 'bottomleft' }).addTo(map);
    L.Control.geocoder({ defaultMarkGeocode: true, position: 'bottomleft' }).addTo(map);

    leafletRef.current = map;

    // Add basemap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    // Helper to draw roads using ORS route between first & last coords
    const drawRoad = async (feature) => {
      const coords = feature.geometry.coordinates;
      const props = feature.properties;

      if (coords.length < 2) return;

      const start = coords[0];
      const end = coords[coords.length - 1];

      const routeRes = await fetch(
        'https://api.openrouteservice.org/v2/directions/driving-car/geojson',
        {
          method: 'POST',
          headers: {
            'Authorization': ORS_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ coordinates: [start, end] }),
        }
      );

      const routeGeoJSON = await routeRes.json();

      const color =
        props.status === 'under_construction'
          ? 'red'
          : props.status === 'fixed'
          ? 'green'
          : props.status === 'upcoming'
          ? 'orange'
          : 'gray';

      // Draw route
      const roadLayer = L.geoJSON(routeGeoJSON, {
        style: { color, weight: 5 },
      }).addTo(map);

      // Show info on click
      roadLayer.on('click', () => {
        const popupContent = `
          <b>${props.name || 'Unnamed Road'}</b><br/>
          <b>Status:</b> ${props.status || 'N/A'}<br/>
          <b>Timeline:</b> ${props.timeline || 'N/A'}<br/>
          <b>Company:</b> ${props.company || 'N/A'}<br/>
          <b>Reason:</b> ${props.reason || 'N/A'}
        `;
        L.popup()
          .setLatLng(roadLayer.getBounds().getCenter())
          .setContent(popupContent)
          .openOn(map);
      });

      // Add silent markers (no popup)
      L.marker([start[1], start[0]]).addTo(map);
      L.marker([end[1], end[0]]).addTo(map);
    };

    // Fetch roads from backend
    fetch('http://localhost:5000/api/roads')
      .then((res) => res.json())
      .then(async (geojson) => {
        for (const feature of geojson.features) {
          await drawRoad(feature);
        }
      })
      .catch((err) => console.error('❌ Error loading roads:', err));
  }, []);

  return (
    <div style={{ height: '700px', width: '100%' }}>
      <div ref={mapRef} style={{ height: '100%' }} />
    </div>
  );
};

export default MapView;
