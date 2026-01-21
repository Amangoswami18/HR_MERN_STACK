import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import attendanceService from '../services/attendanceService';
import { toast } from 'react-toastify';
import { FiPlus } from 'react-icons/fi';

const MyAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const res = await attendanceService.getMyAttendance();
      setAttendance(res.attendance || []);
      setStats(res.statistics || {});
    } catch (error) {
      toast.error('Failed to load attendance');
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
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Attendance</h1>
        <button onClick={() => navigate('/attendance/mark')} className="btn-primary flex items-center gap-2">
          <FiPlus /> Mark Attendance
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="card bg-blue-50">
          <p className="text-sm text-gray-600">Total Records</p>
          <p className="text-2xl font-bold text-blue-600">{stats.totalRecords || 0}</p>
        </div>
        <div className="card bg-green-50">
          <p className="text-sm text-gray-600">Present</p>
          <p className="text-2xl font-bold text-green-600">{stats.totalPresent || 0}</p>
        </div>
        <div className="card bg-red-50">
          <p className="text-sm text-gray-600">Absent</p>
          <p className="text-2xl font-bold text-red-600">{stats.totalAbsent || 0}</p>
        </div>
        <div className="card bg-purple-50">
          <p className="text-sm text-gray-600">Attendance %</p>
          <p className="text-2xl font-bold text-purple-600">{stats.attendancePercentage || 0}%</p>
        </div>
      </div>

      {attendance.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 mb-4">No attendance records found</p>
          <button onClick={() => navigate('/attendance/mark')} className="btn-primary">
            Mark Attendance
          </button>
        </div>
      ) : (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attendance.map((record) => (
                  <tr key={record._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(record.date)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`badge badge-${record.status.toLowerCase()}`}>{record.status}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{record.remarks || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAttendance;
