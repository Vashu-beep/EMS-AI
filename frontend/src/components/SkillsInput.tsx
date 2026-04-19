'use client';
import { useState } from 'react';

interface SkillsInputProps {
  skills: string[];
  onChange: (skills: string[]) => void;
}

export default function SkillsInput({ skills, onChange }: SkillsInputProps) {
  const [newSkill, setNewSkill] = useState('');

  const addSkill = () => {
    const trimmed = newSkill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      onChange([...skills, trimmed]);
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    onChange(skills.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="block font-semibold mb-1">Skills</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {skills.map((skill, idx) => (
          <span key={idx} className="bg-gray-200 px-2 py-1 rounded flex items-center gap-1">
            {skill}
            <button type="button" onClick={() => removeSkill(idx)} className="text-red-500">×</button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addSkill()}
          placeholder="Add a skill"
          className="border p-2 rounded flex-1"
        />
        <button type="button" onClick={addSkill} className="bg-blue-500 text-white px-4 rounded">Add</button>
      </div>
    </div>
  );
}