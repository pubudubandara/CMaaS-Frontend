import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicRoute from './components/auth/PublicRoute';
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import SchemaBuilder from './pages/Type/SchemaBuilder';
import ContentTypesList from './pages/Type/ContentTypesList';
import ContentTypeCreate from './pages/Type/ContentTypeCreate';
import ContentEntries from './pages/Entity/ContentEntries';
import ContentEntryCreate from './pages/Entity/ContentEntryCreate';
import DashboardHome from './pages/DashboardHome';
import Settings from './pages/Settings';
import ContentEntryEdit from './pages/Entity/ContentEntryEdit';
import ContentTypeEdit from './pages/Type/ContentTypeEdit';
import Documentation from './pages/Documentation';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page - accessible by everyone */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Auth Routes - redirect authenticated users to dashboard */}
        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />

        {/* Protected Dashboard Routes */}
        <Route path="/app" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardHome />} />
          <Route path="schema-builder" element={<SchemaBuilder />} />

          <Route path="content-types" element={<ContentTypesList />} />
          <Route path="content-types/create" element={<ContentTypeCreate />} />
          <Route path="content-types/edit/:id" element={<ContentTypeEdit />} />

          <Route path="content-manager/:contentTypeId" element={<ContentEntries />} />
          <Route path="content-manager/:contentTypeId/create" element={<ContentEntryCreate />} />
          <Route path="content-manager/:contentTypeId/edit/:entryId" element={<ContentEntryEdit/>} />

          <Route path="settings" element={<Settings/>}/>
          <Route path="documentation" element={<Documentation/>}/>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
