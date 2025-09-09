import { motion } from "framer-motion";
import '../css/authentication.css';
import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react";
import '../css/authWorkReqNorm.css';
import pointLogo from '../assets/mdi_location.png';
import crossLogo from '../assets/maki_cross.png';
import MapModal from "./MapModal";
import ClipLoader from "react-spinners/ClipLoader";

const baseUrl = import.meta.env.VITE_BASE_URL;


// var tasks = [
//     { id: "WASA#21500", from: "1 Nov", to: "15 Nov", isEmergency: false, geometry: { "type": "LineString", "coordinates": [[90.400, 23.870], [90.405, 23.875]] } },
//     { id: "BTCL#41801", from: "5 Nov", to: "20 Nov", isEmergency: false, geometry: { "type": "LineString", "coordinates": [[90.395, 23.865], [90.400, 23.870]] } },
// ];

export default function StakeholderProposedTask() {
    const [isMapModalOpen, setMapModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const handleOpenMap = (task) => { setSelectedTask(task); setMapModalOpen(true); };
    const handleCloseMap = () => { setMapModalOpen(false); };
    const [loading, setLoading] = useState(true)
    const [tasks, setTasks] = useState(undefined)

    const navigate = useNavigate()

    async function getTasks() {
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken) return null;

        const response = await fetch(`${baseUrl}/works/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
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
            console.log(allTasks)

            if (allTasks) {
                const newTasks = allTasks.filter(t => t.status === "ProposedByStakeholder")
                setTasks(newTasks)
                setLoading(false)
            }
        }

        fetchAndSetTasks();
    }, []);




    if (loading) {

        return (
            <div
                className=""
                style={{ textAlign: "center", marginTop: "100px" }}
            >
                <ClipLoader color="#27d887" loading={true} size={50} />
            </div>
        );
    }
    return (
        <>
            <div className="flex flex-row mx-5 h-[calc(63vh)]">
                <div className="flex flex-col w-full">
                    <div className="grow bg-[rgb(248,250,252)] p-5 rounded-4xl">
                        <div className="flex flex-row justify-start items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
                            <p className="" style={{ fontSize: "1.8rem" }}>&nbsp; Proposed &nbsp;<span className="font-bold" style={{ color: "grey" }}>({tasks.length})</span></p>
                        </div>
                        <div className="flex flex-col mt-4 max-h-[calc(50vh)] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-white overflow-y-scroll">
                            <div className="w-[calc(70vw)]"></div>
                            {tasks.map((item, idx) => (
                                <motion.div key={idx} className="flex flex-col text-black my-2 mx-5 bg-white rounded-4xl w-[calc(70vw)] py-5 px-5 shadow-[4px_6px_20px_1px_rgba(0,0,0,0.25)]" whileHover={{ scale: 1.02 }}>
                                    <div className="flex flex-row items-center">
                                        <p style={{ fontSize: '1.4rem' }}>{item.name}</p>
                                        {item.tag === "Emergency" && <motion.div className="bg-[rgb(252,210,220)] rounded-3xl px-3 py-1 text-center font-bold ml-7"><p style={{ color: 'red', fontSize: '0.7rem' }}>জরুরী</p></motion.div>}
                                    </div>
                                    <div className="mt-2"></div>
                                    <div className="flex flex-row justify-between items-center">
                                        <p style={{ fontSize: '1.2rem' }}>{item.proposed_start_date} - {item.proposed_end_date}</p>
                                        <div className="flex flex-row justify-center">
                                            <motion.div className="w-8 h-8 mr-1 rounded-lg bg-contain bg-center bg-no-repeat m-1" style={{ backgroundImage: `url(${pointLogo})` }} initial={{ backgroundColor: "#FFFFFF" }} whileHover={{ backgroundColor: "#E2FBD3", scale: 1.1 }} onClick={() => handleOpenMap(item)} />
                                            <motion.div className="w-8 h-8 rounded-lg bg-contain bg-center bg-no-repeat m-1" style={{ backgroundImage: `url(${crossLogo})` }} initial={{ backgroundColor: "#FFFFFF" }} whileHover={{ backgroundColor: "#FFE4E4FF", scale: 1.1 }} onClick={() => null} />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <MapModal isOpen={isMapModalOpen} onClose={handleCloseMap} taskData={selectedTask} />
        </>
    );
}