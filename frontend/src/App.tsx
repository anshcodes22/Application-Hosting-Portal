import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { DeveloperDashboard } from './pages/DeveloperDashboard';
import { ReviewerDashboard } from './pages/ReviewerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import {HODDashboard} from './pages/HODDashboard';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/developer" element={<DeveloperDashboard />} />
          <Route path="/reviewer" element={<ReviewerDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/hod" element={<HODDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;