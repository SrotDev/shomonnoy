import { Link } from "react-router-dom"
import { AnimatePresence, easeInOut, motion } from "framer-motion"
import '../css/authentication.css'
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import AuthorityWorkReqNormal from "../components/authorityWorkReqNormal";
import AuthorityWorkReqConflicted from "../components/authorityWorkReqConflict";
import AuthorityWorkReqPending from "../components/authorityWorkReqPending";
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import ConflictChart from "../components/conflictChart";


export default function AuthorityConflictChart() {
  return (
    <>
        <Navbar state="authority_logged_in" />
        <div className="flex flex-col items-center justified-center mt-50 overflow-x-auto">
            <ConflictChart/>
        </div> 
    </>
  );
}

function parseDate(dateStr) {
  return new Date(dateStr + " 2025");
}

