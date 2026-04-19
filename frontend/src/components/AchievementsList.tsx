'use client';
import { useFieldArray, Control, UseFormRegister, FieldErrors } from 'react-hook-form';
import { EmployeeFormData } from './EmployeeForm';

interface AchievementsListProps {
  control: Control<EmployeeFormData>;
  register: UseFormRegister<EmployeeFormData>;
  errors?: FieldErrors<EmployeeFormData>;
}

export default function AchievementsList({ control, register, errors }: AchievementsListProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'achievements',
  });

  const addAchievement = () => {
    append({ title: '', date: '', description: '' });
  };

  return (
    <div className="space-y-3">
      <label className="block font-semibold">Achievements</label>
      {fields.map((field, idx) => (
        <div key={field.id} className="border p-4 rounded space-y-2 bg-gray-50">
          <div className="flex justify-between">
            <span>Achievement #{idx + 1}</span>
            <button type="button" onClick={() => remove(idx)} className="text-red-600">Remove</button>
          </div>
          <input
            {...register(`achievements.${idx}.title`)}
            placeholder="Title *"
            className="border p-2 rounded w-full"
          />
          {errors?.achievements?.[idx]?.title && (
            <p className="text-red-500 text-sm">{errors.achievements[idx]?.title?.message}</p>
          )}
          <input
            {...register(`achievements.${idx}.date`)}
            type="date"
            className="border p-2 rounded w-full"
          />
          <textarea
            {...register(`achievements.${idx}.description`)}
            placeholder="Description"
            className="border p-2 rounded w-full"
            rows={2}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={addAchievement}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        + Add Achievement
      </button>
    </div>
  );
}