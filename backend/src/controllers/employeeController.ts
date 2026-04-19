import { Request, Response } from 'express';
import Employee from '../models/Employee';
import Attendance from '../models/Attendance';
import SalaryHistory from '../models/SalaryHistory';

export const getEmployees = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, search, department } = req.query;
    const filter: any = { isActive: true };
    if (search) filter.$or = [
      { firstName: new RegExp(String(search), 'i') },
      { lastName: new RegExp(String(search), 'i') },
      { email: new RegExp(String(search), 'i') }
    ];
    if (department) filter.department = department;

    const employees = await Employee.find(filter)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 });
    const total = await Employee.countDocuments(filter);
    res.json({ employees, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getEmployeeById = async (req: Request, res: Response) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ error: 'Employee not found' });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const createEmployee = async (req: Request, res: Response) => {
  try {
    const employee = new Employee(req.body);
    await employee.save();
    res.status(201).json(employee);
  } catch (error: any) {
    if (error.code === 11000) return res.status(400).json({ error: 'Email already exists' });
    res.status(400).json({ error: error.message });
  }
};

export const updateEmployee = async (req: Request, res: Response) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!employee) return res.status(404).json({ error: 'Employee not found' });
    res.json(employee);
  } catch (error) {
    res.status(400).json({ error: 'Update failed' });
  }
};

export const deleteEmployee = async (req: Request, res: Response) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, { isActive: false });
    if (!employee) return res.status(404).json({ error: 'Employee not found' });
    res.json({ message: 'Employee deactivated' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const uploadResume = async (req: Request, res: Response) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ error: 'Employee not found' });
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    employee.resumePath = req.file.path;
    await employee.save();
    res.json({ message: 'Resume uploaded', path: employee.resumePath });
  } catch (error) {
    res.status(500).json({ error: 'Upload failed' });
  }
};