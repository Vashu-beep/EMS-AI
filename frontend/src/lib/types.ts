// frontend/src/lib/types.ts
export interface Project {
  name: string;
  description?: string;
  role?: string;
  technologies?: string[];
  startDate?: string;
  endDate?: string;
}

export interface Achievement {
  title: string;
  date?: string;
  description?: string;
}

export interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department: string;
  position: string;
  profileImage?: string;
  resumePath?: string;
  skills: string[];
  projects: Project[];
  achievements: Achievement[];
  currentSalary: number;
  joiningDate: string;
  isActive: boolean;
}

export interface AttendanceRecord {
  _id: string;
  employeeId: string | { _id: string; firstName: string; lastName: string };
  date: string;
  status: 'present' | 'absent' | 'late';
  checkInTime?: string;
  checkOutTime?: string;
  remarks?: string;
}

export interface ApiResponse<T> {
  employees?: T[];
  employee?: T;
  total?: number;
  page?: number;
  pages?: number;
}