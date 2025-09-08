import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import MapView from './Map/map.jsx';
import crossLogo from '../assets/maki_cross.png';
import './Map/map.css';


const modalVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { scale: 0.9, opacity: 0, transition: { duration: 0.2, ease: "easeIn" } }
};

export default function MapModal({ isOpen, onClose, taskData }) {

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="map-modal-overlay" onClick={onClose}>
                    <motion.div className="map-modal-content" variants={modalVariants} initial="hidden" animate="visible" exit="exit" onClick={(e) => e.stopPropagation()}>
                        <div className="map-modal-header">
                            <h2>Task Location: <span className="task-id-highlight">{taskData?.id}</span></h2>
                            
                          
                            <motion.button 
                                className="close-button" 
                                onClick={onClose} 
                                whileHover={{ scale: 1.1, rotate: 90 }} 
                                whileTap={{ scale: 0.9 }}
                            >
                                <img src={crossLogo} alt="Close" />
                            </motion.button>

                        </div>
                        <div className="map-modal-body">
                            <MapView requestData={taskData} />
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}