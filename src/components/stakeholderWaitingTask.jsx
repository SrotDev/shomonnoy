import { motion } from "framer-motion";
import '../css/authentication.css';
import { useState } from "react";
import '../css/authWorkReqNorm.css';
import pointLogo from '../assets/mdi_location.png';
import MapModal from "./MapModal";


var tasks = [
    { id: "RHD#31001", from: "10 Oct", to: "30 Oct", isEmergency: false, geometry: { "type": "LineString", "coordinates": [[90.365, 23.805], [90.370, 23.810]] } },
    { id: "DESCO#51023", from: "15 Oct", to: "25 Oct", isEmergency: true, geometry: { "type": "LineString", "coordinates": [[90.355, 23.795], [90.360, 23.800]] } },
];

export default function StakeholderWaitingTask() {
    const [isMapModalOpen, setMapModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const handleOpenMap = (task) => { setSelectedTask(task); setMapModalOpen(true); };
    const handleCloseMap = () => { setMapModalOpen(false); };

    return (
        <>
            <div className="flex flex-row mx-5 h-[calc(63vh)]">
                <div className="flex flex-col w-full">
                    <div className="grow bg-[rgb(248,250,252)] p-5 rounded-4xl">
                        <div className="flex flex-row justify-start items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                            <p className="" style={{ fontSize: "1.8rem" }}>&nbsp; Authorized &nbsp;<span className="font-bold" style={{ color: "grey" }}>({tasks.length})</span></p>
                        </div>
                        <div className="flex flex-col mt-4 max-h-[calc(50vh)] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-white overflow-y-scroll">
                            {tasks.map((item, idx) => (
                                <motion.div key={idx} className="flex flex-col text-black my-2 mx-5 bg-white rounded-4xl w-[calc(70vw)] py-5 px-5 shadow-[4px_6px_20px_1px_rgba(0,0,0,0.25)]" whileHover={{ scale: 1.02 }}>
                                    <div className="flex flex-row items-center">
                                        <p style={{ fontSize: '1.4rem' }}>{item.id}</p>
                                        {item.isEmergency && <motion.div className="bg-[rgb(252,210,220)] rounded-3xl px-3 py-1 text-center font-bold ml-7"><p style={{ color: 'red', fontSize: '0.7rem' }}>জরুরী</p></motion.div>}
                                    </div>
                                    <div className="mt-2"></div>
                                    <div className="flex flex-row justify-between items-center">
                                        <p style={{ fontSize: '1.2rem' }}>{item.from} - {item.to}</p>
                                        <div className="flex flex-row justify-center">
                                            <motion.div className="w-8 h-8 mr-1 rounded-lg bg-contain bg-center bg-no-repeat m-1" style={{ backgroundImage: `url(${pointLogo})` }} initial={{ backgroundColor: "#FFFFFF" }} whileHover={{ backgroundColor: "#E2FBD3", scale: 1.1 }} onClick={() => handleOpenMap(item)} />
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