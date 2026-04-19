import React, { useState, useEffect } from 'react';
import { getAttendanceByDate, bulkMarkAttendance } from '../services/attendanceService';

interface EmployeeAttendance {
  employee: {
    _id: string;
    name: string;
    email: string;
    department: string;
  };
  attendance: {
    status: string;
    _id?: string;
    checkIn?: string;
    checkOut?: string;
  };
}

const DailyAttendance: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [attendanceList, setAttendanceList] = useState<EmployeeAttendance[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchAttendance = async (date: string) => {
    setLoading(true);
    try {
      const data = await getAttendanceByDate(date);
      setAttendanceList(data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance(selectedDate);
  }, [selectedDate]);

  const handleStatusChange = (empId: string, newStatus: string) => {
    setAttendanceList(prev =>
      prev.map(item =>
        item.employee._id === empId
          ? { ...item, attendance: { ...item.attendance, status: newStatus } }
          : item
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);
    const records = attendanceList.map(item => ({
      employeeId: item.employee._id,
      status: item.attendance.status,
    }));
    try {
      await bulkMarkAttendance(selectedDate, records);
      alert('Attendance saved successfully!');
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Daily Attendance</h1>
        <div className="flex gap-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border rounded px-3 py-2"
          />
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Attendance'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="overflow-x-auto shadow rounded-lg">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check In
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check Out
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {attendanceList.map(({ employee, attendance }) => (
                <tr key={employee._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                    <div className="text-sm text-gray-500">{employee.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {employee.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={attendance.status}
                      onChange={(e) => handleStatusChange(employee._id, e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                      <option value="half-day">Half Day</option>
                      <option value="late">Late</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="time"
                      value={attendance.checkIn?.slice(11, 16) || ''}
                      onChange={(e) => {
                        const newCheckIn = e.target.value
                          ? `${selectedDate}T${e.target.value}:00`
                          : undefined;
                        setAttendanceList(prev =>
                          prev.map(item =>
                            item.employee._id === employee._id
                              ? { ...item, attendance: { ...item.attendance, checkIn: newCheckIn } }
                              : item
                          )
                        );
                      }}
                      className="border rounded px-2 py-1 text-sm"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="time"
                      value={attendance.checkOut?.slice(11, 16) || ''}
                      onChange={(e) => {
                        const newCheckOut = e.target.value
                          ? `${selectedDate}T${e.target.value}:00`
                          : undefined;
                        setAttendanceList(prev =>
                          prev.map(item =>
                            item.employee._id === employee._id
                              ? { ...item, attendance: { ...item.attendance, checkOut: newCheckOut } }
                              : item
                          )
                        );
                      }}
                      className="border rounded px-2 py-1 text-sm"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DailyAttendance;






