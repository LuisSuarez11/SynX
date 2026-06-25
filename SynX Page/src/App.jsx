import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';

// Rutas Protegidas y Layouts
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import MembersPage from './pages/admin/MembersPage';
import StaffPage from './pages/admin/StaffPage';
import BranchesPage from './pages/admin/BranchesPage';
import SubscriptionsPage from './pages/admin/SubscriptionsPage';
import MembershipsPage from './pages/admin/MembershipsPage';
import AttendancePage from './pages/admin/AttendancePage';
import AdminClassesPage from './pages/admin/ClassesPage';
import MemberLayout from './layouts/MemberLayout';
import MemberDashboard from './pages/member/MemberDashboard';
import MemberProfile from './pages/member/MemberProfile';
import MemberClassesPage from './pages/member/ClassesPage';

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Rutas Protegidas (Dueños y Managers) */}
        <Route element={<ProtectedRoute allowedRoles={['owner', 'manager']} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard"    element={<AdminDashboard />} />
            <Route path="members"      element={<MembersPage />} />
            <Route path="staff"        element={<StaffPage />} />
            <Route path="branches"     element={<BranchesPage />} />
            <Route path="subscriptions" element={<SubscriptionsPage />} />
            <Route path="memberships"  element={<MembershipsPage />} />
            <Route path="attendance"   element={<AttendancePage />} />
            <Route path="classes"      element={<AdminClassesPage />} />
            <Route path="settings"     element={<div className="text-white p-10 text-center">Configuración (Próximamente)</div>} />
          </Route>
        </Route>

        {/* Rutas Protegidas (Miembros / Clientes) */}
        <Route element={<ProtectedRoute allowedRoles={['member']} />}>
          <Route path="/member" element={<MemberLayout />}>
            <Route index element={<Navigate to="home" replace />} />
            <Route path="home"    element={<MemberDashboard />} />
            <Route path="profile" element={<MemberProfile />} />
            <Route path="classes" element={<MemberClassesPage />} />
          </Route>
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
