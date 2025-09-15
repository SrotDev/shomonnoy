import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import PreLoader2 from "./LoadingPage";

const baseUrl = "https://shomonnoy-backend.onrender.com/api";

export default function ClientFeedback() {
    const [navState, setNavState] = useState("non_logged_in");
    const [navName, setNavName] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [uuid, setUuid] = useState("");
    const [tasks, setTasks] = useState(null)
    const [selectedTask, setSelectedTask] = useState("");

    const [feeling, setFeeling] = useState("");
    const [details, setDetails] = useState("");
    const [relatedWork, setRelatedWork] = useState("");
    const [statusMessage, setStatusMessage] = useState("");

    const Navigate = useNavigate();

    async function checkAvailablility() {
        try {
            const response = await fetch(`${baseUrl}/`, { method: "GET" });
            return response.ok;
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
                        localStorage.removeItem("refresh_token");
                        localStorage.removeItem("access_token");
                        Navigate("/authenticate");
                    } else {
                        if (userData.role === "citizen") {
                            setNavState("user_logged_in");
                        } else {
                            localStorage.removeItem("refresh_token");
                            localStorage.removeItem("access_token");
                            Navigate("/authenticate");
                        }

                        setNavName(userData.name);
                        setUuid(userData.uuid);
                    }
                } else {
                    localStorage.removeItem("refresh_token");
                    localStorage.removeItem("access_token");
                    Navigate("/authenticate");
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

    async function getTasks() {
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken) return null;

        const response = await fetch(`${baseUrl}/works/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            console.log("Access token invalid, redirecting to login");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("access_token");
            navigate("/authenticate");
            return null;
        } else {
            const task = await response.json();
            return task;
        }
    }

    useEffect(() => {
        async function fetchAndSetTasks() {
            const allTasks = await getTasks();
            if (allTasks) {
                const newTasks = allTasks;
                setTasks(newTasks);
                setIsLoading(false);
            }
        }
        fetchAndSetTasks();
    }, [isLoading]);


    async function handleSubmit(e) {
        e.preventDefault();
        setStatusMessage("");

        try {
            const accessToken = localStorage.getItem("access_token");
            const response = await fetch(`${baseUrl}/feedback/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    feeling,
                    details,
                    related_work: selectedTask || null,
                }),
            });

            if (response.ok) {
                alert("✅ Feedback submitted successfully!");
                setFeeling("");
                setDetails("");
                setRelatedWork("");
            } else {
                setStatusMessage("❌ Failed to submit feedback.");
            }
        } catch (err) {
            console.error("Error submitting feedback:", err);
            setStatusMessage("❌ Error submitting feedback.");
        }
    }

    if (isLoading) {
        return <PreLoader2 />;
    }

    return (
        <>
            <Navbar state={navState} name={navName} />
            <div className="max-w-2xl mx-auto mt-30 px-4 mb-5">
                <motion.p
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-bold text-gray-800 mb-10 text-center"
                >
                    আপনার মতামত শেয়ার করুন
                </motion.p>

                <motion.form
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white shadow-lg rounded-2xl p-6 flex flex-col gap-4"
                >
                    {/* Feeling */}
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">
                            How was your experience?
                        </label>
                        <select
                            value={feeling}
                            onChange={(e) => setFeeling(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        >
                            <option value="">Select one</option>
                            <option value="Excellent">Excellent</option>
                            <option value="Good">Good</option>
                            <option value="Average">Average</option>
                            <option value="Poor">Poor</option>
                            <option value="Terrible">Terrible</option>
                        </select>
                    </div>

                    {/* Details */}
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">
                            Additional Details
                        </label>
                        <textarea
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            rows="4"
                            placeholder="Tell us more..."
                            required
                        ></textarea>
                    </div>

                    {/* Related Work (optional) */}
                    <div>
                        <label className="block mb-2 font-semibold">Related Work</label>
                        {isLoading ? (
                            <p>Loading tasks...</p>
                        ) : (
                            <select
                                value={selectedTask}
                                onChange={(e) => setSelectedTask(e.target.value)}
                                className="w-full border rounded-lg p-2"
                            >
                                <option value="">Select related work</option>
                                {tasks.map((task) => (
                                    <option key={task.uuid} value={task.uuid}>
                                        {task.title || `"${task.details}" Date - ${task.proposed_start_date} to ${task.proposed_end_date}`}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    {/* Submit Button */}
                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition"
                    >
                        Submit Feedback
                    </motion.button>

                    
                </motion.form>
            </div>
        </>
    );
}
