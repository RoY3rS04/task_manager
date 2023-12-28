import { Router } from "express";
import { assignUser, createTask, deleteTask, getTask, getTasks, removeUser, updateTask } from "../controllers/TaskController";
import { validateJWT } from "../middlewares/validateJWT";

const router = Router();

router.get('/', getTasks);
router.get('/:id', getTask);
router.post('/', [validateJWT], createTask);
router.patch('/:id', [validateJWT], updateTask);
router.delete('/:id', [validateJWT] ,deleteTask);
router.post('/users', [validateJWT] ,assignUser);
router.delete('/:taskId/users/:userId', [validateJWT], removeUser);

export default router;