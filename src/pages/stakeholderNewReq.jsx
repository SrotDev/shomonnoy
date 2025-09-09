import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, X, Send } from "lucide-react";
import Navbar from "../components/Navbar";




function EditableTaskCard({task}) {
    const [title, setTitle] = useState(task.id);
    const [taskId, setTaskId] = useState("20102");
    const [startDate, setStartDate] = useState("2025-15-2");
    const [endDate, setEndDate] = useState("2025-1-13");
    const [emergency, setEmergency] = useState(task.isEmergency);
    const [description, setDescription] = useState("asdfiubyasldfikjnlasdf");

    return (
        <div className="p-4 bg-white rounded-xl shadow-md w-[calc(90vw)]">
            {/* Header Row */}
            <div className="flex items-center justify-around">
                <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-purple-600 rounded-sm"></span>
                    <input
                        className="font-bold text-lg border-b border-transparent focus:border-gray-400 outline-none"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <span>#</span>
                    <input
                        className="w-20 border-b border-transparent focus:border-gray-400 outline-none"
                        value={taskId}
                        onChange={(e) => setTaskId(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-4">
                    {/* Date Picker */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={16} />
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="border-b border-transparent focus:border-gray-400 outline-none"
                        />
                        <span>-</span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="border-b border-transparent focus:border-gray-400 outline-none"
                        />
                    </div>

                    {/* Emergency Toggle */}
                    <div
                        className={`flex items-center px-2 py-1 rounded-full cursor-pointer ${emergency ? "bg-green-100" : "bg-gray-200"
                            }`}
                        onClick={() => setEmergency((prev) => !prev)}
                    >
                        <span
                            className={`text-sm font-semibold ${emergency ? "text-green-700" : "text-gray-500"
                                }`}
                        >
                            Emergency
                        </span>
                        <motion.div
                            className={`ml-2 w-6 h-3 rounded-full ${emergency ? "bg-green-600" : "bg-gray-400"
                                } relative`}
                        >
                            <motion.div
                                layout
                                className="absolute top-[-3px] w-5 h-5 bg-white rounded-full shadow"
                                animate={{ x: emergency ? 12 : 0 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            />
                        </motion.div>
                    </div>

                    <MapPin size={18} className="text-green-500 cursor-pointer" />
                    <X size={18} className="text-red-500 cursor-pointer" />
                    <Send size={18} className="text-green-500 cursor-pointer" />
                </div>
            </div>

            {/* Details */}
            <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-semibold mb-1">Details:</p>
                <textarea
                    className="w-full bg-transparent outline-none resize-none text-gray-700"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
        </div>
    );
}

export default function StakeholderNewReq() {
    return (
        <>
            <Navbar state="stakeholder_logged_in" />
            <div className="flex flex-row mx-5 h-[calc(63vh)] mt-40 justify-center items-center">
                <div className="flex flex-col justify-center items-center">
                    <div className="grow bg-[rgb(248,250,252)] p-5 rounded-4xl">
                        <div className="flex flex-col">
                            <div className="flex flex-row justify-start items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                                <p className="" style={{ fontSize: "1.8rem" }}>
                                    &nbsp; In Progress &nbsp;
                                    <span className="font-bold" style={{ color: "grey" }}>({tasks.length})</span>
                                </p>
                            </div>
                            <div className="flex flex-col mt-4 max-h-[calc(60vh)] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-white scrollable-container overflow-y-scroll "> {/*Scrollable div*/}
                                {
                                    tasks.map((task, idx)=>{
                                        return(
                                            <EditableTaskCard task={task}/>

                                        )
                                    })
                                }
                                
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </>
    )
}
