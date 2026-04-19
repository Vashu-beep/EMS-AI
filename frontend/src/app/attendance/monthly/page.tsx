// frontend/src/app/attendance/monthly/page.tsx
'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { AttendanceRecord } from '@/lib/types';

interface Summary {
  [key: string]: { present: number; absent: number; late: number };
}

export default function MonthlyAttendance() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true);
      try {
        const res = await api.get('/attendance/month', { params: { month, year } });
        setRecords(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, [month, year]);

  const summary: Summary = records.reduce((acc, rec) => {
    const name =
      typeof rec.employeeId === 'object'
        ? `${rec.employeeId.firstName} ${rec.employeeId.lastName}`
        : rec.employeeId;
    if (!acc[name]) acc[name] = { present: 0, absent: 0, late: 0 };
    acc[name][rec.status]++;
    return acc;
  }, {} as Summary);

  if (loading) return <div className="text-center py-8">Loading summary...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Monthly Attendance Summary</h1>
      <div className="flex gap-2 mb-4">
        <input
          type="number"
          value={month}
          onChange={(e) => setMonth(Math.min(12, Math.max(1, Number(e.target.value))))}
          min={1}
          max={12}
          className="border p-2 rounded w-24"
        />
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="border p-2 rounded w-28"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Employee</th>
              <th className="p-2 text-left">Present</th>
              <th className="p-2 text-left">Absent</th>
              <th className="p-2 text-left">Late</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(summary).map(([name, stats]) => (
              <tr key={name} className="border-t">
                <td className="p-2">{name}</td>
                <td className="p-2">{stats.present}</td>
                <td className="p-2">{stats.absent}</td>
                <td className="p-2">{stats.late}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}