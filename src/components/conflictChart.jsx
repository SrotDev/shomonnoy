// src/components/conflictChart.js
import React, { useEffect, useState } from "react";
import { Gantt, ViewMode } from "gantt-task-react";
import { Link, useNavigate } from "react-router-dom"
import "gantt-task-react/dist/index.css";
import ClipLoader from "react-spinners/ClipLoader";
import { details } from "framer-motion/client";
const baseUrl = import.meta.env.VITE_BASE_URL;

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


// const rawTasks = [
//     [
//         { id: 'WASA-01', name: 'WASA', start: new Date(y, m, 3), end: new Date(y, m, 7), description: 'Pipeline Repair in Gulshan', geometry: { "type": "LineString", "coordinates": [[90.410, 23.790], [90.415, 23.795]] } },
//         { id: 'RHD-01', name: 'RHD', start: new Date(y, m, 5), end: new Date(y, m, 9), description: 'Road Paving near Banani', geometry: { "type": "LineString", "coordinates": [[90.405, 23.800], [90.410, 23.805]] } }
//     ],
//     [
//         { id: 'BTCL-01', name: 'BTCL', start: new Date(y, m, 10), end: new Date(y, m, 14), description: 'Fiber Cable Laying in Dhanmondi', geometry: { "type": "LineString", "coordinates": [[90.370, 23.740], [90.375, 23.745]] } },
//         { id: 'DESCO-01', name: 'DESCO', start: new Date(y, m, 12), end: new Date(y, m, 16), description: 'Substation Upgrade in Mohammadpur', geometry: { "type": "LineString", "coordinates": [[90.360, 23.765], [90.365, 23.770]] } },
//         { id: 'Titas-01', name: 'Titas Gas', start: new Date(y, m, 11), end: new Date(y, m, 13), description: 'Gas Line Connection in Mirpur', geometry: { "type": "LineString", "coordinates": [[90.365, 23.805], [90.370, 23.810]] } }
//     ],
//     [
//         { id: 'DPDC-01', name: 'DPDC', start: new Date(y, m, 20), end: new Date(y, m, 22), description: 'Transformer Install in Motijheel', geometry: { "type": "LineString", "coordinates": [[90.415, 23.725], [90.420, 23.730]] } },
//         { id: 'CityCorp-01', name: 'City Corp', start: new Date(y, m, 24), end: new Date(y, m, 26), description: 'Drainage Cleanup in Uttara', geometry: { "type": "LineString", "coordinates": [[90.400, 23.870], [90.405, 23.875]] } }
//     ]
// ];



// Helper to parse ISO date string into JS Date
function parseDate(dateStr) {
    return dateStr ? new Date(dateStr) : null;
}






