// frontend/src/components/AttendanceTable.tsx
'use client';
import { useState } from 'react';
import api from '@/lib/axios';
import { AttendanceRecord } from '@/lib/types';

interface AttendanceTableProps {
  employeeId: string;
  attendance: AttendanceRecord[];
  onRefresh: () => void;
}

export default function AttendanceTable({ employeeId, attendance, onRefresh }: AttendanceTableProps) {
  const [marking, setMarking] = useState(false);

  const handleMark = async (status: string) => {
    setMarking(true);
    const today = new Date().toISOString().split('T')[0];
    try {
      await api.post('/attendance', { employeeId, date: today, status });
      alert(`Marked as ${status}`);
      onRefresh();
    } catch (err) {
      console.error(err);
      alert('Failed to mark attendance');
    } finally {
      setMarking(false);
    }
  };

  return (
    <div>
      <div className="space-x-2 mb-4">
        <button onClick={() => handleMark('present')} disabled={marking} className="bg-green-600 text-white px-3 py-1 rounded disabled:opacity-50">Present</button>
        <button onClick={() => handleMark('absent')} disabled={marking} className="bg-red-600 text-white px-3 py-1 rounded disabled:opacity-50">Absent</button>
        <button onClick={() => handleMark('late')} disabled={marking} className="bg-yellow-600 text-white px-3 py-1 rounded disabled:opacity-50">Late</button>
      </div>
      <table className="min-w-full bg-white border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Date</th>
            <th>Status</th>
            <th>Check In</th>
            <th>Check Out</th>
          </tr>
        </thead>
        <tbody>
          {attendance.map((a) => (
            <tr key={a._id} className="border-t">
              <td className="p-2">{new Date(a.date).toDateString()}</td>
              <td>{a.status}</td>
              <td>{a.checkInTime || '-'}</td>
              <td>{a.checkOutTime || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}