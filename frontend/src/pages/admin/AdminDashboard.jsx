import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import leaveService from '../../services/leaveService';
import userService from '../../services/userService';
import { toast } from 'react-toastify';
import { FiUsers, FiCalendar, FiClock, FiCheckCircle } from 'react-icons/fi';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalEmployees: 0,
    pendingLeaves: 0,
    approvedLeaves: 0,
    rejectedLeaves: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const [employeesRes, leavesRes] = await Promise.all([
        userService.getAllUsers({ role: 'employee' }),
        leaveService.getAllLeaves()
      ]);

      const leaves = leavesRes.leaves || [];
      
      setStats({
        totalEmployees: employeesRes.users?.length || 0,
        pendingLeaves: leaves.filter(l => l.status === 'Pending').length,
        approvedLeaves: leaves.filter(l => l.status === 'Approved').length,
        rejectedLeaves: leaves.filter(l => l.status === 'Rejected').length,
      });
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, {user.fullName}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Employees</p>
              <p className="text-3xl font-bold mt-1">{stats.totalEmployees}</p>
            </div>
            <FiUsers size={40} className="text-blue-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Pending Leaves</p>
              <p className="text-3xl font-bold mt-1">{stats.pendingLeaves}</p>
            </div>
            <FiClock size={40} className="text-yellow-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Approved Leaves</p>
              <p className="text-3xl font-bold mt-1">{stats.approvedLeaves}</p>
            </div>
            <FiCheckCircle size={40} className="text-green-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-red-500 to-red-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Rejected Leaves</p>
              <p className="text-3xl font-bold mt-1">{stats.rejectedLeaves}</p>
            </div>
            <FiCalendar size={40} className="text-red-200" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
