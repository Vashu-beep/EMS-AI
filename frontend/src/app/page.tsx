'use client';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import api from '@/lib/axios';
import Link from 'next/link';
import { Employee } from '@/lib/types';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 400);
  const [department, setDepartment] = useState('');
  const [departments, setDepartments] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/employees', {
        params: { search: debouncedSearch, department, limit: 100 },
      });
      const empList = res.data.employees || [];
      setEmployees(empList);
      // ✅ Filter out undefined departments
      const uniqueDepts = [
        ...new Set(empList.map((e: Employee) => e.department).filter(Boolean)),
      ] as string[];
      setDepartments(uniqueDepts);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [debouncedSearch, department]);

  const deactivate = async (id: string) => {
    if (confirm('Deactivate employee?')) {
      try {
        await api.delete(`/employees/${id}`);
        fetchEmployees();
      } catch (err: any) {
        alert(err.response?.data?.error || 'Deactivation failed');
      }
    }
  };

  if (loading) return <div className="text-center py-8">Loading employees...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Employees</h1>
        <Link href="/employees/add" className="bg-blue-600 text-white px-4 py-2 rounded">+ Add Employee</Link>
      </div>
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-64"
        />
       <select
  value={department}
  onChange={(e) => setDepartment(e.target.value)}
  className="border p-2 rounded"
  title="Filter by department"   // ✅ adds accessible name
>
  <option value="">All Departments</option>
  {departments.map((d) => <option key={d}>{d}</option>)}
</select>
      </div>
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Department</th>
              <th className="p-2 text-left">Position</th>
              <th className="p-2 text-left">Salary</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp._id} className="border-t">
                <td className="p-2">{emp.firstName} {emp.lastName}</td>
                <td className="p-2">{emp.email}</td>
                <td className="p-2">{emp.department || '-'}</td>
                <td className="p-2">{emp.position}</td>
                <td className="p-2">${emp.currentSalary?.toLocaleString()}</td>
                <td className="p-2 space-x-2">
                  <Link href={`/employees/${emp._id}`} className="text-blue-600">View</Link>
                  <Link href={`/employees/${emp._id}/edit`} className="text-green-600">Edit</Link>
                  <button onClick={() => deactivate(emp._id)} className="text-red-600">Deactivate</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}