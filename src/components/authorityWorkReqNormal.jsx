import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom"
import '../css/authentication.css';
import { useState, useEffect } from "react";
import '../css/authWorkReqNorm.css';
import ClipLoader from "react-spinners/ClipLoader";


const baseUrl = import.meta.env.VITE_BASE_URL;

// const noConflicts = [
//     { id: "WASA#20102", from: "1 Sep", to: "19 Sep", isEmergency: false, geometry: { type: 'LineString', coordinates: [[90.395, 23.73], [90.405, 23.74]] } },
//     { id: "WASA#20103", from: "1 Sep", to: "19 Sep", isEmergency: true, geometry: { type: 'LineString', coordinates: [[90.38, 23.75], [90.39, 23.755]] } },
//     { id: "WASA#20104", from: "1 Sep", to: "19 Sep", isEmergency: true, geometry: { type: 'LineString', coordinates: [[90.41, 23.72], [90.415, 23.725]] } },
//     { id: "WASA#20105", from: "1 Sep", to: "19 Sep", isEmergency: false, geometry: { type: 'LineString', coordinates: [[90.40, 23.71], [90.405, 23.715]] } },
//     // --- ADDED DATA ---
//     { id: "WASA#20106", from: "2 Sep", to: "20 Sep", isEmergency: false, geometry: { type: 'LineString', coordinates: [[90.39, 23.71], [90.395, 23.715]] } },
//     { id: "WASA#20107", from: "3 Sep", to: "21 Sep", isEmergency: false, geometry: { type: 'LineString', coordinates: [[90.42, 23.73], [90.425, 23.735]] } },
//     { id: "WASA#20108", from: "4 Sep", to: "22 Sep", isEmergency: true, geometry: { type: 'LineString', coordinates: [[90.37, 23.74], [90.375, 23.745]] } },
// ];

const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>;
const MapPinIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;





const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.07, delayChildren: 0.2 }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
};



export default function AuthorityWorkReqNormal({ onShowMap }) {
    async function accept(item) {
        console.log(item)
        const accessToken = localStorage.getItem("access_token");
        const response = await fetch(`${baseUrl}/works/${item.uuid}/`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                status: "Planned"
            }),
        })

        

        const resp = await response.json()

        if (!response.ok) {
            console.log("error")
        } else {
            alert("Work request has been successfully accepted!");
            window.location.reload(); 
        }

    }

    async function decline(item) {
        console.log(item)
        const accessToken = localStorage.getItem("access_token");
        const response = await fetch(`${baseUrl}/works/${item.uuid}/`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                status: "Declined"
            }),
        })

        

        const resp = await response.json()

        if (!response.ok) {
            console.log("error")
        } else {
            alert("Work request has been successfully accepted!");
            window.location.reload(); 
        }

    }


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
                const newTasks = allTasks.filter(t => (t.conflicts.length === 0 && t.status === "ProposedByStakeholder"))
                setTasks(newTasks)
                setLoading(false)
            }
        }

        fetchAndSetTasks();
    }, [loading]);




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

        <motion.div
            className="bg-white rounded-2xl p-8 shadow-xl w-full max-w-2xl mx-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
        >
            <div className="flex items-center mb-6">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-3 flex-shrink-0"></span>
                <h2 className="text-xl font-bold text-gray-800">সাধারণ রিপোর্ট ({tasks.length})</h2>
            </div>


            <motion.div
                className="space-y-4 max-h-[60vh] overflow-y-auto pr-2"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {tasks.map((item) => (

                    <motion.div
                        key={item.id}
                        className="bg-slate-50 p-4 rounded-xl border flex justify-between items-center transition-all duration-300 hover:shadow-lg hover:border-green-300 hover:bg-white"
                        variants={itemVariants}
                    >

                        <div>
                            <div className="flex items-center gap-3">
                                <p className="font-bold text-gray-900 tracking-wide">{item.name}</p>
                                {item.tag === "Emergency" && (
                                    <span className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full">জরুরী</span>
                                )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{`${item.proposed_start_date} - ${item.proposed_end_date}`}</p>
                        </div>


                        <div className="flex items-center gap-3">
                            <motion.button
                                className="p-3 bg-green-600 rounded-lg shadow-sm transition-colors duration-200 hover:bg-green-700"
                                title="Approve"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    accept(item)
                                }}
                            >
                                <CheckIcon />
                            </motion.button>

                            <motion.button
                                className="p-3 bg-green-600 rounded-lg shadow-sm transition-colors duration-200 hover:bg-green-700"
                                title="Show on Map"
                                onClick={() => onShowMap(item)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <MapPinIcon />
                            </motion.button>

                            <motion.button
                                className="p-3 bg-green-600 rounded-lg shadow-sm transition-colors duration-200 hover:bg-green-700"
                                title="Reject"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={()=>{
                                    decline(item)
                                }}
                            >
                                <XIcon />
                            </motion.button>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    );
}