
import { motion } from "framer-motion";
import { useState } from "react";
import { Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";



const MyTaskListHeader = () => (
    <div className="task-list-header" style={{ height: '50px' }}>
        <p>Stakeholder</p>
    </div>
);

const MyTaskListTable = ({ tasks, rowHeight, setSelectedTask, selectedTaskId }) => (
    <div>
    
        {tasks.map((task) => (
            <div
                className={`task-list-row ${task.id === selectedTaskId ? 'selected' : ''}`}
                style={{ height: rowHeight }}
                key={task.id}
                onClick={() => setSelectedTask(task.id)}
            >
                <p>{task.name}</p>
            </div>
        ))}
    </div>
);



const colorPalette = [
    { bg: '#FEF3C7', border: '#FBBF24' }, { bg: '#E9D5FF', border: '#A855F7' },
    { bg: '#FBCFE8', border: '#EC4899' }, { bg: '#D1FAE5', border: '#10B981' },
    { bg: '#CFFAFE', border: '#06B6D4' },
];

const assignColorsToTasks = (taskGroup) => {
    return taskGroup.map((task, index) => ({
        ...task,
        styles: {
            progressColor: colorPalette[index % colorPalette.length].bg,
            progressSelectedColor: colorPalette[index % colorPalette.length].bg,
            barColor: colorPalette[index % colorPalette.length].border,
        },
    }));
};

const currentDate = new Date();
const y = currentDate.getFullYear();
const m = currentDate.getMonth();


const rawTasks = [
  
    [
        { id: 'WASA-01', name: 'WASA', start: new Date(y, m, 3), end: new Date(y, m, 7), description: 'Pipeline Repair' },
        { id: 'RHD-01', name: 'RHD', start: new Date(y, m, 5), end: new Date(y, m, 9), description: 'Road Paving' }
    ],
  
    [
        { id: 'BTCL-01', name: 'BTCL', start: new Date(y, m, 10), end: new Date(y, m, 14), description: 'Fiber Cable Laying' },
        { id: 'DESCO-01', name: 'DESCO', start: new Date(y, m, 12), end: new Date(y, m, 16), description: 'Substation Upgrade' },
        { id: 'Titas-01', name: 'Titas Gas', start: new Date(y, m, 11), end: new Date(y, m, 13), description: 'Gas Line Connection' }
    ],
   
    [
        { id: 'DPDC-01', name: 'DPDC', start: new Date(y, m, 20), end: new Date(y, m, 22), description: 'Transformer Install' },
        { id: 'CityCorp-01', name: 'City Corp', start: new Date(y, m, 24), end: new Date(y, m, 26), description: 'Drainage Cleanup' }
    ]
];

const initialTasks = rawTasks.map(assignColorsToTasks);



export default function ConflictChartWithButtons() {
    return (
        <>
            {initialTasks.map((taskGroup, idx) => (
                <ConflictGroup key={idx} tasks={taskGroup} idx={idx} />
            ))}
        </>
    );
}

function ConflictGroup({ tasks, idx }) {
    const [tk, setTk] = useState(tasks);
    const isOverlapping = hasDayOverlap(tk);

    return (
        <div className="conflict-chart-container">
            <header className="conflict-header">
                <h2 className="conflict-title">কনফ্লিক্ট {idx + 1}</h2>
                <div className="conflict-actions">
                    <button className="action-button primary">স্বয়ংক্রিয় সমাধান</button>
                    <button className="action-button primary">ম্যাপে দেখুন</button>
                    <button
                        className={`action-button submit ${isOverlapping ? 'disabled' : ''}`}
                        disabled={isOverlapping}
                        onClick={() => !isOverlapping && console.log("Sending solution...")}
                    >
                        সমাধান প্রেরণ
                    </button>
                </div>
            </header>
            <ConflictChart initialTasks={tk} onTasksChange={setTk} />
        </div>
    );
}

function ConflictChart({ initialTasks, onTasksChange }) {
    const [tasks, setTasks] = useState(initialTasks);

    const handleTaskChange = (task) => {
        const newTasks = tasks.map((t) => (t.id === task.id ? task : t));
        setTasks(newTasks);
        onTasksChange?.(newTasks);
    };

    const BarWithAccent = ({ task }) => (
        <div
            className="gantt-task-bar"
            style={{ borderColor: task.styles.barColor, backgroundColor: task.styles.progressColor }}
            title={`${task.name}: ${task.description}`}
        >
            <div style={{ marginLeft: '10px' }}>{task.description}</div>
        </div>
    );

    return (
        <Gantt
            tasks={tasks}
            viewMode={ViewMode.Day}
            onDateChange={handleTaskChange}
            columnWidth={65}
            listCellWidth="250px"
            rowHeight={60}
            ganttHeight={300} 
            TaskListHeader={MyTaskListHeader}
            TaskListTable={MyTaskListTable}
            barFill={70}
            barCornerRadius={8}
            BarComponent={BarWithAccent}
            gridProps={{ columnWidth: 65, rowHeight: 60, todayColor: 'rgba(182, 34, 34, 0.1)' }}
            headerProps={{ className: 'gantt-timeline-header' }}
        />
    );
}

function hasDayOverlap(tasks) {
    if (tasks.length <= 1) return false;
    function normalizeDate(date) { return new Date(date.getFullYear(), date.getMonth(), date.getDate()); }
    const ranges = tasks.map((task) => ({ start: normalizeDate(task.start), end: normalizeDate(task.end) }));
    ranges.sort((a, b) => a.start - b.start);
    for (let i = 1; i < ranges.length; i++) {
        if (ranges[i].start <= ranges[i - 1].end) return true;
    }
    return false;
}