import api from './api';

const leaveService = {
  // Apply for leave
  applyLeave: async (leaveData) => {
    const response = await api.post('/leaves', leaveData);
    return response.data;
  },

  // Get my leaves
  getMyLeaves: async () => {
    const response = await api.get('/leaves/my-leaves');
    return response.data;
  },

  // Get leave by ID
  getLeaveById: async (id) => {
    const response = await api.get(`/leaves/${id}`);
    return response.data;
  },

  // Update leave
  updateLeave: async (id, leaveData) => {
    const response = await api.put(`/leaves/${id}`, leaveData);
    return response.data;
  },

  // Cancel leave
  cancelLeave: async (id) => {
    const response = await api.delete(`/leaves/${id}`);
    return response.data;
  },

  // Admin: Get all leaves
  getAllLeaves: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/leaves/admin/all?${params}`);
    return response.data;
  },

  // Admin: Update leave status
  updateLeaveStatus: async (id, statusData) => {
    const response = await api.put(`/leaves/admin/${id}/status`, statusData);
    return response.data;
  },
};

export default leaveService;
