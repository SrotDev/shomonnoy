import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-control-geocoder';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';



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

const MapView = ({ isCompany = true }) => {
  const mapRef = useRef(null);
  const leafletRef = useRef(null);
  const [drawnGeometry, setDrawnGeometry] = useState(null);
  const [showRequestForm, setShowRequestForm] = useState(false);


  useEffect(() => {
    if (!mapRef.current || leafletRef.current) return;

    const map = L.map(mapRef.current, {
      zoomControl: false,
    }).setView([23.75, 90.39], 13);

    // Add zoom and search control
    L.control.zoom({ position: 'bottomleft' }).addTo(map);
    L.Control.geocoder({ defaultMarkGeocode: true, position: 'bottomleft' }).addTo(map);

    leafletRef.current = map;
    if (isCompany) {
      // Add draw control for company users only
      const drawControl = new L.Control.Draw({
        position: 'bottomright',
        draw: {
          polyline: true,
          polygon: false,
          rectangle: false,
          circle: false,
          marker: false,
          circlemarker: false,
        },
        edit: false,
      });
      map.addControl(drawControl);

      // Handle drawing event
      map.on('draw:created', function (e) {
        const layer = e.layer;

        if (!layer) return;

        // Add the drawn layer to the map (so it's visible)
        layer.addTo(map);

        // Convert the LatLngs to GeoJSON LineString coordinates
        const latlngs = layer.getLatLngs();
        const coordinates = latlngs.map((p) => [p.lng, p.lat]);

        const drawnLine = {
          type: 'LineString',
          coordinates
        };

        console.log('✅ Company drew a road:', drawnLine);

        setDrawnGeometry(drawnLine);
        setShowRequestForm(true); // this triggers your modal later
      });

    }


    // Add basemap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    // Helper to draw roads using ORS route between first & last coords
   const drawRoad = (feature) => {
  const coords = feature.geometry.coordinates;
  const props = feature.properties;

  if (!coords || coords.length < 2) return;

  const color =
    props.status === 'under_construction'
      ? 'red'
      : props.status === 'fixed'
        ? 'green'
        : props.status === 'upcoming'
          ? 'orange'
          : '#666';

  const lineLayer = L.geoJSON(feature, {
    style: {
      color,
      weight: 5,
      opacity: 0.9
    }
  }).addTo(map);

  lineLayer.on('click', () => {
    const popupContent = `
      <b>${props.name || 'Unnamed Road'}</b><br/>
      <b>Company:</b> ${props.company || 'N/A'}<br/>
      <b>Reason:</b> ${props.reason || 'N/A'}<br/>
      <b>Status:</b> ${props.status || 'Pending'}<br/>
    `;
    L.popup()
      .setLatLng(lineLayer.getBounds().getCenter())
      .setContent(popupContent)
      .openOn(map);
  });
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
      return (
      <div style={{ width: '100%' }}>
        <div ref={mapRef} style={{ height: '700px', width: '100%' }} />

        {showRequestForm && drawnGeometry && (
          <div style={{
            position: 'fixed',
            top: 0, left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.4)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: '#ffffff',
              padding: '30px',
              borderRadius: '12px',
              width: '90%',
              maxWidth: '480px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
              fontFamily: 'sans-serif'
            }}>
              <h2 style={{ marginBottom: '20px' }}>🚧 Submit Road Work Request</h2>
              <form
                onSubmit={(e) => {
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

                  fetch('http://localhost:5000/api/road_requests', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                  })
                    .then((res) => res.json())
                    .then((data) => {
                      alert('✅ Request submitted!');
                      setShowRequestForm(false);
                      setDrawnGeometry(null);
                    })
                    .catch((err) => {
                      alert('❌ Submission failed.');
                      console.error(err);
                    });
                }}
              >
                <div style={{ marginBottom: '12px' }}>
                  <label>Road Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '6px',
                      border: '1px solid #ccc',
                      marginTop: '4px'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <label>Company</label>
                  <input
                    type="text"
                    name="company"
                    required
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '6px',
                      border: '1px solid #ccc',
                      marginTop: '4px'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <label>Start Date</label>
                    <input
                      type="date"
                      name="start"
                      required
                      style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '6px',
                        border: '1px solid #ccc',
                        marginTop: '4px'
                      }}
                    />
                  </div>

                  <div style={{ flex: 1 }}>
                    <label>End Date</label>
                    <input
                      type="date"
                      name="end"
                      required
                      style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '6px',
                        border: '1px solid #ccc',
                        marginTop: '4px'
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label>Reason</label>
                  <textarea
                    name="reason"
                    required
                    rows="3"
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '6px',
                      border: '1px solid #ccc',
                      marginTop: '4px',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button
                    type="submit"
                    style={{
                      padding: '10px 16px',
                      backgroundColor: '#1e88e5',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'background 0.3s'
                    }}
                    onMouseOver={(e) => (e.target.style.backgroundColor = '#1565c0')}
                    onMouseOut={(e) => (e.target.style.backgroundColor = '#1e88e5')}
                  >
                    Submit Request
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowRequestForm(false)}
                    style={{
                      padding: '10px 16px',
                      backgroundColor: '#e0e0e0',
                      color: '#333',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}


      </div>
      );

    </div>
  );
};

export default MapView;
