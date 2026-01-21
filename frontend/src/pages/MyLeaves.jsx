import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import leaveService from '../services/leaveService';
import { toast } from 'react-toastify';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';

const MyLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const res = await leaveService.getMyLeaves();
      setLeaves(res.leaves || []);
    } catch (error) {
      toast.error('Failed to load leaves');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this leave request?')) return;
    
    try {
      await leaveService.cancelLeave(id);
      toast.success('Leave cancelled successfully');
      fetchLeaves();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel leave');
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
        <h1 className="text-3xl font-bold text-gray-900">My Leaves</h1>
        <button onClick={() => navigate('/leaves/apply')} className="btn-primary flex items-center gap-2">
          <FiPlus /> Apply Leave
        </button>
      </div>

      {leaves.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 mb-4">No leave requests found</p>
          <button onClick={() => navigate('/leaves/apply')} className="btn-primary">
            Apply for Leave
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {leaves.map((leave) => (
            <div key={leave._id} className="card hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{leave.leaveType} Leave</h3>
                    <span className={`badge badge-${leave.status.toLowerCase()}`}>{leave.status}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-1">
                    {formatDate(leave.startDate)} - {formatDate(leave.endDate)} ({leave.totalDays} days)
                  </p>
                  {leave.reason && <p className="text-gray-600 text-sm">Reason: {leave.reason}</p>}
                  {leave.rejectionReason && (
                    <p className="text-red-600 text-sm mt-2">Rejection Reason: {leave.rejectionReason}</p>
                  )}
                </div>
                {leave.status === 'Pending' && (
                  <div className="flex gap-2 mt-4 md:mt-0">
                    <button onClick={() => handleCancel(leave._id)} className="btn-danger flex items-center gap-1">
                      <FiTrash2 size={16} /> Cancel
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

export default MyLeaves;
