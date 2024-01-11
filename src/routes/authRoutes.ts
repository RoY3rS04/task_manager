import { Router } from "express";
import { authenticateUser, getAuthUser, verifyAccount } from "../controllers/AuthController";
import { check } from "express-validator";
import validateFields from "../middlewares/validateFields";
import { validateJWT } from "../middlewares/validateJWT";

const router = Router();

router.post('/login', [
    check('email', 'You must provide your email').trim().notEmpty().isEmail(),
    check('password', 'You must provide your password').trim().notEmpty(),
    validateFields
], authenticateUser); //Done

router.get('/confirm/:token', verifyAccount); //Done

router.get('/self', validateJWT, getAuthUser); //Done

export default router;