import axios from 'axios';

const API_URL = 'https://ems-ai-1-cf6p.onrender.com/api/attendance';

const API_URL = 'https://ems-ai-1-cf6p.onrender.com/api/attendance'

export interface AttendanceRecord {
  _id?: string;
  employee: string | { _id: string; name: string; email: string; department: string };
  date: string;
  status: 'present' | 'absent' | 'half-day' | 'late';
  checkIn?: string;
  checkOut?: string;
  notes?: string;
}

export const getAttendanceByDate = async (date: string) => {
  const response = await axios.get(`${API_URL}?date=${date}`);
  return response.data;
};

export const bulkMarkAttendance = async (date: string, records: any[]) => {
  const response = await axios.post(`${API_URL}/bulk`, { date, records });
  return response.data;
};