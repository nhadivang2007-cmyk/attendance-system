import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { attendanceService } from '../services/api';

const Dashboard = () => {
  const [checkedIn, setCheckedIn] = useState(false);
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTodayAttendance();
    const interval = setInterval(fetchTodayAttendance, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchTodayAttendance = async () => {
    try {
      const data = await attendanceService.getTodayAttendance();
      if (data.data && data.data.length > 0) {
        setTodayAttendance(data.data[0]);
        setCheckedIn(data.data[0].check_in_time && !data.data[0].check_out_time);
      }
    } catch (err) {
      console.error('Failed to fetch attendance:', err);
    }
  };

  const handleCheckIn = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await attendanceService.checkIn('Văn phòng chính');
      setSuccess('✓ Chấm công vào thành công!');
      await fetchTodayAttendance();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err || 'Chấm công vào thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await attendanceService.checkOut();
      setSuccess('✓ Chấm công ra thành công!');
      await fetchTodayAttendance();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err || 'Chấm công ra thất bại');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Hệ Thống Chấm Công
          </h1>
          <p className="text-gray-600">
            {new Date().toLocaleDateString('vi-VN', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="text-center mb-8">
            <div className="text-6xl font-bold text-blue-600 mb-4">
              {formatTime(todayAttendance?.check_in_time)}
            </div>
            <p className="text-gray-600">Giờ vào làm</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={handleCheckIn}
              disabled={loading || checkedIn}
              className={`py-3 px-4 rounded font-bold text-white ${
                checkedIn
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              {loading ? 'Đang xử lý...' : '✓ Vào làm'}
            </button>

            <button
              onClick={handleCheckOut}
              disabled={loading || !checkedIn}
              className={`py-3 px-4 rounded font-bold text-white ${
                !checkedIn
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              {loading ? 'Đang xử lý...' : '✗ Ra về'}
            </button>
          </div>

          {todayAttendance && (
            <div className="bg-gray-50 rounded p-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-gray-600 text-sm">Giờ vào</p>
                  <p className="text-xl font-bold text-gray-800">
                    {formatTime(todayAttendance.check_in_time)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Giờ ra</p>
                  <p className="text-xl font-bold text-gray-800">
                    {formatTime(todayAttendance.check_out_time)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => navigate('/history')}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Xem Lịch Sử Chấm Công
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
