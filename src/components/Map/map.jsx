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

import ClipLoader from "react-spinners/ClipLoader";


const baseUrl = import.meta.env.VITE_BASE_URL;

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});


// const mockRoadsData = [
//   {
//     "type": "Feature",
//     "properties": {
//       "name": "Mirpur Road Repair",
//       "company": "WASA",
//       "status": "Ongoing",
//       "timeline": "1 Oct - 30 Oct",
//       "reason": "Main pipeline maintenance"
//     },
//     "geometry": { "type": "LineString", "coordinates": [[90.365, 23.775], [90.375, 23.785]] }
//   },
//   {
//     "type": "Feature",
//     "properties": {
//       "name": "Gulshan Avenue Paving",
//       "company": "RHD",
//       "status": "Planned",
//       "timeline": "1 Nov - 15 Nov",
//       "reason": "Road resurfacing project"
//     },
//     "geometry": { "type": "LineString", "coordinates": [[90.41, 23.79], [90.42, 23.80]] }
//   },
//   {
//     "type": "Feature",
//     "properties": {
//       "name": "Dhanmondi Cable Work",
//       "company": "BTCL",
//       "status": "Completed",
//       "timeline": "1 Sep - 25 Sep",
//       "reason": "Fiber optic cable installation"
//     },
//     "geometry": { "type": "LineString", "coordinates": [[90.37, 23.74], [90.38, 23.75]] }
//   }
// ];




const MapView = ({ requestData, isCompany = false }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const highlightLayerRef = useRef(null);
  const [drawnGeometry, setDrawnGeometry] = useState(null);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mockRoadsData, setMockRoadsData] = useState([]);

  function wktToGeoJSONFeature(data) {
    if (!data?.geom) return null;

    const geom = data.geom;

    // // Match Point
    // if (geom.includes("POINT")) {
    //   const match = geom.match(/POINT\s*\(([-0-9.]+)\s+([-0-9.]+)\)/);
    //   if (!match) return null;

    //   const lon = parseFloat(match[1]);
    //   const lat = parseFloat(match[2]);

    //   return {
    //     type: requestData,
    //     properties: {
    //       name: requestData.city || "Unknown Location",
    //       company: "N/A",
    //       status: requestData.status,
    //       timeline: "N/A",
    //       reason: "N/A"
    //     },
    //     geometry: {
    //       type: "Point",
    //       coordinates: [lon, lat]
    //     }
    //   };
    // }


    if (geom.includes("LINESTRING")) {
      const match = geom.match(/LINESTRING\s*\((.+)\)/);
      if (!match) return null;


      const coords = match[1].split(",").map(pair => {
        const [lon, lat] = pair.trim().split(/\s+/).map(Number);
        return [lon, lat];
      });

      return {
        type: "Feature",
        properties: {
          name: data.city || "Unknown Location",
          company: "N/A",
          status: "Planned",
          timeline: "N/A",
          reason: "N/A"
        },
        geometry: {
          type: "LineString",
          coordinates: coords
        }
      };
    }

    return null;
  }



  async function getCoords() {
    try {
      const accessToken = localStorage.getItem("access_token");
      const coordarray = await fetch(`${baseUrl}/locations/${requestData.location}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
      });

      if (!coordarray.ok) {
        console.log("failed");
        return undefined;
      }
      const data = await coordarray.json();
      const newData = wktToGeoJSONFeature(data)
      console.log(newData);
      return newData;
    } catch (err) {
      console.error("Error fetching coords:", err);
      return undefined;
    }
  }

  useEffect(() => {
    async function getRoadData() {
      const dta = await getCoords();
      if (dta) {
        setMockRoadsData([dta]);
        setIsLoading(false);
      }
    }
    getRoadData();
  }, []);



  useEffect(() => {
    if (mapInstanceRef.current) {
      setTimeout(() => {
        mapInstanceRef.current.invalidateSize();
      }, 300);
    }
  }, [isLoading]);


  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const { clientWidth, clientHeight } = mapContainerRef.current;
    if (clientWidth === 0 || clientHeight === 0) {
      const timeout = setTimeout(() => {
        if (!mapInstanceRef.current) {
          const map = L.map(mapContainerRef.current).setView([23.75, 90.39], 13);
          mapInstanceRef.current = map;
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
        }
      }, 1000); // wait a tick for layout
      return () => clearTimeout(timeout);
    }

    const map = L.map(mapContainerRef.current).setView([23.75, 90.39], 13);
    mapInstanceRef.current = map;

    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
  }, [isLoading]);



  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mockRoadsData.length) return;

    const drawRoad = (feature) => {
      const props = feature.properties;
      const color =
        props.status === "Ongoing" ? "#ef4444" :
          props.status === "Completed" ? "#22c55e" :
            props.status === "Planned" ? "#f97316" :
              "#888888";

      const lineLayer = L.geoJSON(feature, {
        style: { color, weight: 8, opacity: 0.85, lineCap: "round", lineJoin: "round" },
      }).addTo(map);

      lineLayer.on("click", () => {
        const popupContent = `
        <div class="map-popup">
          <h3>${props.name || "Unnamed Project"}</h3>
          <p><strong>Company:</strong> ${props.company || "N/A"}</p>
          <p><strong>Status:</strong> <span class="status-${props.status?.toLowerCase()}">${props.status || "N/A"}</span></p>
          <p><strong>Timeline:</strong> ${props.timeline || "N/A"}</p>
          <p><strong>Reason:</strong> ${props.reason || "N/A"}</p>
        </div>
      `;
        L.popup()
          .setLatLng(lineLayer.getBounds().getCenter())
          .setContent(popupContent)
          .openOn(map);
      });
    };

    mockRoadsData.forEach(drawRoad);
  }, [mockRoadsData]);

  if (isLoading) {

    return (
      <div
        className=""
        style={{ textAlign: "center", marginTop: "100px" }}
      >
        <ClipLoader color="#27d887" loading={true} size={50} />
      </div>
    );
  }


  return (
    <>
      <div className="map-view-container" ref={mapContainerRef} />

    </>
  );
};

export default MapView;