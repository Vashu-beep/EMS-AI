import { Router } from 'express';
import { reviseSalary, getSalaryHistory } from '../controllers/salaryController';

const router = Router();

router.post('/revise', reviseSalary);
router.get('/history/:employeeId', getSalaryHistory);

export default router;