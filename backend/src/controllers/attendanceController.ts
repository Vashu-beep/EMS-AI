import { Request, Response } from 'express';
import Attendance from '../models/Attendance';

export const markAttendance = async (req: Request, res: Response) => {
  try {
    const { employeeId, date, status, checkInTime, checkOutTime, remarks } = req.body;
    const attendance = await Attendance.findOneAndUpdate(
      { employeeId, date: new Date(date) },
      { status, checkInTime, checkOutTime, remarks },
      { upsert: true, new: true }
    );
    res.status(201).json(attendance);
  } catch (error) {
    res.status(400).json({ error: 'Failed to mark attendance' });
  }
};

export const getAttendanceByEmployee = async (req: Request, res: Response) => {
  try {
    const { employeeId, month, year } = req.query;
    const startDate = new Date(Number(year), Number(month) - 1, 1);
    const endDate = new Date(Number(year), Number(month), 0);
    const records = await Attendance.find({
      employeeId,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: 1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getAllAttendanceByMonth = async (req: Request, res: Response) => {
  try {
    const { month, year } = req.query;
    const startDate = new Date(Number(year), Number(month) - 1, 1);
    const endDate = new Date(Number(year), Number(month), 0);
    const records = await Attendance.find({
      date: { $gte: startDate, $lte: endDate }
    }).populate('employeeId', 'firstName lastName');
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};