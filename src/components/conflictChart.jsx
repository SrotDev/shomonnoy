import { motion } from "framer-motion"
import { useState } from "react";
import { Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";

const MyTaskListHeader = () => {
    return (
        <div className="text-center bg-white rounded-lg size-2rem py-2">
            <p style={{ fontSize: '1.4rem' }}>Stakeholder</p>
        </div>
    );
};


const MyTaskListTable = ({
    rowHeight,
    rowWidth,
    fontFamily,
    fontSize,
    tasks,
    selectedTaskId,
    setSelectedTask,
}) => {
    return (
        <div style={{ width: rowWidth }}>
            {tasks.map((t) => (
                <div
                    key={t.id}
                    onClick={() => setSelectedTask(t.id)}
                    style={{
                        height: rowHeight,
                        lineHeight: `${rowHeight}px`,
                        padding: "0 8px",
                        fontFamily,
                        fontSize: "1.5rem",
                        background: t.id === selectedTaskId ? "rgba(0,0,0,0.05)" : "transparent",
                        borderBottom: "1px solid #f3f3f3",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}
                    title={t.name}
                >
                    {t.name}
                </div>
            ))}
        </div>
    );
};


const currentDate = new Date();

const initialTasks = [[
    {
        start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
        end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 2, 12, 28),
        name: "Idea",
        id: "Task 0",
        type: "task",
        progress: 100, // unused, but required by lib
        isDisabled: false,
        styles: { progressColor: '#FF0000FF', progressSelectedColor: '#FF0000FF' }
    },
    {
        start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 2),
        end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4),
        name: "Research",
        id: "Task 1",
        type: "task",
        progress: 0,
    },
    {
        start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4),
        end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
        name: "Discussion",
        id: "Task 2",
        type: "task",
        progress: 0,
    },
    {
        start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
        end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 9),
        name: "Developing",
        id: "Task 3",
        type: "task",
        progress: 0,
    },
    {
        start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
        end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 19),
        name: "Release",
        id: "Task 4",
        type: "task",
        progress: 0,
    },
], [
    {
        start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
        end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 2, 12, 28),
        name: "Idea",
        id: "Task 0",
        type: "task",
        progress: 100, // unused, but required by lib
        isDisabled: false,
        styles: { progressColor: '#FF0000FF', progressSelectedColor: '#FF0000FF' }
    },
    {
        start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 2),
        end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4),
        name: "Research",
        id: "Task 1",
        type: "task",
        progress: 0,
    },
    {
        start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4),
        end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
        name: "Discussion",
        id: "Task 2",
        type: "task",
        progress: 0,
    },
    {
        start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
        end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 9),
        name: "Developing",
        id: "Task 3",
        type: "task",
        progress: 0,
    },
    {
        start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
        end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 19),
        name: "Release",
        id: "Task 4",
        type: "task",
        progress: 0,
    },
], [
    {
        start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
        end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 2, 12, 28),
        name: "Idea",
        id: "Task 0",
        type: "task",
        progress: 100, // unused, but required by lib
        isDisabled: false,
        styles: { progressColor: '#FF0000FF', progressSelectedColor: '#FF0000FF' }
    },
    {
        start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 2),
        end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4),
        name: "Research",
        id: "Task 1",
        type: "task",
        progress: 0,
    },
    {
        start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4),
        end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
        name: "Discussion",
        id: "Task 2",
        type: "task",
        progress: 0,
    },
    {
        start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
        end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 9),
        name: "Developing",
        id: "Task 3",
        type: "task",
        progress: 0,
    },
    {
        start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
        end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 19),
        name: "Release",
        id: "Task 4",
        type: "task",
        progress: 0,
    },
]];


export default function ConflictChartWithButtons() {
    return (
        <>
            {initialTasks.map((taskGroup, idx) => {
                console.log(idx)
                return (
                    <>
                    
                    <ConflictGroup key={idx} tasks={taskGroup} idx={idx} />
                    </>
                    
                )

            })}
        </>
    );
}

