import { Request, Response } from 'express';
import Employee from '../models/Employee';
import SalaryHistory from '../models/SalaryHistory';

export const reviseSalary = async (req: Request, res: Response) => {
  try {
    const { employeeId, newSalary, reason } = req.body;
    const employee = await Employee.findById(employeeId);
    if (!employee) return res.status(404).json({ error: 'Employee not found' });
    const oldSalary = employee.currentSalary;
    employee.currentSalary = newSalary;
    await employee.save();
    const history = new SalaryHistory({ employeeId, oldSalary, newSalary, reason });
    await history.save();
    res.json({ employee, history });
  } catch (error) {
    res.status(400).json({ error: 'Salary revision failed' });
  }
};

export const getSalaryHistory = async (req: Request, res: Response) => {
  try {
    const history = await SalaryHistory.find({ employeeId: req.params.employeeId }).sort({ effectiveDate: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};