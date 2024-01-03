import { createUser, deleteUser, getUser, getUsers, updateUser } from "../controllers/UserController.js";
import { Router } from "express";
import { validateJWT } from "../middlewares/validateJWT.js";

const router = Router();

router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/', createUser);
router.patch('/', [validateJWT], updateUser);
router.delete('/', [validateJWT], deleteUser);

export default router;