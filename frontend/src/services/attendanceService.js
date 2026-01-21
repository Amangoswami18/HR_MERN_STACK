import api from './api';

const attendanceService = {
  // Mark attendance
  markAttendance: async (attendanceData) => {
    const response = await api.post('/attendance', attendanceData);
    return response.data;
  },

  // Get my attendance
  getMyAttendance: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/attendance/my-attendance?${params}`);
    return response.data;
  },

  // Get attendance by ID
  getAttendanceById: async (id) => {
    const response = await api.get(`/attendance/${id}`);
    return response.data;
  },

  // Update attendance
  updateAttendance: async (id, attendanceData) => {
    const response = await api.put(`/attendance/${id}`, attendanceData);
    return response.data;
  },

  // Delete attendance
  deleteAttendance: async (id) => {
    const response = await api.delete(`/attendance/${id}`);
    return response.data;
  },

  // Admin: Get all attendance
  getAllAttendance: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/attendance/admin/all?${params}`);
    return response.data;
  },

  // Admin: Get attendance summary
  getAttendanceSummary: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/attendance/admin/summary?${params}`);
    return response.data;
  },
};

export default attendanceService;
