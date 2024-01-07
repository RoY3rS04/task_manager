import { Router } from "express";
import { assignUser, createTask, deleteTask, getTask, getTasks, removeUser, updateTask } from "../controllers/TaskController";
import { validateJWT } from "../middlewares/validateJWT";
import validateFields from "../middlewares/validateFields";
import { body, check } from "express-validator";
import validateRecord from "../helpers/dbValidator";

const router = Router();

router.get('/', validateJWT, getTasks);

router.get('/:id', [
    check('id', 'The param must be an integer').isInt(),
    check('id').custom((v) => validateRecord('tasks', v)),
    validateFields
], getTask);

router.post('/', [
    validateJWT,
    check('title', 'You must provide a title').trim().notEmpty(),
    check('description', 'You must provide a description').trim().notEmpty(),
    validateFields
], createTask);

router.patch('/:id', [
    validateJWT,
    check('id', 'The param must be an integer').isInt(),
    check('id').custom((v) => validateRecord('tasks', v)),
    body('title').trim(),
    body('description').trim(),
    validateFields
], updateTask);

router.delete('/:id', [
    validateJWT,
    check('id', 'The param must be an integer').isInt(),
    check('id').custom((v) => validateRecord('tasks', v)),
    validateFields
], deleteTask);

router.post('/users', [
    validateJWT,
    check('task_id', 'The field must be an integer').isInt(),
    check('task_id').custom((v) => validateRecord('tasks', v)),
    check('user_id', 'The field must be an integer').isInt(),
    check('user_id').custom((v) => validateRecord('users', v)),
    validateFields
], assignUser);

router.delete('/:taskId/users/:userId', [
    validateJWT,
    check('taskId', 'The field must be an integer').isInt(),
    check('taskId').custom((v) => validateRecord('tasks', v)),
    check('userId', 'The field must be an integer').isInt(),
    check('userId').custom((v) => validateRecord('users', v)),
    validateFields
], removeUser);

export default router;