import { Link } from "react-router-dom"
import { AnimatePresence, easeInOut, motion } from "framer-motion"
import '../css/authentication.css'
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { Gantt, ViewMode } from "gantt-task-react";

import "gantt-task-react/dist/index.css";

const MyTaskListHeader = ({ headerHeight, rowWidth, fontFamily, fontSize }) => {
    return (
        <div className="text-center bg-white rounded-lg size-2rem py-2">
            <p style={{ fontSize: '1.4rem' }}>Stakeholder</p>
        </div>
    );
};

// Custom table: render one row per task, only the name
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





export default function ConflictChart() {
    const currentDate = new Date();

    const initialTasks = [
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
    ];

    const [tasks, setTasks] = useState(initialTasks);

    
    const handleTaskChange = (task) => {
        console.log("Date change for Id:", task.id);
        setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
    };

    const handleTaskDelete = (task) => {
        const conf = window.confirm("Are you sure you want to delete " + task.name + "?");
        if (conf) {
            setTasks(tasks.filter((t) => t.id !== task.id));
        }
        return conf;
    };

    const handleProgressChange = (task) => {
        // Keep for library requirements, but no actual progress logic
        setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
        console.log("Progress change (ignored) for Id:", task.id);
    };

    const handleDblClick = (task) => {
        alert("Double Click on task Id: " + task.id);
    };

    const handleClick = (task) => {
        console.log("Click on task Id:", task.id);
    };

    const handleSelect = (task, isSelected) => {
        console.log(task.name + " was " + (isSelected ? "selected" : "unselected"));
    };

    const handleExpanderClick = (task) => {
        // Not really needed (no parent/child tasks), but avoid errors
        console.log("Expander click on task Id:", task.id);
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
            onExpanderClick={handleExpanderClick}
            columnWidth={50}
            listCellWidth={350}
            TaskListHeader={MyTaskListHeader}
            TaskListTable={MyTaskListTable}
            
        />
    </div>
</div>
    );
};




