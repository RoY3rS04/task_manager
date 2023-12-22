import { createUser, deleteUser, getUser, getUsers, updateUser } from "../controllers/UserController.js";
import { Router } from "express";

const router = Router();

router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/', createUser);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;