export default function ConflictChartWithButtons({ onMapClick }) {

    const [loading, setLoading] = useState(true)
    const [tasks, setTasks] = useState(undefined)

    const navigate = useNavigate()
    function transformToRawTasks(backendData) {

        const conflictGroups = backendData;

        // Step 2: Transform each group into tasks
        const rawTasks = [];
        for (const group of conflictGroups) {
            const transformedGroup = [];
            for (const task of group) {
                if (
                    task.status == "Declined"
                ) {
                    continue;
                }

                transformedGroup.push({
                    // Gantt-required fields
                    id: task.uuid,
                    name: task.name + (task.status === "Planned" ? " (Authorized)" : ""),
                    start: parseDate(task.proposed_start_date),
                    end: parseDate(task.proposed_end_date),
                    description: task.details,
                    progress: (task.status === "Planned" ? 100 : 0),
                    isDisabled: (task.status === "Planned" ? true : false),
                    hasChanged: false,


                    // Preserve extra info so nothing is lost
                    uuid: task.uuid,
                    budget: task.budget,
                    conflicts: task.conflicts,
                    created_at: task.created_at,
                    end_date: task.end_date,
                    estimated_time: task.estimated_time,
                    location: task.location,
                    stakeholder: task.stakeholder,
                    start_date: task.start_date,
                    status: task.status,
                    tag: task.tag, 
                    updated_at: task.updated_at,
                });
            }
            rawTasks.push(transformedGroup);
        }
        console.log(rawTasks)
        return rawTasks;
    }








    async function getTasks() {
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken) return null;

        const response = await fetch(`${baseUrl}/conflicts/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            console.log("Access token invalid, redirecting to login");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("access_token");
            navigate("/authenticate");
            return null;
        } else {
            const task = await response.json();
            return task;
        }
    }

    useEffect(() => {
        async function fetchAndSetTasks() {
            const allTasks = await getTasks();
            console.log(allTasks)


            if (allTasks) {
                console.log("aa")
                setTasks(transformToRawTasks(allTasks))

                setLoading(false)
            }
        }

        fetchAndSetTasks();
    }, [loading]);

    useEffect(() => {
        console.log("Tasks updated:", tasks);
    }, [tasks]);


    if (loading) {

        return (
            <div
                className=""
                style={{ textAlign: "center", marginTop: "100px" }}
            >
                <ClipLoader color="#27d887" loading={true} size={50} />
            </div>
        );
    }

    const initialTasks = tasks.map(assignColorsToTasks);

    return (
        <>
            {initialTasks.map((taskGroup, idx) => (
                <ConflictGroup key={idx} tasks={taskGroup} idx={idx} onMapClick={onMapClick} />
            ))}
        </>
    );
}


function ConflictGroup({ tasks, idx, onMapClick }) {

    async function accept(item) {
        console.log(item)
        const accessToken = localStorage.getItem("access_token");
        const response = await fetch(`${baseUrl}/works/${item.uuid}/`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                status: "Planned"
            }),
        })



        const resp = await response.json()

        if (!response.ok) {
            console.log("error")
        } else {


        }

    }

    async function decline(item) {
        console.log(item)
        const accessToken = localStorage.getItem("access_token");
        const response = await fetch(`${baseUrl}/works/${item.uuid}/`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                status: "Declined"
            }),
        })



        const resp = await response.json()

        if (!response.ok) {
            console.log("error")
        } else {

        }

    }



    async function sendSolve(solvetk) {
        const accessToken = localStorage.getItem("access_token");
        for (const task of solvetk) {
            if (task.hasChanged) {
                const finalTask = {
                    name: task.name,
                    details: task.description,
                    budget: task.budget,
                    proposed_end_date: task.end instanceof Date ? task.end.toISOString().split("T")[0] : task.end,
                    estimated_time: task.estimated_time,
                    location: task.location,
                    stakeholder: task.stakeholder,
                    proposed_start_date: task.start instanceof Date ? task.start.toISOString().split("T")[0] : task.start,
                    status: "ProposedByAdmin",
                    tag: task.tag,
                    start_date: null,
                    end_date: null,
                };


                console.log(finalTask);


                await decline(task);

                const resp = await fetch(`${baseUrl}/works/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    },
                    body: JSON.stringify(finalTask),
                });

                const res = await resp.json();
                console.log("Response:", res);
            } else {
                if(task.status !== "Planned"){
                    await accept(task)
                }
            }
        }

        alert("Done :D")
    }
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
                        onClick={() => {
                            if (!isOverlapping) {
                                console.log(tk)
                                sendSolve(tk)
                            }
                        }}
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

        if (task.status === "Planned") {

            return;
        }

        const newTasks = tasks.map((t) => (t.id === task.id ? task : t));
        task.hasChanged = true;
        setTasks(newTasks);
        onTasksChange?.(newTasks);
        console.log(task)
    };


    const BarWithAccent = ({ task }) => (<div className="gantt-task-bar" style={{ borderColor: task.styles.barColor, backgroundColor: task.styles.progressColor }} title={`${task.name}: ${task.description}`}><div style={{ marginLeft: '10px' }}>{task.description}</div></div>);
    return (<Gantt tasks={tasks.map(t => ({ ...t, type: 'task', styles: { progressColor: "#4EC31CFF", barColor: "#7CA36BFF" } }))} viewMode={ViewMode.Day} onDateChange={handleTaskChange} columnWidth={65} listCellWidth="250px" rowHeight={60} ganttHeight={300} TaskListHeader={MyTaskListHeader} TaskListTable={MyTaskListTable} barFill={70} barCornerRadius={8} BarComponent={BarWithAccent} gridProps={{ columnWidth: 65, rowHeight: 60, todayColor: 'rgba(66, 153, 225, 0.1)' }} headerProps={{ className: 'gantt-timeline-header' }} />);
}

function hasDayOverlap(tasks) {
    if (tasks.length <= 1) return false;
    const normalizeDate = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const ranges = tasks.map((task) => ({ start: normalizeDate(task.start), end: normalizeDate(task.end) }));
    ranges.sort((a, b) => a.start - b.start);
    for (let i = 1; i < ranges.length; i++) { if (ranges[i].start <= ranges[i - 1].end) return true; }
    return false;
}