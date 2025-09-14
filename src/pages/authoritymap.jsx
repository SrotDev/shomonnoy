import React, { useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useNavigate } from "react-router-dom"
import Navbar from '../components/Navbar.jsx';
import './LandingPage.css';
import PreLoader2 from './LoadingPage.jsx';
import ViewOnlyMap from '../components/Map/ViewOnlyMap.jsx';
import '../components/Map/MapSidePanel.css';

const baseUrl = import.meta.env.VITE_BASE_URL;


export default function AuthorityMap() {
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

        async function getUserRole(accessToken) {

        }



        pollAvailability();
        intervalId = setInterval(pollAvailability, 5000);



        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, []);


    if (isLoading) {
        return <PreLoader2 />
    }



    return (
        <>
            <Navbar state={navState} name={navName} />
            <div className="map-section-container">
                <div className="map-side-panel">
                    <div className="mt-20">
                        <h2>সরাসরি প্রকল্পের মানচিত্র</h2>

                    </div>
                    <p>শহর জুড়ে বিভিন্ন সংস্থার চলমান এবং পরিকল্পিত কাজগুলি দেখুন।</p>


                    <ul className="map-legend">
                        <li><span className="color-dot planned"></span>পরিকল্পিত (Planned)</li>
                        <li><span className="color-dot ongoing"></span>চলমান (Ongoing)</li>
                        <li><span className="color-dot completed"></span>সম্পন্ন (Completed)</li>
                    </ul>

                    <div className="map-panel-footer">
                        <p>যেকোনো চিহ্নিত রাস্তায় ক্লিক করে প্রকল্পের বিস্তারিত তথ্য দেখুন।</p>
                    </div>
                </div>
                <div className="map-display-area">

                    <ViewOnlyMap />
                </div>
            </div>
        </>
    )
}