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
import StakeholderPlannedTask from './components/stakeholderPlannedTask.jsx'
import StakeholderProgressTask from './components/stakeholderProgressTask.jsx'
import StakeholderProposedTask from './components/stakeholderProposedTask.jsx'
import StakeholderWaitingTask from './components/stakeholderWaitingTask.jsx'
import RequestWorkPage from './pages/RequestWorkPage.jsx'
import LandingPage from './pages/LandingPage.jsx'
import StakeholderNewReq from './pages/stakeholderNewReq.jsx'
import PreLoader2 from './pages/LoadingPage.jsx'
import Page404 from './pages/404Page.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename="/shomonnoy">
      <App/>
    </BrowserRouter>
  </StrictMode>,
)
