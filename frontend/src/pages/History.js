import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { attendanceService } from '../services/api';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await attendanceService.getHistory(startDate, endDate);
      setHistory(data.data || []);
      setError('');
    } catch (err) {
      setError(err || 'Failed to fetch history');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const calculateDuration = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return '-';
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const hours = Math.floor((end - start) / 3600000);
    const minutes = Math.floor(((end - start) % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-800">
              Lịch Sử Chấm Công
            </h1>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              ← Quay Lại
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              placeholder="Ngày bắt đầu"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              placeholder="Ngày kết thúc"
            />
          </div>

          <button
            onClick={fetchHistory}
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {loading ? 'Đang tải...' : '🔍 Tìm Kiếm'}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-6 text-center text-gray-600">
              Đang tải dữ liệu...
            </div>
          ) : history.length === 0 ? (
            <div className="p-6 text-center text-gray-600">
              Không có dữ liệu chấm công
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Ngày</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Giờ Vào</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Giờ Ra</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Thời Gian</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Địa Điểm</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((record, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    >
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {formatDate(record.created_at)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {formatTime(record.check_in_time)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {formatTime(record.check_out_time)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {calculateDuration(record.check_in_time, record.check_out_time)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {record.location || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Tổng số bản ghi: {history.length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default History;
