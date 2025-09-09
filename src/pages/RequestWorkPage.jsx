
import React, { useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useNavigate } from "react-router-dom"
import Navbar from '../components/Navbar.jsx';
import DrawingMap from '../components/DrawingMap.jsx';
import WorkRequestForm from '../components/WorkRequestForm.jsx';
import '../css/RequestWork.css';
import PreLoader2 from './LoadingPage.jsx';

const baseUrl = import.meta.env.VITE_BASE_URL;


function geojsonToWkt(geojson) {
  if (!geojson || !geojson.type || !geojson.coordinates) {
    throw new Error("Invalid GeoJSON geometry");
  }

  const type = geojson.type;
  const coords = geojson.coordinates;

  if (type === "Point") {
    return `POINT (${coords[0]} ${coords[1]})`;

  } else if (type === "LineString") {
    const coordStr = coords.map(c => `${c[0]} ${c[1]}`).join(", ");
    return `LINESTRING (${coordStr})`;

  } else if (type === "Polygon") {
    const rings = coords.map(
      ring => `(${ring.map(c => `${c[0]} ${c[1]}`).join(", ")})`
    );
    return `POLYGON (${rings.join(", ")})`;

  } else if (type === "MultiLineString") {
    const lines = coords.map(
      line => `(${line.map(c => `${c[0]} ${c[1]}`).join(", ")})`
    );
    return `MULTILINESTRING (${lines.join(", ")})`;

  } else if (type === "MultiPolygon") {
    const polys = coords.map(
      poly =>
        `(${poly.map(
          ring => `(${ring.map(c => `${c[0]} ${c[1]}`).join(", ")})`
        ).join(", ")})`
    );
    return `MULTIPOLYGON (${polys.join(", ")})`;

  } else {
    throw new Error(`Unsupported GeoJSON type: ${type}`);
  }
}


export default function RequestWorkPage() {
  const [drawnGeometry, setDrawnGeometry] = useState(null);


  const handleDrawComplete = useCallback((geometry) => {
    setDrawnGeometry(geometry);
    console.log(geometry)
  }, []);

  async function handleFinalSubmit(requestData) {
    var accessToken = localStorage.getItem('access_token');
    const newgeom = geojsonToWkt(drawnGeometry)
    const data = {
      city: "Dhaka",
      geom: newgeom
    }

    //console.log(JSON.stringify(data, null, 2));
    try {
      const response = await fetch(`${baseUrl}/locations/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',

          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {

        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong on the server.');
      }

      const result = await response.json();
      //console.log('Successfully got uuid:', result.uuid);

      const finalData = {
        stakeholder: localStorage.getItem("uuid"),
        location: result.uuid,
        name: requestData.reason,
        details: requestData.reason,
        tag: (requestData.isEmergency ? "Emergency" : "Regular"),
        status: "ProposedByStakeholder",
        estimated_time: "30 days",
        proposed_start_date: requestData.startDate,
        proposed_end_date: requestData.endDate,
        start_date: null,
        end_date: null,
        budget: requestData.budget  // TODO

      }

      //console.log("final")
      //console.log(finalData)
      const resp = await fetch(`${baseUrl}/works/`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(finalData),
      })

      const res = await resp.json()

      //console.log(res)

      alert("Work request has been successfully submitted!");
      setDrawnGeometry(null);
      Navigate("/stakeholder/pending-requests")

    } catch (error) {
      console.error('Failed to submit work request:', error);
      alert(`Error: ${error.message}`);
    }


    alert("Work request has been submitted!");
    setDrawnGeometry(null);

  };


  const [navState, setNavState] = useState("non_logged_in");
  const [navName, setNavName] = useState("");
  const [isLoading, setIsLoading] = useState(true)

  const Navigate = useNavigate()

  async function checkAvailablility() {
    try {
      console.log("request sent");
      const response = await fetch(`${baseUrl}/`, { method: "GET" });

      if (!response.ok) {
        console.log("Backend not ready, status:", response.status);
        return false;
      }

      // Only parse if response is ok
      const data = await response.json();
      console.log("Backend response:", data);
      return true;
    } catch (err) {
      console.error("Error checking availability:", err);
      return false;
    }
  }




  useEffect(() => {
    let intervalId;

    async function pollAvailability() {
      const available = await checkAvailablility();
      if (available) {
        var accessToken = localStorage.getItem('access_token');
        if (accessToken) {

          const userInfo = await fetch(`${baseUrl}/profile/`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            },

          });

          const userData = await userInfo.json()
          if (!userInfo.ok) {
            console.log("Here")
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("access_token")
            Navigate("/authenticate")
          } else {
            if (userData.role === "citizen") {
              setNavState("user_logged_in");

            } else if (userData.role === "stakeholder") {
              setNavState("stakeholder_logged_in")
            } else {
              setNavState("authority_logged_in")
            }

            setNavName(userData.name)
          }






        } else {
          setNavState("non_logged_in");
          setNavName("Login")
        }

        setIsLoading(false)
        if (intervalId) {
          clearInterval(intervalId);
        }
      }
    }

    pollAvailability();
    intervalId = setInterval(pollAvailability, 5000);



    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);



  if (isLoading) {
    return (
      <PreLoader2 />
    )
  }


  return (
    <>
      <Navbar state="stakeholder_logged_in" name={navName} />
      <div className="content-wrapper mt-30">
        <div className="request-work-page">
          {!drawnGeometry && (
            <motion.div
              className="map-instruction-overlay"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              Please draw the work area on the map to begin
            </motion.div>
          )}


          <DrawingMap onDrawComplete={handleDrawComplete} />

          <AnimatePresence>
            {drawnGeometry && (
              <WorkRequestForm
                geometry={drawnGeometry}
                onSubmit={handleFinalSubmit}
                onCancel={() => setDrawnGeometry(null)}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}