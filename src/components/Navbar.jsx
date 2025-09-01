import { Link } from "react-router-dom"
import { easeInOut, motion } from "framer-motion"
import { useState } from "react";

import '../css/navbar.css'

const non_LoginItems = [
    { id: 1, title: "হোম", path: "/" },
    { id: 2, title: "নোটিশ বোর্ড", path: "/noticeboard" },
    { id: 3, title: "লগইন/রেজিস্টার", path: "/authenticate" }
]

const user_LoginItems = [
    { id: 1, title: "হোম", path: "/" },
    { id: 2, title: "নোটিশ বোর্ড", path: "/notifications" },
    { id: 3, title: "অভিযোগ", path: "/complaint/issueReporting" },
    { id: 4, title: "ফিডব্যাক", path: "/feedback" },
    { id: 5, title: "নোটিশ বোর্ড", path: "/noticeboard" },
    { id: 6, title: "লগআউট", path: "/logout" }
]

const stakeHolder_LoginItems = [
    { id: 1, title: "হোম", path: "/stakeholder" },
    { id: 2, title: "নোটিশ বোর্ড", path: "/stakeholder/notifications" },
    { id: 3, title: "সচল রিপোর্টসমূহ", path: "/stakeholder/kanBanBoard" },
    { id: 4, title: "নতুন রিপোর্ট তৈরী", path: "/stakeholder/requestWork" },
    { id: 5, title: "ফিডব্যাক", path: "/stakeholder/feedback" },
    { id: 6, title: "লগআউট", path: "/stakeholder/logout" }
]

const authority_LoginItems = [
    { id: 1, title: "হোম", path: "/authority" },
    { id: 2, title: "নোটিশ বোর্ড", path: "/authority/map" },
    { id: 3, title: "নোটিফিকেশন প্যানেল", path: "/authority/notifications" },
    { id: 4, title: "সচল রিপোর্টসমূহ", path: "/authority/kanBanBoard" },
    { id: 5, title: "কনফ্লিক্ট চার্ট", path: "/authority/ganttChart" },
    { id: 6, title: "নতুন রিপোর্ট তৈরী", path: "/authority/request-work" },
    { id: 7, title: "ফিডব্যাক", path: "/authority/feedback" },
    { id: 8, title: "লগআউট", path: "/authority/logout" }
]


export default function Navbar({ state }) {

    return (
        <motion.div
            className="navbar-container fixed top-0 left-[16px] right-[31px] 
             flex flex-row rounded-lg shadow-[4px_2px_20px_10px_rgba(0,0,0,0.25)] bg-white/90 backdrop-blur-md"
  whileHover={{ backgroundColor: "rgba(100,200,100,1)" }}
            
        // transition={{ ease: "easeInOut", duration: 0.2 }}
        >
            <div> {/*Logo*/}
                <img className="w-16 m-2" src="/logo.png" alt="Logo" />
            </div>


            <div className="flex flex-row text-white py-5 px-10 gap-8"> {/* Navbar Links*/}

                {state === "non_logged_in" && non_LoginItems.map(item => (
                    <motion.div key={item.id} className=""
                        whileHover={{ scale: 1.1 }}
                    >
                        <Link className="navbar-link" to={item.path}>{item.title}</Link>

                    </motion.div>
                ))}

                {state === "user_logged_in" && user_LoginItems.map(item => (
                    <motion.div key={item.id} className=""
                        whileHover={{ scale: 1.1 }}
                    >
                        <Link className="navbar-link" to={item.path}>{item.title}</Link>

                    </motion.div>
                ))}

                {state === "stakeholder_logged_in" && stakeHolder_LoginItems.map(item => (
                    <motion.div key={item.id} className=""
                        whileHover={{ scale: 1.1 }}
                    >
                        <Link className="navbar-link" to={item.path}>{item.title}</Link>

                    </motion.div>
                ))}

                {state === "authority_logged_in" && authority_LoginItems.map(item => (
                    <motion.div key={item.id} className=""
                        whileHover={{ scale: 1.1 }}
                    >
                        <Link className="navbar-link" to={item.path}>{item.title}</Link>

                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}