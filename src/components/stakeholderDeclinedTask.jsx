import { Link } from "react-router-dom"
import { AnimatePresence, easeInOut, motion, scale } from "framer-motion"
import '../css/authentication.css'
import { useState, useEffect } from "react";


import '../css/authWorkReqNorm.css'


import rightLogo from '../assets/material-symbols_check.png'
import pointLogo from '../assets/mdi_location.png'
import crossLogo from '../assets/maki_cross.png'
import reloadLogo from '../assets/refresh.png'


var tasks = [{
        id: "WASA#20102",
        from: "1 Sep",
        to: "19 Sep",
        isEmergency: false,

    },

    {
        id: "WASA#20102",
        from: "1 Sep",
        to: "19 Sep",
        isEmergency: true,

    },
    {
        id: "WASA#20102",
        from: "1 Sep",
        to: "19 Sep",
        isEmergency: true,

    },
    {
        id: "WASA#20102",
        from: "1 Sep",
        to: "19 Sep",
        isEmergency: true,

    },

    {
        id: "WASA#20102",
        from: "1 Sep",
        to: "19 Sep",
        isEmergency: true,

    }, {
        id: "WASA#20102",
        from: "1 Sep",
        to: "19 Sep",
        isEmergency: true,

    }, {
        id: "WASA#20102",
        from: "1 Sep",
        to: "19 Sep",
        isEmergency: true,

    }, {
        id: "WASA#20102",
        from: "1 Sep",
        to: "19 Sep",
        isEmergency: true,

    },
]


export default function StakeholderDeclinedTask(){
    return(
        <div className="flex flex-row mx-5 h-[calc(63vh)]">
                    <div className="flex flex-col">
                        <div className="grow bg-[rgb(248,250,252)] p-5 rounded-4xl">
                            <div className="flex flex-col">
                                <div className="flex flex-row justify-start items-center gap-2">
                                    <div className="w-4 h-4 rounded-full bg-red-500"></div>
                                    <p className="" style={{ fontSize: "1.8rem" }}>
                                        &nbsp; Declined &nbsp;
                                        <span className="font-bold" style={{ color: "grey" }}>({tasks.length})</span>
                                    </p>
                                </div>
                                <div className="flex flex-col mt-4 max-h-[calc(50vh)] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-white scrollable-container overflow-y-scroll"> {/*Scrollable div*/}
                                    {
                                        tasks.map((item, idx) => {
                                            return (
                                                <motion.div
                                                    key={idx}
                                                    className="flex flex-col text-black my-2 mx-5 bg-red-100 rounded-4xl w-[calc(70vw)] py-5 px-5 shadow-[4px_6px_20px_1px_rgba(0,0,0,0.25)]  backdrop-blur-md"
        
                                                    whileHover={{scale: 1.02}}
                                                >
                                                    <div className="flex flex-row items-center">
                                                        <p style={{ fontSize: '1.4rem' }}>{item.id}</p>
                                                        {item.isEmergency &&
                                                            <motion.div className="bg-[rgb(252,210,220)] rounded-3xl px-3 py-1 text-center backdrop-blur-md font-bold ml-7"
                                                            >
                                                                <p style={{ color: 'red', fontSize: '0.7rem' }}>জরুরী</p>
                                                            </motion.div>}
                                                    </div>
                                                    <div className="mt-2"></div>
                                                    <div className="flex flex-row justify-between items-center">
                                                        <p style={{ fontSize: '1.2rem' }}>{item.from} - {item.to}</p>
        
                                                        <div className="flex flex-row justify-center">
                                                            
                                                            <motion.div
                                                                className="w-8 h-8 mr-1 rounded-lg bg-contain bg-center bg-no-repeat m-1"
                                                                style={{ backgroundImage: `url(${pointLogo})` }}
                                                                initial={{ backgroundColor: "#FFFFFF" }}
                                                                whileHover={{ backgroundColor: "#E2FBD3", scale: 1.1 }}
                                                                onClick={() => null}
                                                            /*  ^^^^^^^^^^^ TODO FOR MAPS*/
                                                            />
                                                            
                                                            
                                                            
                                                        </div>
                                                    </div>
                                                    <div className="rounded-lg bg-white px-5 py-2 mt-3">
                                                        <p>Feedback</p>
                                                        <p>FEEDBACK FROM BACKEND</p>
                                                    </div>
                                                </motion.div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
        
                        </div>
                    </div>
        
                </div>
    )
}