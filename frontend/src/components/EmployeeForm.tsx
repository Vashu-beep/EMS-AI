'use client';
import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '@/lib/axios';
import AchievementsList from './AchievementsList';
import ProjectsList from './ProjectsList';

// Zod schema for validation
const employeeSchema = z.object({
  firstName: z.string().min(1, 'First name required'),
  lastName: z.string().min(1, 'Last name required'),
  email: z.string().email('Invalid email'),
  department: z.string().min(1, 'Department required'),
  position: z.string().min(1, 'Position required'),
  currentSalary: z.number().positive('Salary must be positive'),
  achievements: z.array(
    z.object({
      title: z.string().min(1, 'Title required'),
      date: z.string().optional(),
      description: z.string().optional(),
    })
  ),
  projects: z.array(
    z.object({
      name: z.string().min(1, 'Project name required'),
      description: z.string().optional(),
      role: z.string().optional(),
      technologies: z.array(z.string()).optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    })
  ),
});

export type EmployeeFormData = z.infer<typeof employeeSchema>;

interface EmployeeFormProps {
  defaultValues?: Partial<EmployeeFormData> & { _id?: string; resumePath?: string };
  onSubmit?: (data: EmployeeFormData) => void;
}

export default function EmployeeForm({ defaultValues, onSubmit }: EmployeeFormProps) {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: defaultValues || { achievements: [], projects: [] },
  });

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setResumeFile(e.target.files[0]);
  };

  const onSubmitForm = async (data: EmployeeFormData) => {
    setUploading(true);
    try {
      let employeeId: string;
      if (defaultValues?._id) {
        // Update existing employee
        await api.put(`/employees/${defaultValues._id}`, data);
        employeeId = defaultValues._id;
      } else {
        // Create new employee
        const res = await api.post('/employees', data);
        employeeId = res.data._id;
      }
      // Upload resume if a new file was selected
      if (resumeFile) {
        const formData = new FormData();
        formData.append('resume', resumeFile);
        await api.post(`/employees/${employeeId}/resume`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      if (onSubmit) onSubmit(data);
      else alert('Employee saved successfully!');
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error || 'Error saving employee');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
      <input {...register('firstName')} placeholder="First Name" className="border p-2 rounded w-full" />
      {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}

      <input {...register('lastName')} placeholder="Last Name" className="border p-2 rounded w-full" />
      {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}

      <input {...register('email')} placeholder="Email" className="border p-2 rounded w-full" />
      {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

      <input {...register('department')} placeholder="Department" className="border p-2 rounded w-full" />
      {errors.department && <p className="text-red-500 text-sm">{errors.department.message}</p>}

      <input {...register('position')} placeholder="Position" className="border p-2 rounded w-full" />
      {errors.position && <p className="text-red-500 text-sm">{errors.position.message}</p>}

      <input
        {...register('currentSalary', { valueAsNumber: true })}
        type="number"
        placeholder="Salary"
        className="border p-2 rounded w-full"
      />
      {errors.currentSalary && <p className="text-red-500 text-sm">{errors.currentSalary.message}</p>}

      {/* Resume Upload */}
      <div>
        <label className="block font-semibold mb-1">Resume (PDF/DOC/DOCX)</label>
        <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeChange} className="border p-2 rounded w-full" />
        {defaultValues?.resumePath && !resumeFile && (
          <p className="text-sm text-green-600 mt-1">Current resume uploaded. Choose new to replace.</p>
        )}
      </div>

      <AchievementsList control={control} register={register} errors={errors} />
      <ProjectsList control={control} register={register} errors={errors} />

      <button type="submit" disabled={uploading} className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50">
        {uploading ? 'Saving...' : 'Save Employee'}
      </button>
    </form>
  );
}