import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ApplyLeave from './pages/ApplyLeave';
import MyLeaves from './pages/MyLeaves';
import MarkAttendance from './pages/MarkAttendance';
import MyAttendance from './pages/MyAttendance';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLeaves from './pages/admin/AdminLeaves';
import AdminAttendance from './pages/admin/AdminAttendance';
import AdminEmployees from './pages/admin/AdminEmployees';

const Layout = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  return (
    <>
      {isAuthenticated && <Navbar />}
      <main className="min-h-screen bg-gray-50">
        {children}
      </main>
    </>
  );
};

const DashboardRouter = () => {
  const { isAdmin } = useAuth();
  return isAdmin ? <AdminDashboard /> : <Dashboard />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes - Employee */}
            <Route path="/" element={<ProtectedRoute><DashboardRouter /></ProtectedRoute>} />
            <Route path="/leaves" element={<ProtectedRoute><MyLeaves /></ProtectedRoute>} />
            <Route path="/leaves/apply" element={<ProtectedRoute><ApplyLeave /></ProtectedRoute>} />
            <Route path="/attendance" element={<ProtectedRoute><MyAttendance /></ProtectedRoute>} />
            <Route path="/attendance/mark" element={<ProtectedRoute><MarkAttendance /></ProtectedRoute>} />

            {/* Protected Routes - Admin Only */}
            <Route path="/admin/leaves" element={<ProtectedRoute adminOnly><AdminLeaves /></ProtectedRoute>} />
            <Route path="/admin/attendance" element={<ProtectedRoute adminOnly><AdminAttendance /></ProtectedRoute>} />
            <Route path="/admin/employees" element={<ProtectedRoute adminOnly><AdminEmployees /></ProtectedRoute>} />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </AuthProvider>
  );
}

export default App;
