'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';

interface SalaryHistory {
  _id: string;
  oldSalary: number;
  newSalary: number;
  effectiveDate: string;
  reason?: string;
}

export default function SalaryHistoryTable({ employeeId }: { employeeId: string }) {
  const [history, setHistory] = useState<SalaryHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get(`/salary/history/${employeeId}`);
        setHistory(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [employeeId]);

  if (loading) return <div>Loading salary history...</div>;

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Salary Revision History</h2>
      <table className="min-w-full">
        <thead className="bg-gray-100">
          <tr><th className="p-2">Old Salary</th><th>New Salary</th><th>Effective Date</th><th>Reason</th></tr>
        </thead>
        <tbody>
          {history.map((h) => (
            <tr key={h._id} className="border-t">
              <td className="p-2">${h.oldSalary.toLocaleString()}</td>
              <td>${h.newSalary.toLocaleString()}</td>
              <td>{new Date(h.effectiveDate).toDateString()}</td>
              <td>{h.reason || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}