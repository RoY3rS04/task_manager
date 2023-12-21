import { getUser, getUsers } from "../controllers/UserController.js";
import { Router } from "express";

const router = Router();

router.get('/', getUsers);
router.get('/:id', getUser);

export default router;