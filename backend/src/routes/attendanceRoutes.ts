
import { Router } from 'express';
import { markAttendance, getAttendanceByEmployee, getAllAttendanceByMonth } from '../controllers/attendanceController';

const router = Router();

router.post('/', markAttendance);
router.get('/employee', getAttendanceByEmployee);
router.get('/month', getAllAttendanceByMonth);

export default router;
