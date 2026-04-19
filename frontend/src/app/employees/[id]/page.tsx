'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/axios';
import { Employee, AttendanceRecord } from '@/lib/types';
import Link from 'next/link';
import SalaryHistoryTable from '@/components/SalaryHistoryTable';
import AttendanceTable from '@/components/AttendanceTable';
import ReviseSalaryModal from '@/components/ReviseSalaryModal';

export default function EmployeeDetail() {
  const { id } = useParams() as { id: string };
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSalaryModal, setShowSalaryModal] = useState(false);

  const fetchData = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const [empRes, attRes] = await Promise.all([
        api.get(`/employees/${id}`),
        api.get('/attendance/employee', {
          params: { employeeId: id, month: new Date().getMonth() + 1, year: new Date().getFullYear() },
        }),
      ]);
      setEmployee(empRes.data);
      setAttendance(attRes.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const refreshAttendance = () => fetchData();
  const refreshEmployee = () => fetchData();

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!employee) return <div className="text-center py-8">Employee not found</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{employee.firstName} {employee.lastName}</h1>
        <Link href={`/employees/${id}/edit`} className="bg-green-600 text-white px-4 py-2 rounded">
          Edit
        </Link>
      </div>
      <div className="border-b mb-4">
        {['profile', 'salary', 'attendance'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`mr-4 pb-2 capitalize ${activeTab === tab ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <div className="bg-white p-4 rounded shadow">
          <p><strong>Email:</strong> {employee.email}</p>
          <p><strong>Phone:</strong> {employee.phone || '-'}</p>
          <p><strong>Department:</strong> {employee.department}</p>
          <p><strong>Position:</strong> {employee.position}</p>
          <p><strong>Salary:</strong> ${employee.currentSalary?.toLocaleString()}</p>
          <p><strong>Joining:</strong> {new Date(employee.joiningDate).toDateString()}</p>
          {employee.resumePath && (
            <a href={`https://ems-ai-1-cf6p.onrender.com/${employee.resumePath}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 block">
              📄 Download Resume
            </a>
          )}
          <div className="mt-4"><h3 className="font-semibold">Skills</h3><div className="flex flex-wrap gap-2">{employee.skills.map(s => <span key={s} className="bg-gray-200 px-2 py-1 rounded">{s}</span>)}</div></div>
          <div className="mt-4"><h3 className="font-semibold">Projects</h3>{employee.projects.map((p, i) => <div key={i} className="border p-2 mt-2"><strong>{p.name}</strong> - {p.role}<br />{p.description}</div>)}</div>
          <div className="mt-4"><h3 className="font-semibold">Achievements</h3>{employee.achievements.map((a, i) => <div key={i}><strong>{a.title}</strong> ({a.date ? new Date(a.date).getFullYear() : 'No date'}) - {a.description}</div>)}</div>
        </div>
      )}

      {activeTab === 'salary' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <SalaryHistoryTable employeeId={employee._id} />
            <button onClick={() => setShowSalaryModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded ml-4">
              Revise Salary
            </button>
          </div>
          {showSalaryModal && (
            <ReviseSalaryModal
              employeeId={employee._id}
              currentSalary={employee.currentSalary}
              onClose={() => setShowSalaryModal(false)}
              onSuccess={refreshEmployee}
            />
          )}
        </div>
      )}

      {activeTab === 'attendance' && <AttendanceTable employeeId={employee._id} attendance={attendance} onRefresh={refreshAttendance} />}
    </div>
  );
}