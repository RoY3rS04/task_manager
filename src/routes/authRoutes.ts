import { Router } from "express";
import { authenticateUser, verifyAccount } from "../controllers/AuthController";
import { check } from "express-validator";
import validateFields from "../middlewares/validateFields";

const router = Router();

router.post('/login', [
    check('gmail', 'You must provide your gmail').trim().notEmpty().isEmail(),
    check('password', 'You must provide your password').trim().notEmpty(),
    validateFields
], authenticateUser);

router.get('/confirm/:token', verifyAccount);

export default router;