import { Link } from "react-router-dom"
import { AnimatePresence, easeInOut, motion } from "framer-motion"
import '../css/authentication.css'
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import AuthorityWorkReqNormal from "../components/authorityWorkReqNormal";
import AuthorityWorkReqConflicted from "../components/authorityWorkReqConflict";
import AuthorityWorkReqPending from "../components/authorityWorkReqPending";

export default function AuthorityWorkRequests() {
    const [optState, setOptState] = useState(0);

    return (
        <>
            <div className="flex flex-col">
                <Navbar state="authority_logged_in" />
                <motion.div
                    className="bg-[rgb(114,198,158)] px-14 py-2 text-white text-center shadow-[4px_2px_10px_2px_rgba(0,0,0,0.12)] backdrop-blur-md font-bold mt-30"
                    whileHover={{ backgroundColor: "rgba(70,200,70,1)" }}
                >
                    সচল রিপোর্টসমূহ
                </motion.div>


                <div className="flex flex-row gap-10 items-center justify-center mt-8">
                    <motion.div className="bg-[rgb(114,198,158)]  rounded-3xl px-8 py-2  text-center shadow-[4px_2px_10px_2px_rgba(0,0,0,0.12)] backdrop-blur-md font-bold"
                        whileHover={{
                            scale: 1.1,
                            backgroundColor: "rgba(70,200,70,1)",
                            color: "rgba(241,255,238,1)"
                        }}
                        animate={{
                            backgroundColor: optState === 0 ? '#72C69E' : '#F1FFEE',
                            color: optState === 0 ? '#F1FFEE' : '#72C69E'
                        }}
                        onClick={() => setOptState(0)}
                    >
                        <p>সাধারণ
                        </p>
                    </motion.div>
                    <motion.div className=" bg-[rgb(114,198,158)] rounded-3xl px-10 py-2  text-center shadow-[4px_2px_10px_2px_rgba(0,0,0,0.12)] backdrop-blur-md font-bold"
                        whileHover={{
                            scale: 1.1,
                            backgroundColor: "rgba(70,200,70,1)",
                            color: "rgba(241,255,238,1)"
                        }}
                        animate={{
                            backgroundColor: optState === 1 ? '#72C69E' : '#F1FFEE',
                            color: optState === 1 ? '#F1FFEE' : '#72C69E'

                        }}

                        onClick={() => setOptState(1)}
                    >
                        <p>সাংঘর্ষিক</p> 
                    </motion.div>
                    <motion.div className="bg-[rgb(114,198,158)] rounded-3xl px-5 py-2 text-center shadow-[4px_2px_10px_2px_rgba(0,0,0,0.12)] backdrop-blur-md font-bold"
                        whileHover={{
                            scale: 1.1,
                            backgroundColor: "rgba(70,200,70,1)",
                            color: "rgba(241,255,238,1)"
                        }}
                        animate={{
                            backgroundColor: optState === 2 ? '#72C69E' : '#F1FFEE',
                            color: optState === 2 ? '#F1FFEE' : '#72C69E'
                        }}
                        onClick={() => setOptState(2)}
                    >
                        <p>পুনঃনিরীক্ষণ আবেদনসমূহ</p>
                    </motion.div>


                    
                </div>
                <div className="flex flex-row">
                        <div className="my-10 ml-10"> {/*content*/}
                            {
                                optState === 0 && <AuthorityWorkReqNormal/>
                            }
                            {
                                optState === 1 && <AuthorityWorkReqConflicted />
                            }
                            {
                                optState === 2 && <AuthorityWorkReqPending />
                            }
                        </div>
                        <div>
                            {/* TODO ADD MAP HERE */}
                        </div>
                </div>
                
            </div>

        </>
    )
}