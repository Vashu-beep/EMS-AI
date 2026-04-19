'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Employee } from '@/lib/types';

export default function MarkAttendance() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendance, setAttendance] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await api.get('/employees?limit=1000');
        setEmployees(res.data.employees || []);
      } catch (err) {
        console.error('Failed to fetch employees:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const handleStatusChange = (empId: string, status: string) => {
    setAttendance((prev) => ({ ...prev, [empId]: status }));
  };

  const handleSubmit = async () => {
    const entries = Object.entries(attendance);
    if (entries.length === 0) {
      alert('Please select a status for at least one employee.');
      return;
    }
    setSaving(true);
    try {
      await Promise.all(
        entries.map(([employeeId, status]) =>
          api.post('/attendance', { employeeId, date: today, status })
        )
      );
      alert('Attendance saved successfully!');
      setAttendance({}); // reset selections
    } catch (err) {
      console.error('Save error:', err);
      alert('Failed to save attendance. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading employees...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Mark Attendance for {today}</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Employee</th>
              <th className="p-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp._id} className="border-t">
                <td className="p-2">{emp.firstName} {emp.lastName}</td>
                <td className="p-2">
                  <select
  value={attendance[emp._id] || ''}
  onChange={(e) => handleStatusChange(emp._id, e.target.value)}
  className="border p-1 rounded"
  title="Attendance status"      // ✅ adds accessible name
>
  <option value="">-- Select --</option>
  <option value="present">Present</option>
  <option value="absent">Absent</option>
  <option value="late">Late</option>
</select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        onClick={handleSubmit}
        disabled={saving}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save Attendance'}
      </button>
    </div>
  );
}