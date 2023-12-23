import { Router } from "express";
import { authenticateUser, verifyAccount } from "../controllers/AuthController";

const router = Router();

router.post('/login', authenticateUser);
router.get('/confirm/:token', verifyAccount);

export default router;