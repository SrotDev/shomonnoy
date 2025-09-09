import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"


import '../css/authentication.css';
import '../css/authorityDashboard.css';


import Navbar from "../components/Navbar";
import AuthorityWorkReqNormal from "../components/authorityWorkReqNormal";
import AuthorityWorkReqConflicted from "../components/authorityWorkReqConflict";
import AuthorityWorkReqPending from "../components/authorityWorkReqPending";
import MapView from "../components/Map/map";
import PreLoader2 from "./LoadingPage";

const baseUrl = import.meta.env.VITE_BASE_URL;


export default function AuthorityWorkRequests() {
    const [optState, setOptState] = useState(0);
    const [isMapVisible, setIsMapVisible] = useState(false);

    const [selectedRequest, setSelectedRequest] = useState(null);
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

    const handleShowMap = (requestData) => {
        setSelectedRequest(requestData);
        setIsMapVisible(true);
    };

    const handleCloseMap = () => {
        setIsMapVisible(false);
        setSelectedRequest(null);
    };


    const modalVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.9 }
    };

    return (
        <>
            <div className={`flex flex-col min-h-screen transition-filter duration-300 ${isMapVisible ? 'blur-sm' : ''}`}>
                <Navbar state={navState} name={navName} />
                <motion.div className="bg-[#72C69E] px-14 py-2 text-white text-center shadow-lg backdrop-blur-md font-bold mt-30">
                    সচল রিপোর্টসমূহ
                </motion.div>

                <div className="flex flex-row gap-5 items-center justify-center mt-8">
                    <motion.div className="bg-white rounded-full px-8 py-2 text-center shadow-md font-bold cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                        animate={{ backgroundColor: optState === 0 ? '#72C69E' : '#FFFFFF', color: optState === 0 ? '#FFFFFF' : '#333333' }}
                        onClick={() => setOptState(0)}
                    >
                        <p>সাধারণ</p>
                    </motion.div>
                    <motion.div className="bg-white rounded-full px-10 py-2 text-center shadow-md font-bold cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                        animate={{ backgroundColor: optState === 1 ? '#72C69E' : '#FFFFFF', color: optState === 1 ? '#FFFFFF' : '#333333' }}
                        onClick={() => setOptState(1)}
                    >
                        <p>সাংঘর্ষিক</p>
                    </motion.div>
                    {/* <motion.div className="bg-white rounded-full px-5 py-2 text-center shadow-md font-bold cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                        animate={{ backgroundColor: optState === 2 ? '#72C69E' : '#FFFFFF', color: optState === 2 ? '#FFFFFF' : '#333333' }}
                        onClick={() => setOptState(2)}
                    >
                        <p>পুনঃনিরীক্ষণ আবেদনসমূহ</p>
                    </motion.div> */}
                </div>


                <div className="my-10 mx-auto w-full max-w-4xl">

                    {optState === 0 && <AuthorityWorkReqNormal onShowMap={handleShowMap} />}
                    {optState === 1 && <AuthorityWorkReqConflicted onShowMap={handleShowMap} />}
                    {/* {optState === 2 && <AuthorityWorkReqPending onShowMap={handleShowMap} />} */}
                </div>
            </div>


           

            <AnimatePresence>
                {isMapVisible && (
                    <motion.div

                        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
                        initial="hidden" animate="visible" exit="exit"
                        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } }}
                        onClick={handleCloseMap}
                    >
                        <motion.div

                            className="relative bg-white rounded-lg shadow-2xl w-[95vw] md:w-[90vw] h-[90vh] overflow-hidden p-2"
                            onClick={(e) => e.stopPropagation()}

                            variants={{
                                hidden: { opacity: 0, y: -20, scale: 0.95 },
                                visible: { opacity: 1, y: 0, scale: 1 },
                                exit: { opacity: 0, y: -20, scale: 0.95 }
                            }}
                            transition={{ duration: 0.3 }}
                        >
                            <button
                                className="absolute top-4 right-4 text-gray-600 bg-white bg-opacity-70 rounded-full p-2 z-[1000] hover:bg-gray-100 hover:text-gray-900 transition-colors"
                                onClick={handleCloseMap}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            <MapView requestData={selectedRequest} />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}



