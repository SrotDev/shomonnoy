import React from 'react';
import './NoticePage.css';
import Navbar from '../../components/Navbar';
import { Link, useNavigate } from "react-router-dom"
import { easeInOut, motion, rgba } from "framer-motion"
import { useState, useEffect } from "react";
import PreLoader2 from '../LoadingPage';
const baseUrl = import.meta.env.VITE_BASE_URL;

const noticeData = [
  {
    id: 1,
    title: "২০২৪ সালের বার্ষিক রাস্তা রক্ষণাবেক্ষণের সময়সূচী",
    date: "২৬ অক্টোবর, ২০২৩",
    description: "আসন্ন বছরের জন্য পরিকল্পিত রাস্তা রক্ষণাবেক্ষণ এবং উন্নয়ন প্রকল্পের অফিসিয়াল সময়সূচী।",
    fileUrl: "/documents/notice-01.pdf"
  },
  {
    id: 2,
    title: "নতুন সিটি ওভারপাস প্রকল্পের জন্য দরপত্র আহ্বান",
    date: "২২ অক্টোবর, ২০২৩",
    description: "তেজগাঁও ওভারপাস নির্মাণের জন্য যোগ্য নির্মাণ সংস্থাগুলির কাছ থেকে দরপত্র আহ্বান করা হচ্ছে।",
    fileUrl: "/documents/tender-announcement.pdf"
  },
  {
    id: 3,
    title: "পানি সরবরাহ পাইপলাইন আপগ্রেড বিষয়ে গণশুনানি",
    date: "১৫ অক্টোবর, ২০২৩",
    description: "ওয়াসা আসন্ন পানি অবকাঠামো আপগ্রেড সংক্রান্ত একটি গণশুনানিতে সকল শহরবাসীকে আমন্ত্রণ জানাচ্ছে।",
    fileUrl: "/documents/public-consultation.pdf"
  },
  {
    id: 4,
    title: "ড্রেনেজ সিস্টেম পরিষ্কারকরণ কর্মসূচী",
    date: "১০ অক্টোবর, ২০২৩",
    description: "বর্ষা মৌসুমের প্রস্তুতি হিসেবে শহরের প্রধান ড্রেনেজ সিস্টেমগুলো পরিষ্কার করার কর্মসূচী ঘোষণা করা হয়েছে।",
    fileUrl: "/documents/notice-01.pdf" 
  },
  {
    id: 5,
    title: "স্মার্ট স্ট্রিট লাইট স্থাপন প্রকল্পের বিজ্ঞপ্তি",
    date: "০৫ অক্টোবর, ২০২৩",
    description: "শহরের নিরাপত্তা বাড়াতে প্রধান সড়কগুলোতে স্মার্ট স্ট্রিট লাইট স্থাপনের কাজ শুরু হতে যাচ্ছে।",
    fileUrl: "/documents/tender-announcement.pdf"
  },
  {
    id: 6,
    title: "যানজট নিরসনে নতুন ট্র্যাফিক ম্যানেজমেন্ট প্ল্যান",
    date: "০১ অক্টোবর, ২০২৩",
    description: "নির্ধারিত প্রধান মোড়গুলিতে যানজট কমাতে একটি নতুন ট্রাফিক ব্যবস্থাপনা পরিকল্পনা কার্যকর করা হবে।",
    fileUrl: "/documents/public-consultation.pdf"
  },
  {
    id: 7,
    title: "বৃক্ষরোপণ অভিযান ও সবুজায়ন প্রকল্প",
    date: "২৫ সেপ্টেম্বর, ২০২৩",
    description: "পরিবেশের ভারসাম্য রক্ষায় মাসব্যাপী বৃক্ষরোপণ অভিযানের বিস্তারিত তথ্য ও অংশগ্রহণের নিয়মাবলী।",
    fileUrl: "/documents/notice-01.pdf"
  },
  {
    id: 8,
    title: "জরুরী গ্যাসলাইন মেরামত সংক্রান্ত বিজ্ঞপ্তি",
    date: "২০ সেপ্টেম্বর, ২০২৩",
    description: "মিরপুর এলাকায় জরুরী গ্যাসলাইন মেরামতের জন্য সাময়িকভাবে গ্যাস সরবরাহ বন্ধ থাকবে।",
    fileUrl: "/documents/tender-announcement.pdf"
  },
  {
    id: 9,
    title: "সিটি কর্পোরেশনের হোল্ডিং ট্যাক্স প্রদানের সময়সীমা",
    date: "১৫ সেপ্টেম্বর, ২০২৩",
    description: "সকল সম্মানিত নাগরিককে নির্ধারিত তারিখের মধ্যে হোল্ডিং ট্যাক্স পরিশোধ করার জন্য অনুরোধ করা হচ্ছে।",
    fileUrl: "/documents/public-consultation.pdf"
  },
  {
    id: 10,
    title: "শীতকালীন পরিচ্ছন্নতা অভিযানের ঘোষণা",
    date: "১০ সেপ্টেম্বর, ২০২৩",
    description: "শহরকে পরিচ্ছন্ন রাখতে বিশেষ শীতকালীন পরিচ্ছন্নতা অভিযানের সময়সূচী ও নির্দেশিকা।",
    fileUrl: "/documents/notice-01.pdf"
  }
];










function NoticePage ({state}) {
  const [isLoading, setIsLoading] = useState(true)
  const [navState, setNavState] = useState("non_logged_in");
  const [navName , setNavName] = useState("");
    
  
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


  if(isLoading){
    return(
      <PreLoader2 />
    )
  }

  return (
    <div className="notice-page-wrapper">
      <Navbar state={navState} name={navName} />
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>

      <div className="notice-page-container">
        <div className="notice-header">
          
          <h1>নোটিশ বোর্ড</h1>
          <p>কর্তৃপক্ষের অফিসিয়াল ঘোষণা, সময়সূচী এবং নথি।</p>
        </div>

        <div className="notice-list">
          {noticeData.map((notice) => (
            <div key={notice.id} className="glass-card">
              <div className="card-content">
                <span className="card-date">{notice.date}</span>
                <h3 className="card-title">{notice.title}</h3>
                <p className="card-description">{notice.description}</p>
              </div>
              <div className="card-action">
                <a 
                  href={notice.fileUrl} 
                  download 
                  className="download-link"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                 
                  <span>পিডিএফ ডাউনলোড</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NoticePage;