// src/pages/LandingPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom"
import './LandingPage.css';
import Navbar from '../components/Navbar';
import MapSidePanel from '../components/Map/MapSidePanel';
import back from '../assets/back.png';
import ViewOnlyMap from '../components/Map/ViewOnlyMap.jsx';
import PreLoader2 from './LoadingPage.jsx';
import '../components/Map/MapSidePanel.css';


const baseUrl = import.meta.env.VITE_BASE_URL;

const LandingPage = () => {
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

          console.log(userData)
          if (!userInfo.ok) {
            console.log("Here")
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("access_token")
            localStorage.removeItem("uuid")
            Navigate("/authenticate")
          } else {
            localStorage.setItem('uuid', userData.uuid)
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
      <Navbar state={navState} name={navName} />
      <div className="landing-page-wrapper">
        <div className="landing-hero-section">
          {/* <h1 className="landing-title">সমন্বয়</h1> */}
          <div className="scene-container">
            <img src={back} alt="City Background" />
          </div>
        </div>

        <div className="scrollable-content">

          <h2>শহরের উন্নয়নে এক নতুন দৃষ্টিভঙ্গি</h2> 
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
      </div>
    </>
  );
};

export default LandingPage;