// src/components/Map/ViewOnlyMap.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from "react-router-dom"
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './map.css';
import ClipLoader from "react-spinners/ClipLoader";


import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: iconRetinaUrl,
    iconUrl: iconUrl,
    shadowUrl: shadowUrl,
});


// const mockRoadsData = [
//     { "type": "Feature", "properties": { "name": "Mirpur Road Repair", "company": "WASA", "status": "Ongoing" }, "geometry": { "type": "LineString", "coordinates": [[90.365, 23.775], [90.375, 23.785]] } },
//     { "type": "Feature", "properties": { "name": "Gulshan Avenue Paving", "company": "RHD", "status": "Planned" }, "geometry": { "type": "LineString", "coordinates": [[90.41, 23.79], [90.42, 23.80]] } },
// ];

const baseUrl = import.meta.env.VITE_BASE_URL;



export default function ViewOnlyMap() {
    const mapRef = useRef(null);
    const isMapInitialized = useRef(false);
    const mapInstanceRef = useRef(null);
    const highlightLayerRef = useRef(null);
    const [drawnGeometry, setDrawnGeometry] = useState(null);
    const [showRequestForm, setShowRequestForm] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [mockRoadsData, setMockRoadsData] = useState([]);

    function wktToGeoJSONFeature(data) {
        if (!data?.geom) return null;

        const geom = data.geom;


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
                    status: data.status,
                    timeline: data.proposed_start_date + "-" + data.proposed_end_date,
                    reason: data.details
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

    const navigate = useNavigate()

    async function getTasks() {
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken) return null;

        const response = await fetch(`${baseUrl}/works/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            console.log("Access token invalid, redirecting to login");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("access_token");
            navigate("/authenticate");
            return null;
        } else {
            const task = await response.json();
            return task;
        }
    }

    async function convertAndSetData(task) {
        try {
            const accessToken = localStorage.getItem("access_token");
            const resp = await fetch(`${baseUrl}/locations/${task.location}/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,
                },
            });

            if (!resp.ok) {
                console.error(`Failed to fetch location for task ${task.uuid}`);
                return;
            }

            const locationData = await resp.json();

            // Convert WKT → GeoJSON
            const feature = wktToGeoJSONFeature({
                ...locationData,
                status: task.status,
                proposed_start_date: task.proposed_start_date,
                proposed_end_date: task.proposed_end_date,
                details: task.details,
                city: task.name, // using task.name as the display label
            });

            if (feature) {
                setMockRoadsData(prev => [...prev, feature]);
            }
        } catch (err) {
            console.error("Error in convertAndSetData:", err);
        }
    }

    useEffect(() => {
        async function fetchAndSetTasks() {
            const allTasks = await getTasks();
            console.log(allTasks)

            if (allTasks) {
                for (const tk of allTasks) {
                    
                    await convertAndSetData(tk)
                }
                setIsLoading(false)
            }
        }

        fetchAndSetTasks();
    }, []);





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
                const color =
                    props.status === "Ongoing" ? "#ef4444" :
                        props.status === "Completed" ? "#22c55e" :
                            props.status === "Planned" ? "#f97316" :
                                "#888888";
                const lineLayer = L.geoJSON(feature, { style: { color, weight: 6, opacity: 0.8 } }).addTo(map);

                lineLayer.bindPopup(`<div class="map-popup"><h3>${props.name}</h3><p><strong>Company:</strong> ${props.company}</p><p><strong>Status:</strong> ${props.status}</p></div>`);
            };

            mockRoadsData.forEach(drawRoad);
        }
    }, [isLoading]);

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

    return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />;
}