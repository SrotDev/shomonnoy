import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import PreLoader2 from "./LoadingPage";
import { Link, useNavigate } from "react-router-dom"

const baseUrl = "https://shomonnoy-backend.onrender.com/api";

export default function FeedbackReceivingPage() {
  const [navState, setNavState] = useState("non_logged_in");
  const [navName, setNavName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [uuid, setUuid] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);
  const [works, setWorks] = useState({}); // ✅ cache for work details

  // ✅ pollAvailability logic
  async function checkAvailability() {
    try {
      const response = await fetch(`${baseUrl}/`, { method: "GET" });
      if (!response.ok) return false;
      return true;
    } catch (err) {
      console.error("Error checking availability:", err);
      return false;
    }
  }

  useEffect(() => {
    let intervalId;

    async function pollAvailability() {
      const available = await checkAvailability();
      if (available) {
        const accessToken = localStorage.getItem("access_token");
        if (accessToken) {
          const userInfo = await fetch(`${baseUrl}/profile/`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          });

          const userData = await userInfo.json();
          if (!userInfo.ok) {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            window.location.href = "/authenticate";
          } else {
            // ✅ authority / stakeholder roles can view feedback
            if (
              userData.role === "stakeholder" ||
              userData.role === "authority"
            ) {
              setNavState(`${userData.role}_logged_in`);
            } else {
              localStorage.removeItem("access_token");
              localStorage.removeItem("refresh_token");
              window.location.href = "/authenticate";
            }
            setNavName(userData.name);
            setUuid(userData.uuid);
          }
        } else {
          setNavState("non_logged_in");
          setNavName("Login");
        }

        setIsLoading(false);
        if (intervalId) clearInterval(intervalId);
      }
    }

    pollAvailability();
    intervalId = setInterval(pollAvailability, 5000);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  // ✅ Fetch all feedbacks
  async function fetchFeedbacks() {
    try {
      const accessToken = localStorage.getItem("access_token");
      const res = await fetch(`${baseUrl}/feedback/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setFeedbacks(data.reverse()); // newest first

        // ✅ fetch related works for each feedback
        data.forEach(async (fb) => {
          if (fb.related_work && !works[fb.related_work]) {
            try {
              const workRes = await fetch(
                `${baseUrl}/works/${fb.related_work}/`,
                {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                  },
                }
              );
              if (workRes.ok) {
                const workData = await workRes.json();
                setWorks((prev) => ({
                  ...prev,
                  [fb.related_work]: workData,
                }));
              }
            } catch (err) {
              console.error("Error fetching work:", err);
            }
          }
        });
      } else {
        console.error("Failed to fetch feedbacks:", res.status);
      }
    } catch (err) {
      console.error("Error fetching feedbacks:", err);
    }
  }

  useEffect(() => {
    if (navState !== "non_logged_in") {
      fetchFeedbacks();
    }
  }, [navState]);

  // ✅ Color scheme for feelings
  const getFeelingColor = (feeling) => {
    switch (feeling) {
      case "Excellent":
        return "bg-green-100 text-green-800";
      case "Good":
        return "bg-blue-100 text-blue-800";
      case "Average":
        return "bg-yellow-100 text-yellow-800";
      case "Poor":
        return "bg-orange-100 text-orange-800";
      case "Terrible":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) return <PreLoader2 />;

  return (
    <>
      <Navbar state={navState} name={navName} />
      <div className="max-w-5xl mx-auto mt-30 px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Client Feedback
        </h1>

        {feedbacks.length === 0 ? (
          <p className="text-gray-500">No feedback submitted yet.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {feedbacks.map((fb) => (
              <motion.div
                key={fb.uuid}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`p-5 rounded-xl shadow-md ${getFeelingColor(
                  fb.feeling
                )}`}
              >
                <h3 className="font-semibold text-lg">
                  Feedback: {fb.feeling}
                </h3>
                <p className="mt-2 text-sm">{fb.details}</p>

                {fb.related_work && (
                  <div className="mt-3 text-xs text-gray-700 border-t pt-2">
                    <p className="font-semibold text-gray-800 mb-1">
                      Related Work:
                    </p>
                    {works[fb.related_work] ? (
                      <div>
                        <p>
                          <strong>Name:</strong>{" "}
                          {works[fb.related_work].name}
                        </p>
                        <p>
                          <strong>Status:</strong>{" "}
                          {works[fb.related_work].status}
                        </p>
                        <p>
                          <strong>Tag:</strong> {works[fb.related_work].tag}
                        </p>
                        <p>
                          <strong>Budget:</strong>{" "}
                          {works[fb.related_work].budget}
                        </p>
                        <p>
                          <strong>Details:</strong>{" "}
                          {works[fb.related_work].details}
                        </p>
                      </div>
                    ) : (
                      <p>Loading work details...</p>
                    )}
                  </div>
                )}

                <p className="mt-3 text-xs text-gray-500">
                  Submitted on {new Date(fb.created_at).toLocaleString()}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
