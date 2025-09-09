import { Link, useNavigate } from "react-router-dom"
import { AnimatePresence, easeInOut, motion } from "framer-motion"
import { useState, useEffect } from "react";
import '../css/authentication.css'
import Navbar from "../components/Navbar";
import './LandingPage.css';
import '../css/authorityDashboard.css'
import PreLoader2 from "./LoadingPage";

const baseUrl = import.meta.env.VITE_BASE_URL;

export default function AuthorityDashboard() {
    const [carPosition, setCarPosition] = useState(12);
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

    useEffect(() => {
        const handleScroll = () => {
            const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (scrollableHeight === 0) return;
            const scrollTop = window.scrollY;
            const scrollProgress = scrollTop / scrollableHeight;
            const startPosition = 12; const endPosition = 75;
            const animationProgress = Math.min(scrollProgress * 2.5, 1);
            const newPosition = startPosition + (endPosition - startPosition) * animationProgress;
            setCarPosition(newPosition);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (isLoading) {
        return <PreLoader2 />
    }

    return (
        <>
            <Navbar state={navState} name={navName}></Navbar>
            <div className="landing-hero-section">
                <div className="flex flex-col items-center justify-center">
                    <h1 className="landing-title">সমন্বয়</h1>
                    <div className="flex flex-row gap-40 home-buttons">
                        <motion.div className="bg-[rgb(114,198,158)]  rounded-3xl px-14 py-2 text-white text-center shadow-[4px_2px_10px_2px_rgba(0,0,0,0.12)] backdrop-blur-md font-bold"
                            whileHover={{
                                scale: 1.1
                            }}
                        ><p>সচল রিপোর্টসমূহ</p></motion.div>
                        <motion.div className=" bg-[rgb(114,198,158)] rounded-3xl px-14 py-2 text-white text-center shadow-[4px_2px_10px_2px_rgba(0,0,0,0.12)] backdrop-blur-md font-bold"
                            whileHover={{
                                scale: 1.1,
                            }}
                        ><p>কনফ্লিক্ট চার্ট</p></motion.div>
                        <motion.div className="bg-[rgb(114,198,158)] rounded-3xl px-14 py-2 text-white text-center shadow-[4px_2px_10px_2px_rgba(0,0,0,0.12)] backdrop-blur-md font-bold"
                            whileHover={{
                                scale: 1.1
                            }}
                        ><p>মানচিত্র দেখুন</p></motion.div>
                    </div>
                </div>

                <div className="scene-container">



                    <div className="cloud-left">
                        <svg viewBox="0 0 120 40" className="cloud-shape"><path d="M10 40 Q0 40 0 30 T10 20 Q10 10 20 10 T40 10 Q60 10 70 20 T90 20 Q110 20 110 30 T90 40 Z" fill="#F0F8FF" /></svg>
                        <div className="rain"></div>
                    </div>
                    <div className="cloud-right">
                        <svg viewBox="0 0 120 40" className="cloud-shape"><path d="M10 40 Q0 40 0 30 T10 20 Q10 10 20 10 T40 10 Q60 10 70 20 T90 20 Q110 20 110 30 T90 40 Z" fill="#F0F8FF" /></svg>
                        <div className="rain"></div>
                    </div>

                    <svg viewBox="0 0 1440 600" className="road">

                        <path
                            d="M -10,300 C 360,400 360,200 720,300 S 1080,400 1450,300 L 1450,500 C 1080,600 360,400 -10,500 Z"
                            fill="#6B7280"
                        />

                        <path d="M -10 100 Q 720 -100, 1450 100 L 1450 310 C 1080 410, 1080 210, 720 310 S 360 410, -10 310 Z" fill="#4B5563" />
                        <path d="M -10 100 Q 720 -100, 1450 100 L 1450 300 C 1080 400, 1080 200, 720 300 S 360 400, -10 300 Z" fill="#6B7280" />
                        <path d="M -10 100 Q 720 -100, 1450 100" stroke="#FDE68A" strokeWidth="6" fill="none" strokeDasharray="60 30" />
                    </svg>
                    <div className="car" style={{ left: `${carPosition}%` }}>
                        <svg viewBox="0 0 200 100">
                            <defs><linearGradient id="carBodyGradient" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#60A5FA" /><stop offset="100%" stopColor="#2563EB" /></linearGradient><linearGradient id="windowGradient" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#E0F2FE" /><stop offset="100%" stopColor="#BFDBFE" /></linearGradient></defs>
                            <path d="M10 80 C 5 80, 5 75, 10 75 L 20 50 C 22 45, 25 40, 30 40 L 80 40 Q85 40, 90 45 L 110 45 L 160 45 C 170 45, 175 50, 180 55 L 190 75 C 195 80, 195 80, 190 80 Z" fill="url(#carBodyGradient)" stroke="#1E3A8A" strokeWidth="1" /><path d="M 188 80 L 12 80 L 12 83 L 188 83 Z" fill="#1E40AF" /><path d="M35 45 L80 45 L85 75 L40 75 Z" fill="url(#windowGradient)" stroke="#60A5FA" strokeWidth="1" /><path d="M95 45 L165 45 L175 75 L105 75 Z" fill="url(#windowGradient)" stroke="#60A5FA" strokeWidth="1" /><circle cx="45" cy="80" r="14" fill="#1F2937" /><circle cx="45" cy="80" r="8" fill="#D1D5DB" /><circle cx="45" cy="80" r="5" fill="#4B5563" /><circle cx="155" cy="80" r="14" fill="#1F2937" /><circle cx="155" cy="80" r="8" fill="#D1D5DB" /><circle cx="155" cy="80" r="5" fill="#4B5563" /><rect x="8" y="70" width="8" height="5" fill="#FBBF24" rx="2" /><rect x="184" y="70" width="8" height="5" fill="#EF4444" rx="2" />
                        </svg>
                    </div>

                    <div className="cone">
                        <svg viewBox="0 0 50 80">
                            <defs><linearGradient id="coneGradient" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#FB923C" /><stop offset="50%" stopColor="#F97316" /><stop offset="100%" stopColor="#EA580C" /></linearGradient></defs>
                            <ellipse cx="25" cy="75" rx="25" ry="5" fill="#374151" />
                            <polygon points="25,0 45,75 5,75" fill="url(#coneGradient)" />
                            <rect x="8" y="20" width="34" height="10" fill="rgba(255,255,255,0.9)" />
                            <rect x="12" y="45" width="26" height="10" fill="rgba(255,255,255,0.9)" />
                        </svg>
                    </div>

                    <div className="road-sign">
                        <div className="sign-post"></div><div className="sign-bar"></div>
                        <div className="sign-board"><svg viewBox="0 0 100 100" fill="#111827"><circle cx="50" cy="30" r="8" /><rect x="45" y="38" width="10" height="25" rx="5" /><path d="M40 60 L 45 80 L 55 80 L 60 60 Z" /><path d="M 60 45 L 85 55 L 80 65 L 20 80 L 15 70 Z" /></svg></div>
                    </div>

                    <div className="pipe">
                        <svg viewBox="0 0 120 80"><rect x="20" y="0" width="100" height="30" fill="#9CA3AF" /><ellipse cx="20" cy="15" rx="8" ry="15" fill="#4B5563" /><path d="M20 20 C 30 50, 10 70, 0 80 L 50 80 C 40 70, 60 50, 20 20 Z" fill="#1E40AF" /><path d="M22 25 C 28 45, 25 60, 15 75" stroke="white" strokeWidth="2" fill="none" opacity="0.5" /></svg>
                    </div>
                </div>
            </div>


        </>
    )
}