import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Authentication from './pages/authentication.jsx'
import AuthorityDashboard from './pages/authorityDashboard.jsx'
import AuthorityWorkRequests from './pages/authorityWorkRequests.jsx'
import AuthorityConflictChart from './pages/authorityConflictChart.jsx'
import StakeholderDashboard from './pages/stakeholderDashboard.jsx'
import ReportProblem from './pages/ReportProblem.jsx'
import StakeholderWorkReq from './pages/stakeholderWorkReq.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <StakeholderWorkReq />
    </BrowserRouter>
  </StrictMode>,
)
