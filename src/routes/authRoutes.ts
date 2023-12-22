import { Router } from "express";
import { authenticateUser } from "../controllers/AuthController";
import { validateJWT } from "../middlewares/validateJWT";

const router = Router();

router.post('/login', authenticateUser);

export default router;