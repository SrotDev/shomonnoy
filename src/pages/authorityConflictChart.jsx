import { Link, useNavigate } from "react-router-dom"
import { AnimatePresence, easeInOut, motion } from "framer-motion"
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ConflictChartWithButtons from "../components/conflictChart";
import MapModal from '../components/MapModal.jsx';
import '../css/ConflictChart.css';
import PreLoader2 from "./LoadingPage";

const baseUrl = import.meta.env.VITE_BASE_URL;

export default function AuthorityConflictChart() {

  const [isMapModalOpen, setMapModalOpen] = useState(false);
  const [selectedTaskForMap, setSelectedTaskForMap] = useState(null);
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
            localStorage.removeItem("uuid")
            Navigate("/authenticate")
          } else {
            localStorage.setItem('uuid', userData.uuid)
            if (userData.role === "authority") {
              setNavState("authority_logged_in")
            } else {
              console.log("Here")
              localStorage.removeItem("refresh_token");
              localStorage.removeItem("access_token")
              localStorage.removeItem("uuid")
              Navigate("/authenticate")
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


  const handleOpenMap = (taskGroup) => {
    console.log("Opening map for conflict group:", taskGroup);

    if (taskGroup && taskGroup.length > 0) {
      setSelectedTaskForMap(taskGroup[0]);
      setMapModalOpen(true);
    }
  };

  const handleCloseMap = () => {
    setMapModalOpen(false);
    setSelectedTaskForMap(null);
  };

  if (isLoading) {
    return <PreLoader2 />
  }

  return (
    <>
      <Navbar state={navState} name={navName} />
      <div className="content-wrapper mt-30">
        <div className="conflict-page-container">

          <ConflictChartWithButtons onMapClick={handleOpenMap} />
        </div>
      </div>


      <MapModal
        isOpen={isMapModalOpen}
        onClose={handleCloseMap}
        taskData={selectedTaskForMap}
      />
    </>
  );
}