function ConflictGroup({ tasks, idx }) {
    const [tk, setTk] = useState(tasks);

    return (
        <>
            <div className="flex flex-row justify-center mb-5 bg-green-600 w-full">
                <p style={{ fontSize: "3rem", color: "white" }}>কনফ্লিক্ট {idx + 1}</p>
            </div>

            <div className="flex flex-row justify-center items-center gap-20 mb-5">
                <motion.div
                    className="bg-[rgb(114,198,158)] rounded-3xl px-8 py-2 text-center shadow-[4px_2px_10px_2px_rgba(0,0,0,0.12)] backdrop-blur-md font-bold"
                    whileHover={{
                        scale: 1.1,
                        backgroundColor: "rgba(70,200,70,1)",
                        color: "rgba(241,255,238,1)"
                    }}
                    animate={{
                        backgroundColor: "#72C69E",
                        color: "#F1FFEE"
                    }}
                    onClick={() => null}
                >
                    <p>স্বয়ংক্রিয় সমাধান</p>
                </motion.div>

                <motion.div
                    className="bg-[rgb(114,198,158)] rounded-3xl px-8 py-2 text-center shadow-[4px_2px_10px_2px_rgba(0,0,0,0.12)] backdrop-blur-md font-bold"
                    whileHover={{
                        scale: 1.1,
                        backgroundColor: "rgba(70,200,70,1)",
                        color: "rgba(241,255,238,1)"
                    }}
                    animate={{
                        backgroundColor: "#72C69E",
                        color: "#F1FFEE"
                    }}
                    onClick={() => null}
                >
                    <p>ম্যাপে দেখুন</p>
                </motion.div>

                <motion.div
                    className="rounded-3xl px-8 py-2 text-center shadow-[4px_2px_10px_2px_rgba(0,0,0,0.12)] backdrop-blur-md font-bold"
                    style={{
                        backgroundColor: hasDayOverlap(tk)
                            ? "rgba(100,100,100,1)"
                            : "rgba(70,200,70,1)"
                    }}
                    whileHover={{
                        scale: hasDayOverlap(tk) ? 1 : 1.1,
                        backgroundColor: hasDayOverlap(tk)
                            ? "rgba(100,100,100,1)"
                            : "rgba(70,200,70,1)",
                        color: "rgba(241,255,238,1)"
                    }}
                    onClick={() => {
                        if (!hasDayOverlap(tk)) {
                            console.log("Sending solution...");
                        }
                    }}
                >
                    <p>সমাধান প্রেরণ</p>
                </motion.div>
            </div>

            <ConflictChart initialTasks={tk} onTasksChange={setTk} />
            <div className="mt-20"></div>
        </>
    );
}

function ConflictChart({ initialTasks, onTasksChange }) {
    const [tasks, setTasks] = useState(initialTasks);

    const handleTaskChange = (task) => {
        const newTasks = tasks.map((t) => (t.id === task.id ? task : t));
        setTasks(newTasks);
        onTasksChange?.(newTasks);
    };

    return (
        <div style={{ width: "100%", overflowX: "auto" }}>
            <div style={{ minWidth: "1200px" }}>
                <Gantt
                    tasks={tasks}
                    viewMode={ViewMode.Day}
                    onDateChange={handleTaskChange}
                    columnWidth={50}
                    listCellWidth={350}
                    TaskListHeader={MyTaskListHeader}
                    TaskListTable={MyTaskListTable}
                />
            </div>
        </div>
    );
}

// --- Helper function from earlier ---
function hasDayOverlap(tasks) {
    function normalizeDate(date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }

    const ranges = tasks.map((task) => ({
        start: normalizeDate(task.start),
        end: normalizeDate(task.end)
    }));

    ranges.sort((a, b) => a.start - b.start);

    for (let i = 1; i < ranges.length; i++) {
        if (ranges[i].start <= ranges[i - 1].end) {
            return true;
        }
    }
    return false;
}




