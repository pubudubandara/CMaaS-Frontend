import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
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
