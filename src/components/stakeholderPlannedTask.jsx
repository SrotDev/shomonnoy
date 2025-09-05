import { motion } from "framer-motion";
import '../css/authentication.css';
import { useState } from "react";
import '../css/authWorkReqNorm.css';
import rightLogo from '../assets/material-symbols_check.png';
import pointLogo from '../assets/mdi_location.png';
import crossLogo from '../assets/maki_cross.png';
import reloadLogo from '../assets/refresh.png';
import MapModal from "./MapModal";


var tasks = [
    { id: "WASA#20102", from: "1 Oct", to: "19 Oct", isEmergency: false, geometry: { "type": "LineString", "coordinates": [[90.410, 23.790], [90.415, 23.795]] } },
    { id: "RHD#30115", from: "5 Oct", to: "25 Oct", isEmergency: true, geometry: { "type": "LineString", "coordinates": [[90.405, 23.800], [90.410, 23.805]] } },
    { id: "BTCL#40228", from: "10 Oct", to: "30 Oct", isEmergency: true, geometry: { "type": "LineString", "coordinates": [[90.418, 23.792], [90.423, 23.797]] } },
    { id: "DESCO#50331", from: "12 Oct", to: "22 Oct", isEmergency: false, geometry: { "type": "LineString", "coordinates": [[90.400, 23.785], [90.405, 23.790]] } },
];

export default function StakeholderPlannedTask() {
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
                            <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                            <p className="" style={{ fontSize: "1.8rem" }}>&nbsp; Planned &nbsp;<span className="font-bold" style={{ color: "grey" }}>({tasks.length})</span></p>
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
                                            <motion.div className="w-8 h-8 rounded-lg bg-contain bg-center bg-no-repeat m-1" style={{ backgroundImage: `url(${rightLogo})` }} initial={{ backgroundColor: "#FFFFFF" }} whileHover={{ backgroundColor: "#E2FBD3", scale: 1.1 }} onClick={() => null} />
                                            <motion.div className="w-8 h-8 mr-1 rounded-lg bg-contain bg-center bg-no-repeat m-1" style={{ backgroundImage: `url(${pointLogo})` }} initial={{ backgroundColor: "#FFFFFF" }} whileHover={{ backgroundColor: "#E2FBD3", scale: 1.1 }} onClick={() => handleOpenMap(item)} />
                                            <motion.div className="w-8 h-8 rounded-lg bg-contain bg-center bg-no-repeat m-1" style={{ backgroundImage: `url(${reloadLogo})` }} initial={{ backgroundColor: "#FFFFFF" }} whileHover={{ backgroundColor: "#C1E6FAFF", scale: 1.1 }} onClick={() => null} />
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