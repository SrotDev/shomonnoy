import { Link, useNavigate } from "react-router-dom"
import { easeInOut, motion, rgba } from "framer-motion"
import { useState } from "react";

import logo from '../assets/logo.png'

import '../css/navbar.css'

const non_LoginItems = [
    { id: 1, title: "হোম", path: "/" },
    { id: 2, title: "নোটিশ বোর্ড", path: "/noticeboard" },
    { id: 3, title: "লগইন/রেজিস্টার", path: "/authenticate" }
]

const user_LoginItems = [
    { id: 1, title: "হোম", path: "/" },
    //{ id: 2, title: "নোটিশ বোর্ড", path: "/noticeboard" },
    { id: 3, title: "অভিযোগ", path: "/complaint/issueReporting" },
    { id: 4, title: "ফিডব্যাক", path: "/feedback" },
    { id: 5, title: "নোটিশ বোর্ড", path: "/noticeboard" },
    { id: 6, title: "লগআউট", path: "/logout" }
]

const stakeHolder_LoginItems = [
    { id: 1, title: "হোম", path: "/stakeholder" },
    { id: 2, title: "নোটিশ বোর্ড", path: "/noticeboard" },
    { id: 3, title: "সচল রিপোর্টসমূহ", path: "/stakeholder/pending-requests" },
    { id: 4, title: "নতুন রিপোর্ট তৈরী", path: "/stakeholder/requestWork" },
    { id: 5, title: "ফিডব্যাক", path: "/stakeholder/feedback" },
    { id: 6, title: "লগআউট", path: "/stakeholder/logout" }
]

const authority_LoginItems = [
    { id: 1, title: "হোম", path: "/authority" },
    { id: 2, title: "নোটিশ বোর্ড", path: "/authority/noticeboard" },
    { id: 3, title: "নোটিফিকেশন প্যানেল", path: "/authority/notifications" },
    { id: 4, title: "সচল রিপোর্টসমূহ", path: "/authority/work-requests" },
    { id: 5, title: "কনফ্লিক্ট চার্ট", path: "/authority/ganttChart" },
    { id: 6, title: "নতুন রিপোর্ট তৈরী", path: "/authority/request-work" },

    { id: 7, "title": "মানচিত্র দেখুন", path: "/authority/map" },
    { id: 8, title: "লগআউট", path: "/authority/logout" }
]



function logOut() {

    // 1. Remove token/session
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("access_token");
    localStorage.removeItem("uuid");

}

export default function Navbar({ state, name }) {
    const navigate = useNavigate();

    const formatText = (text) => {
        // Add spaces between letters
        const spacedText = text.split('').join(' ');

        // Truncate after 10 characters and add ...
        if (spacedText.length > 20) { // 20 because each letter now has a space
            return spacedText.substring(0, 19) + '...';
        }

        return spacedText;
    };

    return (
        <motion.div
            className="navbar-container fixed top-0 left-[16px] right-[31px] 
             flex flex-row rounded-lg shadow-[4px_2px_20px_10px_rgba(0,0,0,0.25)] bg-white/90 backdrop-blur-md"

            whileHover={{ backgroundColor: "rgba(70,200,70,1)" }}

        // transition={{ ease: "easeInOut", duration: 0.2 }}
        >

            <div className="flex flex-row">
                <div> {/*Logo*/}
                    <img className="w-14 mt-1 ml-2" src={logo} alt="Logo" />
                </div>


                <div className="flex flex-row text-white py-5 px-10 gap-8"> {/* Navbar Links*/}

                    {state === "non_logged_in" && non_LoginItems.map((item) => {
                        if (item.path === "/authority/logout") {
                            return (
                                // <li key={item.id} onClick={logout}>
                                //     {item.title}
                                // </li>
                                <motion.div key={item.id} className="cursor-pointer"
                                    whileHover={{ scale: 1.1 }}
                                    onClick={
                                        () => {
                                            logOut()
                                            console.log("logged out")
                                            navigate("/authenticate")
                                        }
                                    }
                                >
                                    {item.title}

                                </motion.div>
                            );
                        } else {
                            return (
                                <motion.div key={item.id} className=""
                                    whileHover={{ scale: 1.1 }}
                                >
                                    <Link className="navbar-link" to={item.path}>{item.title}</Link>

                                </motion.div>
                            )
                        }


                    })}

                    {state === "user_logged_in" && user_LoginItems.map((item) => {
                        if (item.path === "/logout") {
                            return (
                                // <li key={item.id} onClick={logout}>
                                //     {item.title}
                                // </li>
                                <motion.div key={item.id} className="cursor-pointer font-bold"
                                    whileHover={{ scale: 1.1 }}
                                    onClick={
                                        () => {
                                            logOut()
                                            console.log("logged out")
                                            navigate("/authenticate")
                                        }
                                    }
                                >
                                    {item.title}

                                </motion.div>
                            );
                        } else {
                            return (
                                <motion.div key={item.id} className=""
                                    whileHover={{ scale: 1.1 }}
                                >
                                    <Link className="navbar-link" to={item.path}>{item.title}</Link>

                                </motion.div>
                            )
                        }
                    })}

                    {state === "stakeholder_logged_in" && stakeHolder_LoginItems.map((item) => {
                        if (item.path === "/stakeholder/logout") {
                            return (
                                // <li key={item.id} onClick={logout}>
                                //     {item.title}
                                // </li>
                                <motion.div key={item.id} className="cursor-pointer font-bold"
                                    whileHover={{ scale: 1.1 }}
                                    onClick={
                                        () => {
                                            logOut()
                                            console.log("logged out")
                                            navigate("/authenticate")
                                        }
                                    }
                                >
                                    {item.title}

                                </motion.div>
                            );
                        } else {
                            return (
                                <motion.div key={item.id} className=""
                                    whileHover={{ scale: 1.1 }}
                                >
                                    <Link className="navbar-link" to={item.path}>{item.title}</Link>

                                </motion.div>
                            )
                        }
                    })}

                    {state === "authority_logged_in" && authority_LoginItems.map(item => (
                        <motion.div key={item.id} className=""
                            whileHover={{ scale: 1.1 }}
                        >
                            <Link className="navbar-link" to={item.path}>{item.title}</Link>

                        </motion.div>
                    ))}
                </div>

            </div>

            <motion.div className="flex flex-col bg-white text-black my-3 rounded-3xl px-5 mr-10 justify-center login-text">
                {
                    state === "non_logged_in" && <p>Login</p>
                }

                {
                    !(state === "non_logged_in") && <p className="font-bold" style={{ color: "#64923D" }}>{formatText(name)}</p>
                }
            </motion.div>

        </motion.div>
    );
}