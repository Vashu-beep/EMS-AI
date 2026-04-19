'use client';
import { useFieldArray, Control, UseFormRegister, FieldErrors } from 'react-hook-form';
import { EmployeeFormData } from './EmployeeForm';

interface ProjectsListProps {
  control: Control<EmployeeFormData>;
  register: UseFormRegister<EmployeeFormData>;
  errors?: FieldErrors<EmployeeFormData>;
}

export default function ProjectsList({ control, register, errors }: ProjectsListProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'projects',
  });

  const addProject = () => {
    append({
      name: '',
      description: '',
      role: '',
      technologies: [],
      startDate: '',
      endDate: '',
    });
  };

  return (
    <div className="space-y-3">
      <label className="block font-semibold">Projects</label>
      {fields.map((field, idx) => (
        <div key={field.id} className="border p-4 rounded space-y-2 bg-gray-50">
          <div className="flex justify-between">
            <span>Project #{idx + 1}</span>
            <button type="button" onClick={() => remove(idx)} className="text-red-600">Remove</button>
          </div>
          <input
            {...register(`projects.${idx}.name`)}
            placeholder="Project Name *"
            className="border p-2 rounded w-full"
          />
          {errors?.projects?.[idx]?.name && (
            <p className="text-red-500 text-sm">{errors.projects[idx]?.name?.message}</p>
          )}
          <textarea
            {...register(`projects.${idx}.description`)}
            placeholder="Description"
            className="border p-2 rounded w-full"
            rows={2}
          />
          <input
            {...register(`projects.${idx}.role`)}
            placeholder="Your Role"
            className="border p-2 rounded w-full"
          />
          <input
            {...register(`projects.${idx}.technologies`)}
            placeholder="Technologies (comma separated)"
            className="border p-2 rounded w-full"
          />
          <div className="flex gap-2">
            <input
              {...register(`projects.${idx}.startDate`)}
              type="date"
              className="border p-2 rounded flex-1"
            />
            <input
              {...register(`projects.${idx}.endDate`)}
              type="date"
              className="border p-2 rounded flex-1"
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={addProject}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        + Add Project
      </button>
    </div>
  );
}