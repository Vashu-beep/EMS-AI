// frontend/src/app/employees/add/page.tsx
'use client';
import { useRouter } from 'next/navigation';
import EmployeeForm from '@/components/EmployeeForm';
import { EmployeeFormData } from '@/components/EmployeeForm';

export default function AddEmployee() {
  const router = useRouter();
  const onSubmit = (data: EmployeeFormData) => {
    router.push('/employees');
  };
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Add New Employee</h1>
      <EmployeeForm onSubmit={onSubmit} />
    </div>
  );
}