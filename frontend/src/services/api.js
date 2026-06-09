import React from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const attendanceService = {
  checkIn: async (location) => {
    try {
      const response = await axios.post(`${API_URL}/api/attendance/checkin`, { location });
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Check-in failed';
    }
  },

  checkOut: async () => {
    try {
      const response = await axios.post(`${API_URL}/api/attendance/checkout`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Check-out failed';
    }
  },

  getTodayAttendance: async () => {
    try {
      const response = await axios.get(`${API_URL}/api/attendance/today`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Failed to fetch today attendance';
    }
  },

  getHistory: async (startDate, endDate) => {
    try {
      const response = await axios.get(`${API_URL}/api/attendance/history`, {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Failed to fetch history';
    }
  }
};

export const reportsService = {
  getAttendanceReport: async (startDate, endDate, employeeId) => {
    try {
      const response = await axios.get(`${API_URL}/api/reports/attendance`, {
        params: { startDate, endDate, employeeId }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Failed to fetch report';
    }
  },

  getDailyReport: async (date) => {
    try {
      const response = await axios.get(`${API_URL}/api/reports/daily`, {
        params: { date }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Failed to fetch daily report';
    }
  }
};

export const employeeService = {
  getMe: async () => {
    try {
      const response = await axios.get(`${API_URL}/api/employees/me`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Failed to fetch employee info';
    }
  },

  getAll: async () => {
    try {
      const response = await axios.get(`${API_URL}/api/employees`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Failed to fetch employees';
    }
  },

  create: async (employeeData) => {
    try {
      const response = await axios.post(`${API_URL}/api/employees`, employeeData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Failed to create employee';
    }
  },

  update: async (id, employeeData) => {
    try {
      const response = await axios.put(`${API_URL}/api/employees/${id}`, employeeData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Failed to update employee';
    }
  }
};
