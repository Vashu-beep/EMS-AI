'use client';
import { useState } from 'react';
import api from '@/lib/axios';

interface ReviseSalaryModalProps {
  employeeId: string;
  currentSalary: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ReviseSalaryModal({ employeeId, currentSalary, onClose, onSuccess }: ReviseSalaryModalProps) {
  const [newSalary, setNewSalary] = useState(currentSalary);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newSalary === currentSalary) {
      alert('New salary must be different from current salary');
      return;
    }
    setLoading(true);
    try {
      await api.post('/salary/revise', { employeeId, newSalary, reason });
      alert('Salary revised successfully');
      onSuccess();
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to revise salary');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">Revise Salary</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="currentSalary" className="block text-sm font-medium mb-1">Current Salary</label>
            <input
              id="currentSalary"
              type="text"
              value={`$${currentSalary.toLocaleString()}`}
              disabled
              className="border p-2 rounded w-full bg-gray-100"
              aria-label="Current salary (read-only)"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="newSalary" className="block text-sm font-medium mb-1">New Salary *</label>
            <input
              id="newSalary"
              type="number"
              value={newSalary}
              onChange={(e) => setNewSalary(Number(e.target.value))}
              required
              className="border p-2 rounded w-full"
              aria-label="New salary amount"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="reason" className="block text-sm font-medium mb-1">Reason (optional)</label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="border p-2 rounded w-full"
              rows={3}
              aria-label="Reason for salary revision"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">
              {loading ? 'Saving...' : 'Revise Salary'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}