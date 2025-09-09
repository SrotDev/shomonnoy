import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom"
import '../css/authentication.css';
import { useState, useEffect } from "react";
import '../css/authWorkReqNorm.css';
import ClipLoader from "react-spinners/ClipLoader";

const baseUrl = import.meta.env.VITE_BASE_URL;


// const tasks = [
//     [ // Group 1
//         { id: "WASA#20102", from: "1 Sep", to: "19 Sep", isEmergency: false, geometry: { type: 'LineString', coordinates: [[90.41, 23.76], [90.42, 23.77]] } },
//         { id: "DESCO#50331", from: "5 Sep", to: "15 Sep", isEmergency: true, geometry: { type: 'LineString', coordinates: [[90.415, 23.765], [90.425, 23.775]] } },
//     ],
//     [ // Group 2
//         { id: "BTCL#10982", from: "8 Sep", to: "20 Sep", isEmergency: false, geometry: { type: 'LineString', coordinates: [[90.37, 23.78], [90.38, 23.79]] } },
//         { id: "RHD#88125", from: "10 Sep", to: "18 Sep", isEmergency: false, geometry: { type: 'LineString', coordinates: [[90.375, 23.785], [90.385, 23.795]] } },
//     ],

//     [ // Group 3
//         { id: "DPDC#40119", from: "12 Sep", to: "25 Sep", isEmergency: true, geometry: { type: 'LineString', coordinates: [[90.39, 23.80], [90.40, 23.81]] } },
//         { id: "TITAS#70554", from: "14 Sep", to: "22 Sep", isEmergency: false, geometry: { type: 'LineString', coordinates: [[90.395, 23.805], [90.405, 23.815]] } },
//     ]
// ];



const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>;
const MapPinIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;


const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
};


export default function AuthorityWorkReqConflicted({ onShowMap }) {

    const [loading, setLoading] = useState(true)
    const [tasks, setTasks] = useState(undefined)

    const navigate = useNavigate()

    async function getTasks() {
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken) return null;

        const response = await fetch(`${baseUrl}/conflicts/`, {
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
                setTasks(allTasks)
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
            className="bg-white rounded-2xl p-8 shadow-2xl w-full max-w-3xl mx-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            <div className="flex items-center mb-8">
                <span className="w-3.5 h-3.5 bg-red-500 rounded-full mr-4 flex-shrink-0 shadow-md shadow-red-300"></span>
                <h2 className="text-2xl font-bold text-gray-800">সাংঘর্ষিক রিপোর্ট ({tasks.length})</h2>
            </div>

            <motion.div
                className="space-y-8 max-h-[65vh] overflow-y-auto pr-3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >

                <AnimatePresence>
                    {tasks.map((group, index) => (
                        <motion.div
                            key={index}
                            className="bg-orange-50/50 rounded-xl border-l-4 border-orange-400 shadow-md transition-all duration-300 hover:shadow-xl hover:border-orange-500"
                            variants={itemVariants}
                            layout
                        >

                            <div className="p-5 flex justify-between items-center border-b border-orange-200">
                                <h3 className="font-bold text-lg text-orange-800">Conflict Group {index + 1}</h3>
                                <motion.button
                                    className="bg-green-600 text-white font-bold py-2 px-5 rounded-lg shadow-sm hover:bg-green-700 transition-all"
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    মীমাংসা করুন
                                </motion.button>
                            </div>


                            <div className="p-5 space-y-3">
                                {group.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">

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
                                            {/* <motion.button
                                                className="p-3 bg-green-600 rounded-lg shadow-sm hover:bg-green-700 transition-all"
                                                title="Approve"
                                                whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                                            >
                                                <CheckIcon />
                                            </motion.button> */}

                                            <motion.button
                                                className="p-3 bg-green-600 rounded-lg shadow-sm hover:bg-green-700 transition-all"
                                                title="Show on Map"
                                                onClick={() => onShowMap(item)}
                                                whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                                            >
                                                <MapPinIcon />
                                            </motion.button>

                                            {/* <motion.button
                                                className="p-3 bg-green-600 rounded-lg shadow-sm hover:bg-green-700 transition-all"
                                                title="Reject"
                                                whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                                            >
                                                <XIcon />
                                            </motion.button> */}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
}