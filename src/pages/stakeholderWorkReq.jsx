import { Link, useNavigate } from "react-router-dom"
import { AnimatePresence, easeInOut, motion } from "framer-motion"
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import StakeholderPlannedTask from "../components/stakeholderPlannedTask";
import StakeholderProposedTask from "../components/stakeholderProposedTask";
import StakeholderDeclinedTask from "../components/stakeholderDeclinedTask";
import StakeholderWaitingTask from "../components/stakeholderWaitingTask";
import StakeholderProgressTask from "../components/stakeholderProgressTask";
import StakeholderDoneTask from "../components/stakeholderDoneTask";
import PreLoader2 from "./LoadingPage";


const baseUrl = import.meta.env.VITE_BASE_URL;


export default function StakeholderWorkReq() {
    const [select, setselect] = useState(0)
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
                        Navigate("/authenticate")
                    } else {
                        if (userData.role === "stakeholder") {
                            setNavState("stakeholder_logged_in")
                            setNavName(userData.name)
                        } else {
                            console.log("Here")
                            localStorage.removeItem("refresh_token");
                            localStorage.removeItem("access_token")
                            Navigate("/authenticate")
                        }


                    }






                } else {
                    Navigate("/403")
                }

                setIsLoading(false)
                if (intervalId) {
                    clearInterval(intervalId);
                }
            }
        }





        pollAvailability();
        intervalId = setInterval(pollAvailability, 5000);



        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, []);



    

    return (
        <>
            <Navbar state={navState} name={navName} />
            <div className="flex flex-col">

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
                            backgroundColor: select === 0 ? '#72C69E' : '#F1FFEE',
                            color: select === 0 ? '#F1FFEE' : '#72C69E'
                        }}
                        onClick={() => setselect(0)}
                    >
                        <p>Admin Proposal
                        </p>
                    </motion.div>
                    <motion.div className=" bg-[rgb(114,198,158)] rounded-3xl px-10 py-2  text-center shadow-[4px_2px_10px_2px_rgba(0,0,0,0.12)] backdrop-blur-md font-bold"
                        whileHover={{
                            scale: 1.1,
                            backgroundColor: "rgba(70,200,70,1)",
                            color: "rgba(241,255,238,1)"
                        }}
                        animate={{
                            backgroundColor: select === 1 ? '#72C69E' : '#F1FFEE',
                            color: select === 1 ? '#F1FFEE' : '#72C69E'

                        }}

                        onClick={() => setselect(1)}
                    >
                        <p>Proposed</p>
                    </motion.div>
                    <motion.div className="bg-[rgb(114,198,158)] rounded-3xl px-5 py-2 text-center shadow-[4px_2px_10px_2px_rgba(0,0,0,0.12)] backdrop-blur-md font-bold"
                        whileHover={{
                            scale: 1.1,
                            backgroundColor: "rgba(70,200,70,1)",  // TODO ... color thik korte hobe
                            color: "rgba(241,255,238,1)"
                        }}
                        animate={{
                            backgroundColor: select === 2 ? '#F52929FF' : '#FDD2D2FF',
                            color: select === 2 ? '#FDD2D2FF' : '#F52929FF'
                        }}
                        onClick={() => setselect(2)}
                    >
                        <p>Declined</p>
                    </motion.div>
                    <motion.div className="bg-[rgb(114,198,158)] rounded-3xl px-5 py-2 text-center shadow-[4px_2px_10px_2px_rgba(0,0,0,0.12)] backdrop-blur-md font-bold"
                        whileHover={{
                            scale: 1.1,
                            backgroundColor: "rgba(70,200,70,1)",
                            color: "rgba(241,255,238,1)"
                        }}
                        animate={{
                            backgroundColor: select === 3 ? '#72C69E' : '#F1FFEE',
                            color: select === 3 ? '#F1FFEE' : '#72C69E'
                        }}
                        onClick={() => setselect(3)}
                    >
                        <p>Authorized</p>
                    </motion.div>

                    <motion.div className="bg-[rgb(114,198,158)] rounded-3xl px-5 py-2 text-center shadow-[4px_2px_10px_2px_rgba(0,0,0,0.12)] backdrop-blur-md font-bold"
                        whileHover={{
                            scale: 1.1,
                            backgroundColor: "rgba(70,200,70,1)",
                            color: "rgba(241,255,238,1)"
                        }}
                        animate={{
                            backgroundColor: select === 4 ? '#72C69E' : '#F1FFEE',
                            color: select === 4 ? '#F1FFEE' : '#72C69E'
                        }}
                        onClick={() => setselect(4)}
                    >
                        <p>In Progress</p>
                    </motion.div>
                    <motion.div className="bg-[rgb(114,198,158)] rounded-3xl px-5 py-2 text-center shadow-[4px_2px_10px_2px_rgba(0,0,0,0.12)] backdrop-blur-md font-bold"
                        whileHover={{
                            scale: 1.1,
                            backgroundColor: "rgba(70,200,70,1)",
                            color: "rgba(241,255,238,1)"
                        }}
                        animate={{
                            backgroundColor: select === 5 ? '#72C69E' : '#F1FFEE',
                            color: select === 5 ? '#F1FFEE' : '#72C69E'
                        }}
                        onClick={() => setselect(5)}
                    >
                        <p>Done</p>
                    </motion.div>




                </div>
                <div className="my-10 flex flex-row justify-center">
                    {
                        select === 0 && <StakeholderPlannedTask />
                    }

                    {
                        select === 1 && <StakeholderProposedTask />
                    }

                    {
                        select === 2 && <StakeholderDeclinedTask />
                    }
                    {
                        select === 3 && <StakeholderWaitingTask />
                    }
                    {
                        select === 4 && <StakeholderProgressTask />
                    }

                    {
                        select === 5 && <StakeholderDoneTask />
                    }

                </div>


            </div>
        </>
    )
}