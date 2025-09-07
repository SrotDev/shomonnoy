// src/components/conflictChart.js
import React, { useState } from "react";
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
        { id: 'WASA-01', name: 'WASA', start: new Date(y, m, 3), end: new Date(y, m, 7), description: 'Pipeline Repair in Gulshan', geometry: { "type": "LineString", "coordinates": [[90.410, 23.790], [90.415, 23.795]] } },
        { id: 'RHD-01', name: 'RHD', start: new Date(y, m, 5), end: new Date(y, m, 9), description: 'Road Paving near Banani', geometry: { "type": "LineString", "coordinates": [[90.405, 23.800], [90.410, 23.805]] } }
    ],
    [
        { id: 'BTCL-01', name: 'BTCL', start: new Date(y, m, 10), end: new Date(y, m, 14), description: 'Fiber Cable Laying in Dhanmondi', geometry: { "type": "LineString", "coordinates": [[90.370, 23.740], [90.375, 23.745]] } },
        { id: 'DESCO-01', name: 'DESCO', start: new Date(y, m, 12), end: new Date(y, m, 16), description: 'Substation Upgrade in Mohammadpur', geometry: { "type": "LineString", "coordinates": [[90.360, 23.765], [90.365, 23.770]] } },
        { id: 'Titas-01', name: 'Titas Gas', start: new Date(y, m, 11), end: new Date(y, m, 13), description: 'Gas Line Connection in Mirpur', geometry: { "type": "LineString", "coordinates": [[90.365, 23.805], [90.370, 23.810]] } }
    ],
    [
        { id: 'DPDC-01', name: 'DPDC', start: new Date(y, m, 20), end: new Date(y, m, 22), description: 'Transformer Install in Motijheel', geometry: { "type": "LineString", "coordinates": [[90.415, 23.725], [90.420, 23.730]] } },
        { id: 'CityCorp-01', name: 'City Corp', start: new Date(y, m, 24), end: new Date(y, m, 26), description: 'Drainage Cleanup in Uttara', geometry: { "type": "LineString", "coordinates": [[90.400, 23.870], [90.405, 23.875]] } }
    ]
];

const initialTasks = rawTasks.map(assignColorsToTasks);


export default function ConflictChartWithButtons({ onMapClick }) {
    return (
        <>
            {initialTasks.map((taskGroup, idx) => (
                <ConflictGroup key={idx} tasks={taskGroup} idx={idx} onMapClick={onMapClick} />
            ))}
        </>
    );
}


function ConflictGroup({ tasks, idx, onMapClick }) {
    const [tk, setTk] = useState(tasks);
    const isOverlapping = hasDayOverlap(tk);

    return (
        <div className="conflict-chart-container">
            <header className="conflict-header">
                <h2 className="conflict-title">কনফ্লিক্ট {idx + 1}</h2>
                <div className="conflict-actions">
                    <button className="action-button primary">স্বয়ংক্রিয় সমাধান</button>
                   
                    <button className="action-button primary" onClick={() => onMapClick(tasks)}>
                        ম্যাপে দেখুন
                    </button>
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
    const handleTaskChange = (task) => { const newTasks = tasks.map((t) => (t.id === task.id ? task : t)); setTasks(newTasks); onTasksChange?.(newTasks); };
    const BarWithAccent = ({ task }) => ( <div className="gantt-task-bar" style={{ borderColor: task.styles.barColor, backgroundColor: task.styles.progressColor }} title={`${task.name}: ${task.description}`}><div style={{ marginLeft: '10px' }}>{task.description}</div></div> );
    return ( <Gantt tasks={tasks.map(t => ({...t, type: 'task', progress: 0 }))} viewMode={ViewMode.Day} onDateChange={handleTaskChange} columnWidth={65} listCellWidth="250px" rowHeight={60} ganttHeight={300} TaskListHeader={MyTaskListHeader} TaskListTable={MyTaskListTable} barFill={70} barCornerRadius={8} BarComponent={BarWithAccent} gridProps={{ columnWidth: 65, rowHeight: 60, todayColor: 'rgba(66, 153, 225, 0.1)' }} headerProps={{ className: 'gantt-timeline-header' }} /> );
}

function hasDayOverlap(tasks) {
    if (tasks.length <= 1) return false;
    const normalizeDate = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const ranges = tasks.map((task) => ({ start: normalizeDate(task.start), end: normalizeDate(task.end) }));
    ranges.sort((a, b) => a.start - b.start);
    for (let i = 1; i < ranges.length; i++) { if (ranges[i].start <= ranges[i - 1].end) return true; }
    return false;
}