import { useEffect, useState } from 'react';
import userService from '../../services/userService';
import { toast } from 'react-toastify';
import { FiMail, FiCalendar, FiAward } from 'react-icons/fi';

const AdminEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await userService.getAllUsers({ role: 'employee' });
      setEmployees(res.users || []);
    } catch (error) {
      toast.error('Failed to load employees');
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
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Employee Management</h1>

      <div className="grid gap-4">
        {employees.map((employee) => (
          <div key={employee._id} className="card hover:shadow-lg transition-shadow">
            <div className="flex flex-col md:flex-row justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{employee.fullName}</h3>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiMail className="text-gray-400" />
                    <span>{employee.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiCalendar className="text-gray-400" />
                    <span>Joined: {formatDate(employee.dateOfJoining)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiAward className="text-gray-400" />
                    <span>Leave Balance: {employee.leaveBalance} days</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                <span className={`badge ${employee.isActive ? 'badge-approved' : 'badge-rejected'}`}>
                  {employee.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {employees.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-gray-500">No employees found</p>
        </div>
      )}
    </div>
  );
};

export default AdminEmployees;
