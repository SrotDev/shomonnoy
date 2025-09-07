import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';


const pendingRequests = [
    {
        id: "WASA#SAR20102", from: "1 Sep", to: "19 Sep", isEmergency: false,
      
        geometry: { type: 'LineString', coordinates: [ [90.3683, 23.7505], [90.3675, 23.7530], [90.3668, 23.7552], [90.3660, 23.7575] ] }
    },
    {
        id: "DESCO#SAR5011", from: "2 Sep", to: "22 Sep", isEmergency: true,
        
        geometry: { type: 'LineString', coordinates: [ [90.4145, 23.7915], [90.4150, 23.7935], [90.4155, 23.7958] ] }
    },
    {
        id: "BTCL#SAR9901", from: "5 Sep", to: "25 Sep", isEmergency: false,
        
        geometry: { type: 'LineString', coordinates: [ [90.3758, 23.7520], [90.3770, 23.7525], [90.3785, 23.7523], [90.3800, 23.7518] ] }
    },
    {
        id: "RHD#SAR4321", from: "6 Sep", to: "16 Sep", isEmergency: true,
      
        geometry: { type: 'LineString', coordinates: [ [90.4055, 23.7950], [90.4068, 23.7945], [90.4075, 23.7955], [90.4070, 23.7965] ] }
    },
    {
        id: "TITAS#SAR1123", from: "8 Sep", to: "18 Sep", isEmergency: false,
     
        geometry: { type: 'LineString', coordinates: [ [90.3925, 23.7550], [90.3928, 23.7580], [90.3932, 23.7605] ] }
    },
    {
        id: "DPDC#SAR8855", from: "10 Sep", to: "20 Sep", isEmergency: false,
      
        geometry: { type: 'LineString', coordinates: [ [90.4010, 23.7650], [90.4035, 23.7660], [90.4050, 23.7675] ] }
    },
    {
        id: "WASA#SAR20109", from: "12 Sep", to: "28 Sep", isEmergency: true,
       
        geometry: { type: 'LineString', coordinates: [ [90.3655, 23.7590], [90.3648, 23.7615], [90.3640, 23.7635] ] }
    }
];




const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>;
const MapPinIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;


const Tooltip = ({ text, children }) => {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <div className="relative flex items-center" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            {children}
            <AnimatePresence>
                {isHovered && (
                    <motion.div initial={{ opacity: 0, y: 10, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.9 }} transition={{ duration: 0.2, ease: 'easeOut' }} className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs font-bold rounded-md shadow-lg whitespace-nowrap">
                        {text}
                        <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-900"></div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};


const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } } };
const itemVariants = { hidden: { y: 30, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: 'spring', damping: 15, stiffness: 100 } } };

export default function AuthorityWorkReqPending({ onShowMap }) {
    return (
        <motion.div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-2xl w-full max-w-2xl mx-auto border border-violet-100" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
            <div className="flex items-center mb-8">
                <span className="relative flex h-4 w-4 mr-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-violet-500 shadow-md shadow-violet-300"></span>
                </span>
                <h2 className="text-2xl font-bold text-gray-800">পুনঃনিরীক্ষণ আবেদনসমূহ ({pendingRequests.length})</h2>
            </div>
            <motion.div className="space-y-4 max-h-[60vh] overflow-y-auto pr-3" variants={containerVariants} initial="hidden" animate="visible">
                {pendingRequests.map((item) => (
                    <motion.div key={item.id} className="bg-slate-50 p-4 rounded-xl flex justify-between items-center border-l-4 border-violet-400 transition-all duration-300 cursor-pointer" variants={itemVariants} whileHover={{ scale: 1.03, y: -5, boxShadow: '0 15px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', borderColor: '#8b5cf6' }} layout>
                        <div>
                            <div className="flex items-center gap-3">
                                <p className="font-bold text-gray-900 tracking-wide text-lg">{item.id}</p>
                                {item.isEmergency && (<span className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full shadow-sm">জরুরী</span>)}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{`${item.from} - ${item.to}`}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Tooltip text="Approve"><motion.button className="p-3 bg-green-600 rounded-lg shadow-sm hover:bg-green-700 transition-all" whileHover={{ scale: 1.15, rotate: -5 }} whileTap={{ scale: 0.9 }}><CheckIcon /></motion.button></Tooltip>
                            <Tooltip text="Show on Map"><motion.button className="p-3 bg-green-600 rounded-lg shadow-sm hover:bg-green-700 transition-all" onClick={() => onShowMap(item)} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}><MapPinIcon /></motion.button></Tooltip>
                            <Tooltip text="Reject"><motion.button className="p-3 bg-green-600 rounded-lg shadow-sm hover:bg-green-700 transition-all" whileHover={{ scale: 1.15, rotate: 5 }} whileTap={{ scale: 0.9 }}><XIcon /></motion.button></Tooltip>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    );
}