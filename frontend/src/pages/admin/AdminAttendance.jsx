import { useEffect, useState } from 'react';
import attendanceService from '../../services/attendanceService';
import { toast } from 'react-toastify';

const AdminAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [summary, setSummary] = useState([]);
  const [view, setView] = useState('list');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (view === 'list') {
      fetchAttendance();
    } else {
      fetchSummary();
    }
  }, [view]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const res = await attendanceService.getAllAttendance();
      setAttendance(res.attendance || []);
    } catch (error) {
      toast.error('Failed to load attendance');
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const res = await attendanceService.getAttendanceSummary();
      setSummary(res.summary || []);
    } catch (error) {
      toast.error('Failed to load summary');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => new Date(date).toLocaleDateString('en-GB');

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Attendance Management</h1>

      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setView('list')}
          className={`px-4 py-2 rounded-lg font-medium ${
            view === 'list' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          All Records
        </button>
        <button
          onClick={() => setView('summary')}
          className={`px-4 py-2 rounded-lg font-medium ${
            view === 'summary' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Summary
        </button>
      </div>

      {view === 'list' ? (
        <div className="card overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendance.map((record) => (
                <tr key={record._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.employee?.fullName}
                  </td>
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
      ) : (
        <div className="grid gap-4">
          {summary.map((emp) => (
            <div key={emp.employeeId} className="card">
              <h3 className="font-semibold text-lg mb-2">{emp.employeeName}</h3>
              <p className="text-sm text-gray-600 mb-3">{emp.employeeEmail}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Present</p>
                  <p className="text-xl font-bold text-green-600">{emp.totalPresent}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Absent</p>
                  <p className="text-xl font-bold text-red-600">{emp.totalAbsent}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-xl font-bold text-blue-600">{emp.totalRecords}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Rate</p>
                  <p className="text-xl font-bold text-purple-600">{emp.attendancePercentage?.toFixed(2)}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminAttendance;
