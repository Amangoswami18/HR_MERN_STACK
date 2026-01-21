import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import leaveService from '../services/leaveService';
import attendanceService from '../services/attendanceService';
import { toast } from 'react-toastify';
import { FiCalendar, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    leaveBalance: 0,
    pendingLeaves: 0,
    approvedLeaves: 0,
    totalPresent: 0,
    totalAbsent: 0,
    attendancePercentage: 0,
  });
  const [recentLeaves, setRecentLeaves] = useState([]);
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch leaves
      const leavesRes = await leaveService.getMyLeaves();
      const leaves = leavesRes.leaves || [];
      
      const pending = leaves.filter(l => l.status === 'Pending').length;
      const approved = leaves.filter(l => l.status === 'Approved').length;
      
      // Get recent leaves (last 5)
      setRecentLeaves(leaves.slice(0, 5));
      
      // Fetch attendance
      const attendanceRes = await attendanceService.getMyAttendance();
      const attendance = attendanceRes.attendance || [];
      const attendanceStats = attendanceRes.statistics || {};
      
      // Get recent attendance (last 7 days)
      setRecentAttendance(attendance.slice(0, 7));
      
      setStats({
        leaveBalance: user.leaveBalance || 0,
        pendingLeaves: pending,
        approvedLeaves: approved,
        totalPresent: attendanceStats.totalPresent || 0,
        totalAbsent: attendanceStats.totalAbsent || 0,
        attendancePercentage: attendanceStats.attendancePercentage || 0,
      });
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.fullName}!</h1>
        <p className="text-gray-600 mt-1">Here's what's happening with your account today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Leave Balance</p>
              <p className="text-3xl font-bold mt-1">{stats.leaveBalance}</p>
              <p className="text-blue-100 text-xs mt-1">days available</p>
            </div>
            <FiCalendar size={40} className="text-blue-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Pending Leaves</p>
              <p className="text-3xl font-bold mt-1">{stats.pendingLeaves}</p>
              <p className="text-yellow-100 text-xs mt-1">awaiting approval</p>
            </div>
            <FiClock size={40} className="text-yellow-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Days Present</p>
              <p className="text-3xl font-bold mt-1">{stats.totalPresent}</p>
              <p className="text-green-100 text-xs mt-1">this period</p>
            </div>
            <FiCheckCircle size={40} className="text-green-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Attendance Rate</p>
              <p className="text-3xl font-bold mt-1">{stats.attendancePercentage}%</p>
              <p className="text-purple-100 text-xs mt-1">overall performance</p>
            </div>
            <FiCheckCircle size={40} className="text-purple-200" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <button
          onClick={() => navigate('/leaves/apply')}
          className="card hover:shadow-lg transition-shadow cursor-pointer border-2 border-primary-100 hover:border-primary-300"
        >
          <div className="text-center">
            <FiCalendar size={48} className="mx-auto text-primary-600 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Apply for Leave</h3>
            <p className="text-sm text-gray-600">Submit a new leave request</p>
          </div>
        </button>

        <button
          onClick={() => navigate('/attendance/mark')}
          className="card hover:shadow-lg transition-shadow cursor-pointer border-2 border-green-100 hover:border-green-300"
        >
          <div className="text-center">
            <FiCheckCircle size={48} className="mx-auto text-green-600 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Mark Attendance</h3>
            <p className="text-sm text-gray-600">Record your attendance for today</p>
          </div>
        </button>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leaves */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Leave Requests</h2>
          {recentLeaves.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No leave requests yet</p>
          ) : (
            <div className="space-y-3">
              {recentLeaves.map((leave) => (
                <div key={leave._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{leave.leaveType}</p>
                    <p className="text-sm text-gray-600">
                      {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
                    </p>
                  </div>
                  <span className={`badge badge-${leave.status.toLowerCase()}`}>
                    {leave.status}
                  </span>
                </div>
              ))}
            </div>
          )}
          <button
            onClick={() => navigate('/leaves')}
            className="mt-4 w-full text-center text-primary-600 hover:text-primary-700 font-medium text-sm"
          >
            View All Leaves →
          </button>
        </div>

        {/* Recent Attendance */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Attendance</h2>
          {recentAttendance.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No attendance records yet</p>
          ) : (
            <div className="space-y-3">
              {recentAttendance.map((record) => (
                <div key={record._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{formatDate(record.date)}</p>
                    {record.remarks && (
                      <p className="text-sm text-gray-600">{record.remarks}</p>
                    )}
                  </div>
                  <span className={`badge badge-${record.status.toLowerCase()}`}>
                    {record.status}
                  </span>
                </div>
              ))}
            </div>
          )}
          <button
            onClick={() => navigate('/attendance')}
            className="mt-4 w-full text-center text-primary-600 hover:text-primary-700 font-medium text-sm"
          >
            View All Attendance →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
