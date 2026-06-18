import { Router } from 'express';
import {taskController} from "#controllers/taskController.js";

const router = Router();

router.get('/tasks', taskController.getTasks);
router.post('/tasks', taskController.createTask);
router.put('/tasks/:id/status', taskController.updateStatus);
router.delete('/tasks/:id', taskController.deleteTask);
router.get('/tasks/:id/audit-logs', taskController.getLogs);

export default router;