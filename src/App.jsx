import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { getHomePath } from './lib/roles';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import RoleRoute from './components/layout/RoleRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ComingSoon from './pages/placeholders/ComingSoon';
import FlatsPage from './pages/members/FlatsPage';
import OwnersPage from './pages/members/OwnersPage';
import OccupantsPage from './pages/members/OccupantsPage';
import FamilyMembersPage from './pages/members/FamilyMembersPage';
import TenantsPage from './pages/members/TenantsPage';
import VehiclesPage from './pages/members/VehiclesPage';
import DocumentsPage from './pages/members/DocumentsPage';
import NotesPage from './pages/members/NotesPage';
import TagsPage from './pages/members/TagsPage';
import RemindersPage from './pages/members/RemindersPage';
import ImportExportPage from './pages/members/ImportExportPage';
import Flat360Page from './pages/members/Flat360Page';
import ParkingDashboard from './pages/parking/ParkingDashboard';
import SlotsPage from './pages/parking/SlotsPage';
import AllocationsPage from './pages/parking/AllocationsPage';
import GatePage from './pages/parking/GatePage';
import EntryLogsPage from './pages/parking/EntryLogsPage';
import StaffPage from './pages/staff/StaffPage';
import ResidentHome from './pages/resident/ResidentHome';
import LoadingSpinner from './components/ui/LoadingSpinner';

function HomeRedirect() {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingSpinner className="min-h-screen" />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Navigate to={getHomePath(user.role)} replace />;
}

export default function App() {
  const { loading, isAuthenticated, user } = useAuth();

  if (loading) return <LoadingSpinner className="min-h-screen" />;

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to={getHomePath(user.role)} replace /> : <Login />}
      />
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<HomeRedirect />} />

        {/* Admin */}
        <Route path="/dashboard" element={<RoleRoute roles={['Admin']}><Dashboard /></RoleRoute>} />
        <Route path="/members/flats" element={<RoleRoute roles={['Admin']}><FlatsPage /></RoleRoute>} />
        <Route path="/members/owners" element={<RoleRoute roles={['Admin']}><OwnersPage /></RoleRoute>} />
        <Route path="/members/occupants" element={<RoleRoute roles={['Admin']}><OccupantsPage /></RoleRoute>} />
        <Route path="/members/family-members" element={<RoleRoute roles={['Admin']}><FamilyMembersPage /></RoleRoute>} />
        <Route path="/members/tenants" element={<RoleRoute roles={['Admin']}><TenantsPage /></RoleRoute>} />
        <Route path="/members/vehicles" element={<RoleRoute roles={['Admin']}><VehiclesPage /></RoleRoute>} />
        <Route path="/members/documents" element={<RoleRoute roles={['Admin']}><DocumentsPage /></RoleRoute>} />
        <Route path="/members/notes" element={<RoleRoute roles={['Admin']}><NotesPage /></RoleRoute>} />
        <Route path="/members/tags" element={<RoleRoute roles={['Admin']}><TagsPage /></RoleRoute>} />
        <Route path="/members/reminders" element={<RoleRoute roles={['Admin']}><RemindersPage /></RoleRoute>} />
        <Route path="/members/import-export" element={<RoleRoute roles={['Admin']}><ImportExportPage /></RoleRoute>} />
        <Route path="/members/flat360/:id" element={<RoleRoute roles={['Admin']}><Flat360Page /></RoleRoute>} />
        <Route path="/parking" element={<RoleRoute roles={['Admin']}><ParkingDashboard /></RoleRoute>} />
        <Route path="/parking/slots" element={<RoleRoute roles={['Admin']}><SlotsPage /></RoleRoute>} />
        <Route path="/parking/allocations" element={<RoleRoute roles={['Admin']}><AllocationsPage /></RoleRoute>} />
        <Route path="/parking/logs" element={<RoleRoute roles={['Admin']}><EntryLogsPage /></RoleRoute>} />
        <Route path="/staff" element={<RoleRoute roles={['Admin']}><StaffPage /></RoleRoute>} />

        {/* Watchman (+ Admin can test gate) */}
        <Route path="/parking/gate" element={<RoleRoute roles={['Admin', 'Watchman']}><GatePage /></RoleRoute>} />

        {/* Resident */}
        <Route path="/resident" element={<RoleRoute roles={['Resident']}><ResidentHome /></RoleRoute>} />
        <Route path="/resident/notices" element={<RoleRoute roles={['Resident']}><ComingSoon title="Notices" /></RoleRoute>} />
      </Route>
      <Route path="*" element={<HomeRedirect />} />
    </Routes>
  );
}
