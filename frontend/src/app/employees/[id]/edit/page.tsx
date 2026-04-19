// frontend/src/app/employees/[id]/edit/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import EmployeeForm from '@/components/EmployeeForm';
import { EmployeeFormData } from '@/components/EmployeeForm';
import api from '@/lib/axios';
import { Employee } from '@/lib/types';

export default function EditEmployee() {
  const { id } = useParams();
  const router = useRouter();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await api.get(`/employees/${id}`);
        setEmployee(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, [id]);

  const onSubmit = (data: EmployeeFormData) => {
    router.push(`/employees/${id}`);
  };

  if (loading) return <div className="text-center py-8">Loading employee...</div>;
  if (!employee) return <div className="text-center py-8">Employee not found.</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Employee</h1>
      <EmployeeForm
        defaultValues={{
          ...employee,
          _id: employee._id,
          resumePath: employee.resumePath
        }}
        onSubmit={onSubmit}
      />
    </div>
  );
}