import { Router } from "express";
import { assignUser, createTask, deleteTask, getTask, getTasks, removeUser, updateTask } from "../controllers/TaskController";

const router = Router();

router.get('/', getTasks);
router.get('/:id', getTask);
router.post('/', createTask);
router.patch('/:id', updateTask);
router.delete('/:id', deleteTask);
router.post('/users', assignUser);
router.delete('/:taskId/users/:userId', removeUser);

export default router;