import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import Register from './pages/Register';
import Login from './pages/Login'; 
import SchemaBuilder from './pages/SchemaBuilder';
import ContentManager from './pages/ContentManager'; 
import DashboardHome from './pages/DashboardHome';   
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Dashboard Routes */}
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardHome />} />
          <Route path="schema-builder" element={<SchemaBuilder />} />
          <Route path="content-manager" element={<ContentManager />} />
          <Route path="settings" element={<Settings/>}/>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
