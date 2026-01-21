import { useEffect, useState } from 'react';
import leaveService from '../../services/leaveService';
import { toast } from 'react-toastify';
import { FiCheck, FiX } from 'react-icons/fi';

const AdminLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [filter, setFilter] = useState('Pending');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaves();
  }, [filter]);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const res = await leaveService.getAllLeaves({ status: filter });
      setLeaves(res.leaves || []);
    } catch (error) {
      toast.error('Failed to load leaves');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await leaveService.updateLeaveStatus(id, { status: 'Approved' });
      toast.success('Leave approved successfully');
      fetchLeaves();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve leave');
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt('Enter rejection reason (optional):');
    try {
      await leaveService.updateLeaveStatus(id, { status: 'Rejected', rejectionReason: reason });
      toast.success('Leave rejected');
      fetchLeaves();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject leave');
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
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Leave Requests</h1>

      <div className="mb-6 flex gap-2">
        {['Pending', 'Approved', 'Rejected'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === status ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {leaves.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500">No {filter.toLowerCase()} leave requests</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {leaves.map((leave) => (
            <div key={leave._id} className="card">
              <div className="flex flex-col md:flex-row justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{leave.employee?.fullName}</h3>
                    <span className={`badge badge-${leave.status.toLowerCase()}`}>{leave.status}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-1">
                    <strong>{leave.leaveType}</strong> • {formatDate(leave.startDate)} - {formatDate(leave.endDate)} ({leave.totalDays} days)
                  </p>
                  <p className="text-gray-600 text-sm">{leave.employee?.email}</p>
                  {leave.reason && <p className="text-gray-600 text-sm mt-2">Reason: {leave.reason}</p>}
                </div>
                {leave.status === 'Pending' && (
                  <div className="flex gap-2 mt-4 md:mt-0">
                    <button onClick={() => handleApprove(leave._id)} className="btn-success flex items-center gap-1">
                      <FiCheck /> Approve
                    </button>
                    <button onClick={() => handleReject(leave._id)} className="btn-danger flex items-center gap-1">
                      <FiX /> Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminLeaves;
