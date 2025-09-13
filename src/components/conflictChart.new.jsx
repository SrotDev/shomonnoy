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

function ConflictChart({ tasks, onTasksChange }) {
    const handleTaskChange = (task) => {
        const newTasks = tasks.map((t) => (t.id === task.id ? task : t));
        onTasksChange?.(newTasks);
    };

    const handleProgressChange = (task) => {
        const newTasks = tasks.map((t) => (t.id === task.id ? task : t));
        onTasksChange?.(newTasks);
    };

    const handleDblClick = (task) => {
        console.log("Double click on task:", task.id);
    };

    const handleClick = (task) => {
        console.log("Click on task:", task.id);
    };

    const handleSelect = (task, isSelected) => {
        console.log(task.name + " was " + (isSelected ? "selected" : "unselected"));
    };

    return (
        <div style={{ width: "100%", overflowX: "auto" }}>
            <div style={{ minWidth: "1200px" }}>
                <Gantt
                    tasks={tasks}
                    viewMode={ViewMode.Day}
                    onDateChange={handleTaskChange}
                    onProgressChange={handleProgressChange}
                    onDoubleClick={handleDblClick}
                    onClick={handleClick}
                    onSelect={handleSelect}
                    columnWidth={50}
                    listCellWidth={350}
                    TaskListHeader={MyTaskListHeader}
                    TaskListTable={MyTaskListTable}
                />
            </div>
        </div>
    );
}

function hasDayOverlap(tasks) {
    if (!tasks || tasks.length === 0) return false;

    function normalizeDate(date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }

    const ranges = tasks.map(task => ({
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

export default function ConflictChartWithButtons() {
    const [taskGroups, setTaskGroups] = useState(() => {
        const currentDate = new Date();
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();
        
        return [
            [
                {
                    start: new Date(year, month, 1),
                    end: new Date(year, month, 5),
                    name: "WASA Work",
                    id: "Task 0",
                    type: "task",
                    progress: 45,
                    isDisabled: true,
                    styles: { progressColor: '#72C69E', progressSelectedColor: '#72C69E' }
                },
                {
                    start: new Date(year, month, 3),
                    end: new Date(year, month, 8),
                    name: "Road Work",
                    id: "Task 1",
                    type: "task",
                    progress: 25,
                    isDisabled: true,
                    styles: { progressColor: '#72C69E', progressSelectedColor: '#72C69E' }
                }
            ],
            [
                {
                    start: new Date(year, month, 10),
                    end: new Date(year, month, 15),
                    name: "Electricity Work",
                    id: "Task 0",
                    type: "task",
                    progress: 60,
                    isDisabled: true,
                    styles: { progressColor: '#72C69E', progressSelectedColor: '#72C69E' }
                },
                {
                    start: new Date(year, month, 12),
                    end: new Date(year, month, 18),
                    name: "Gas Line Work",
                    id: "Task 1",
                    type: "task",
                    progress: 30,
                    isDisabled: true,
                    styles: { progressColor: '#72C69E', progressSelectedColor: '#72C69E' }
                }
            ]
        ];
    });

    const handleTasksChange = (groupIndex, newTasks) => {
        setTaskGroups(prev => {
            const newGroups = [...prev];
            newGroups[groupIndex] = newTasks;
            return newGroups;
        });
    };

    const handleAutoResolve = (groupIndex) => {
        // Implement auto-resolve logic here
        console.log("Auto resolving conflict", groupIndex);
    };

    const handleViewMap = (groupIndex) => {
        // Implement map view logic here
        console.log("Viewing map for conflict", groupIndex);
    };

    const handleSendSolution = (groupIndex) => {
        if (!hasDayOverlap(taskGroups[groupIndex])) {
            // Implement solution sending logic here
            console.log("Sending solution for conflict", groupIndex);
        }
    };

    return (
        <div className="space-y-8">
            {taskGroups.map((tasks, idx) => (
                <div key={idx} className="space-y-5">
                    <div className="flex flex-row justify-center bg-green-600 w-full">
                        <p className="text-3xl text-white py-2">কনফ্লিক্ট {idx + 1}</p>
                    </div>
                    
                    <div className="flex flex-row justify-center items-center gap-5">
                        <motion.button
                            className="bg-[rgb(114,198,158)] rounded-3xl px-8 py-2 text-center shadow-md font-bold"
                            whileHover={{
                                scale: 1.1,
                                backgroundColor: "rgba(70,200,70,1)",
                                color: "rgba(241,255,238,1)"
                            }}
                            onClick={() => handleAutoResolve(idx)}
                        >
                            স্বয়ংক্রিয় সমাধান
                        </motion.button>

                        <motion.button
                            className="bg-[rgb(114,198,158)] rounded-3xl px-8 py-2 text-center shadow-md font-bold"
                            whileHover={{
                                scale: 1.1,
                                backgroundColor: "rgba(70,200,70,1)",
                                color: "rgba(241,255,238,1)"
                            }}
                            onClick={() => handleViewMap(idx)}
                        >
                            ম্যাপে দেখুন
                        </motion.button>

                        <motion.button
                            className="rounded-3xl px-8 py-2 text-center shadow-md font-bold"
                            style={{
                                backgroundColor: hasDayOverlap(tasks) ? "rgba(100,100,100,1)" : "rgba(70,200,70,1)",
                                color: "white"
                            }}
                            whileHover={{
                                scale: hasDayOverlap(tasks) ? 1 : 1.1
                            }}
                            onClick={() => handleSendSolution(idx)}
                            disabled={hasDayOverlap(tasks)}
                        >
                            সমাধান প্রেরণ
                        </motion.button>
                    </div>

                    <ConflictChart 
                        tasks={tasks} 
                        onTasksChange={(newTasks) => handleTasksChange(idx, newTasks)} 
                    />
                </div>
            ))}
        </div>
    );
}
