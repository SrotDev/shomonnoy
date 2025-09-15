import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import PreLoader2 from "./LoadingPage";

const baseUrl = "https://shomonnoy-backend.onrender.com/api";

const mockNotifications = [
  {
    uuid: "1a2b3c4d",
    title: "System Maintenance",
    message: "The system will be under maintenance from 2 AM to 4 AM tonight.",
    genre: "Info",
    created_for: "user-uuid-123",
    created_at: "2025-09-10T08:45:00Z",
    updated_at: "2025-09-10T08:45:00Z",
    is_read: false,
  },
  {
    uuid: "2b3c4d5e",
    title: "Profile Update Required",
    message: "Please update your profile information to continue using the service.",
    genre: "Warning",
    created_for: "user-uuid-123",
    created_at: "2025-09-11T12:15:00Z",
    updated_at: "2025-09-11T12:15:00Z",
    is_read: false,
  },
  {
    uuid: "3c4d5e6f",
    title: "Suspicious Activity",
    message: "We detected a login attempt from a new device. If this wasn’t you, change your password immediately.",
    genre: "Alert",
    created_for: "user-uuid-123",
    created_at: "2025-09-12T19:30:00Z",
    updated_at: "2025-09-12T19:30:00Z",
    is_read: true,
  },
  {
    uuid: "4d5e6f7g",
    title: "Welcome to Shomonnoy",
    message: "Thank you for registering. Explore your dashboard to get started!",
    genre: "Info",
    created_for: "user-uuid-123",
    created_at: "2025-09-09T14:00:00Z",
    updated_at: "2025-09-09T14:00:00Z",
    is_read: true,
  },
    {
    uuid: "4d5e6f7g",
    title: "Welcome to Shomonnoy",
    message: "Thank you for registering. Explore your dashboard to get started!",
    genre: "Info",
    created_for: "user-uuid-123",
    created_at: "2025-09-09T14:00:00Z",
    updated_at: "2025-09-09T14:00:00Z",
    is_read: true,
  },  {
    uuid: "4d5e6f7g",
    title: "Welcome to Shomonnoy",
    message: "Thank you for registering. Explore your dashboard to get started!",
    genre: "Info",
    created_for: "user-uuid-123",
    created_at: "2025-09-09T14:00:00Z",
    updated_at: "2025-09-09T14:00:00Z",
    is_read: true,
  },  {
    uuid: "4d5e6f7g",
    title: "Welcome to Shomonnoy",
    message: "Thank you for registering. Explore your dashboard to get started!",
    genre: "Info",
    created_for: "user-uuid-123",
    created_at: "2025-09-09T14:00:00Z",
    updated_at: "2025-09-09T14:00:00Z",
    is_read: true,
  },
];




export default function ClientNotification() {
  const [navState, setNavState] = useState("non_logged_in");
  const [navName, setNavName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [uuid, setUuid] = useState("");
  const [notifications, setNotifications] = useState([]);

  // Check user session and get profile
  async function fetchUser() {
    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        setNavState("non_logged_in");
        setNavName("Login");
        setIsLoading(false);
        return;
      }

      const res = await fetch(`${baseUrl}/profile/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/authenticate";
        return;
      }

      if (data.role === "citizen") setNavState("user_logged_in");
      else {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/authenticate";
      }

      setNavName(data.name);
      setUuid(data.uuid);
    } catch (err) {
      console.error(err);
    }
  }

  // Fetch notifications for logged-in user
  async function fetchNotifications(userUuid) {
    try {
      const accessToken = localStorage.getItem("access_token");
      const res = await fetch(`${baseUrl}/notifications/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        // filter notifications for this user
        const userNotifs = data.filter((n) => n.created_for === userUuid);
        setNotifications(userNotifs.reverse()); // latest first
      } else {
        console.error("Failed to fetch notifications", res.status);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    async function init() {
      await fetchUser();
    }
    init();
  }, []);

  useEffect(() => {
    if (uuid) fetchNotifications(uuid);
  }, [uuid]);

  const getGenreColor = (genre) => {
    switch (genre) {
      case "Info":
        return "bg-blue-100 text-blue-800";
      case "Warning":
        return "bg-yellow-100 text-yellow-800";
      case "Alert":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) return <PreLoader2 />;

  return (
    <>
      <Navbar state={navState} name={navName} />
      <div className="max-w-4xl mx-auto mt-30 px-4 overflow-x-scroll">
        <p className="text-4xl font-bold text-gray-800 mb-6 py-5 -ml-5">নোটিফিকেশনসমূহ</p>
        {mockNotifications.length === 0 ? (
          <p className="text-gray-500">No notifications found.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {mockNotifications.map((notif) => (
              <motion.div
                key={notif.uuid}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale : 1.01}}
                transition={{ duration: 0.3 }}
                className={`p-4 rounded-xl shadow-md ${getGenreColor(
                  notif.genre
                )}`}
              >
                <h3 className="font-semibold text-lg">{notif.title}</h3>
                <p className="mt-1 text-sm">{notif.message}</p>
                <p className="mt-2 text-xs text-gray-600">
                  {new Date(notif.created_at).toLocaleString()}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
