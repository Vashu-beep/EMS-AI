'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import Link from 'next/link';
import { Employee } from '@/lib/types';
import ReviseSalaryModal from '@/components/ReviseSalaryModal';

export default function SalaryListPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await api.get('/employees?limit=1000');
        setEmployees(res.data.employees);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const handleReviseSuccess = () => {
    // Refresh employee list
    api.get('/employees?limit=1000').then(res => setEmployees(res.data.employees));
    setSelectedEmployee(null);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Employee Salary List</h1>
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Name</th>
              <th>Department</th>
              <th>Position</th>
              <th>Current Salary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp._id} className="border-t">
                <td className="p-2">{emp.firstName} {emp.lastName}</td>
                <td>{emp.department}</td>
                <td>{emp.position}</td>
                <td>${emp.currentSalary?.toLocaleString()}</td>
                <td>
                  <button
                    onClick={() => setSelectedEmployee(emp)}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Revise Salary
                  </button>
                  <Link href={`/employees/${emp._id}`} className="ml-2 text-blue-600 underline">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedEmployee && (
        <ReviseSalaryModal
          employeeId={selectedEmployee._id}
          currentSalary={selectedEmployee.currentSalary}
          onClose={() => setSelectedEmployee(null)}
          onSuccess={handleReviseSuccess}
        />
      )}
    </div>
  );
}