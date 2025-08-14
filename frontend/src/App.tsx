import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { DeveloperDashboard } from './pages/DeveloperDashboard';
import { ReviewerDashboard } from './pages/ReviewerDashboard';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/developer" element={<DeveloperDashboard />} />
          <Route path="/reviewer" element={<ReviewerDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;