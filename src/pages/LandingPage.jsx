// src/pages/LandingPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom"
import './LandingPage.css';
import Navbar from '../components/Navbar';
import MapSidePanel from '../components/Map/MapSidePanel';

import ViewOnlyMap from '../components/Map/ViewOnlyMap.jsx';
import PreLoader2 from './LoadingPage.jsx';


const baseUrl = import.meta.env.VITE_BASE_URL;

const LandingPage = () => {
  const [carPosition, setCarPosition] = useState(12);
  const [navState, setNavState] = useState("non_logged_in");
  const [navName , setNavName] = useState("");
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
          }else{
            localStorage.setItem('uuid', userData.uuid)
            if(userData.role === "citizen"){
              setNavState("user_logged_in");
              
            }else if (userData.role === "stakeholder"){
              setNavState("stakeholder_logged_in")
            }else {
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
      const startPosition = 12;
      const endPosition = 75;
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
      <Navbar state={navState} name={navName}/>
      <div className="landing-page-wrapper">
        <div className="landing-hero-section">
          <h1 className="landing-title">সমন্বয়</h1>
          <div className="scene-container">

            <div className="cloud-left"><svg viewBox="0 0 120 40" className="cloud-shape"><path d="M10 40 Q0 40 0 30 T10 20 Q10 10 20 10 T40 10 Q60 10 70 20 T90 20 Q110 20 110 30 T90 40 Z" fill="#F0F8FF" /></svg><div className="rain"></div></div>
            <div className="cloud-right"><svg viewBox="0 0 120 40" className="cloud-shape"><path d="M10 40 Q0 40 0 30 T10 20 Q10 10 20 10 T40 10 Q60 10 70 20 T90 20 Q110 20 110 30 T90 40 Z" fill="#F0F8FF" /></svg><div className="rain"></div></div>
            <svg viewBox="0 0 1440 600" className="road"><path d="M -10,300 C 360,400 360,200 720,300 S 1080,400 1450,300 L 1450,500 C 1080,600 360,400 -10,500 Z" fill="#6B7280" /><path d="M -10 100 Q 720 -100, 1450 100 L 1450 310 C 1080 410, 1080 210, 720 310 S 360 410, -10 310 Z" fill="#4B5563" /><path d="M -10 100 Q 720 -100, 1450 100 L 1450 300 C 1080 400, 1080 200, 720 300 S 360 400, -10 300 Z" fill="#6B7280" /><path d="M -10 100 Q 720 -100, 1450 100" stroke="#FDE68A" strokeWidth="6" fill="none" strokeDasharray="60 30" /></svg>
            <div className="car" style={{ left: `${carPosition}%` }}><svg viewBox="0 0 200 100"><defs><linearGradient id="carBodyGradient" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#60A5FA" /><stop offset="100%" stopColor="#2563EB" /></linearGradient><linearGradient id="windowGradient" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#E0F2FE" /><stop offset="100%" stopColor="#BFDBFE" /></linearGradient></defs><path d="M10 80 C 5 80, 5 75, 10 75 L 20 50 C 22 45, 25 40, 30 40 L 80 40 Q85 40, 90 45 L 110 45 L 160 45 C 170 45, 175 50, 180 55 L 190 75 C 195 80, 195 80, 190 80 Z" fill="url(#carBodyGradient)" stroke="#1E3A8A" strokeWidth="1" /><path d="M 188 80 L 12 80 L 12 83 L 188 83 Z" fill="#1E40AF" /><path d="M35 45 L80 45 L85 75 L40 75 Z" fill="url(#windowGradient)" stroke="#60A5FA" strokeWidth="1" /><path d="M95 45 L165 45 L175 75 L105 75 Z" fill="url(#windowGradient)" stroke="#60A5FA" strokeWidth="1" /><circle cx="45" cy="80" r="14" fill="#1F2937" /><circle cx="45" cy="80" r="8" fill="#D1D5DB" /><circle cx="45" cy="80" r="5" fill="#4B5563" /><circle cx="155" cy="80" r="14" fill="#1F2937" /><circle cx="155" cy="80" r="8" fill="#D1D5DB" /><circle cx="155" cy="80" r="5" fill="#4B5563" /><rect x="8" y="70" width="8" height="5" fill="#FBBF24" rx="2" /><rect x="184" y="70" width="8" height="5" fill="#EF4444" rx="2" /></svg></div>
            <div className="cone"><svg viewBox="0 0 50 80"><defs><linearGradient id="coneGradient" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#FB923C" /><stop offset="50%" stopColor="#F97316" /><stop offset="100%" stopColor="#EA580C" /></linearGradient></defs><ellipse cx="25" cy="75" rx="25" ry="5" fill="#374151" /><polygon points="25,0 45,75 5,75" fill="url(#coneGradient)" /><rect x="8" y="20" width="34" height="10" fill="rgba(255,255,255,0.9)" /><rect x="12" y="45" width="26" height="10" fill="rgba(255,255,255,0.9)" /></svg></div>
            <div className="road-sign"><div className="sign-post"></div><div className="sign-bar"></div><div className="sign-board"><svg viewBox="0 0 100 100" fill="#111827"><circle cx="50" cy="30" r="8" /><rect x="45" y="38" width="10" height="25" rx="5" /><path d="M40 60 L 45 80 L 55 80 L 60 60 Z" /><path d="M 60 45 L 85 55 L 80 65 L 20 80 L 15 70 Z" /></svg></div></div>
            <div className="pipe"><svg viewBox="0 0 120 80"><rect x="20" y="0" width="100" height="30" fill="#9CA3AF" /><ellipse cx="20" cy="15" rx="8" ry="15" fill="#4B5563" /><path d="M20 20 C 30 50, 10 70, 0 80 L 50 80 C 40 70, 60 50, 20 20 Z" fill="#1E40AF" /><path d="M22 25 C 28 45, 25 60, 15 75" stroke="white" strokeWidth="2" fill="none" opacity="0.5" /></svg></div>
          </div>
        </div>

        <div className="scrollable-content">

          <h2>שহরের উন্নয়নে এক নতুন দৃষ্টিভঙ্গি</h2>
          <p>সমন্বয় একটি যুগান্তকারী প্ল্যাটফর্ম যা নাগরিক, কর্তৃপক্ষ (যেমন সিটি কর্পোরেশন) এবং স্টেকহোল্ডারদের (যেমন ওয়াসা, ডেসকো) একত্রিত করে সকল প্রকার উন্নয়নমূলক কাজ স্বচ্ছতা ও দক্ষতার সাথে পরিচালনা করে।</p>
          <div className="features">
            <div className="feature-card"><div className="feature-card-icon"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg></div><h3>নাগরিক অভিযোগ</h3><p>নাগরিকরা সরাসরি মানচিত্রে ভাঙা রাস্তা বা ড্রেনের মতো সমস্যা চিহ্নিত করতে পারেন।</p></div>
            <div className="feature-card"><div className="feature-card-icon"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75c0-.231-.035-.454-.1-.664M6.75 7.5h1.5v.75h-1.5v-.75z" /></svg></div><h3>স্টেকহোল্ডারদের প্রস্তাবনা</h3><p>ওয়াসা ও ডেসকোর মতো সংস্থাগুলো তাদের কাজের সময়সূচী আগে থেকেই জমা দিতে পারে।</p></div>
            <div className="feature-card"><div className="feature-card-icon"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg></div><h3>সমন্বিত পরিকল্পনা</h3><p>সরকারি কর্তৃপক্ষ সব প্রকল্পের সমন্বয় করে, ফলে একই রাস্তার পুনরাবৃত্তি খনন বন্ধ হয়।</p></div>
            <div className="feature-card"><div className="feature-card-icon"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg></div><h3>কাজের অগ্রগতি পর্যবেক্ষণ</h3><p>সবাই কানবান বোর্ডের মাধ্যমে কাজের অবস্থা— পরিকল্পিত থেকে সম্পন্ন— দেখতে পারে।</p></div>
            <div className="feature-card"><div className="feature-card-icon"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" /></svg></div><h3>দ্বন্দ্ব সনাক্তকরণ</h3><p>গ্যান্ট চার্ট স্বয়ংক্রিয়ভাবে একই স্থানে একাধিক প্রকল্পের মধ্যেকার সম্ভাব্য দ্বন্দ্ব চিহ্নিত করে।</p></div>
            <div className="feature-card"><div className="feature-card-icon"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg></div><h3>স্বচ্ছ যোগাযোগ</h3><p>প্রকল্পের অবস্থা সম্পর্কে রিয়েল-টাইম নোটিফিকেশন পান এবং কাজের উপর মতামত দিন।</p></div>
          </div>
        </div>

        <div className="map-section-container">
          <div className="map-side-panel">
            <div className="mt-20">
              <h2>সরাসরি প্রকল্পের মানচিত্র</h2>
            </div>
            <p>শহর জুড়ে বিভিন্ন সংস্থার চলমান এবং পরিকল্পিত কাজগুলি দেখুন।</p>
            <ul className="map-legend">
              <li><span className="color-dot wasa"></span>ওয়াসা</li>
              <li><span className="color-dot desco"></span>ডেসকো / ডিপিডিসি</li>
              <li><span className="color-dot rhd"></span>সওজ</li>
              <li><span className="color-dot btcl"></span>বিটিসিএল</li>
              <li><span className="color-dot other"></span>অন্যান্য</li>
            </ul>
            <div className="map-panel-footer">
              <p>যেকোনো চিহ্নিত রাস্তায় ক্লিক করে প্রকল্পের বিস্তারিত তথ্য দেখুন।</p>
            </div>
          </div>
          <div className="map-display-area">

            <ViewOnlyMap />
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;