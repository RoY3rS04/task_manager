import { createUser, deleteUser, getUser, getUserTeam, getUsers, updateUser } from "../controllers/UserController.js";
import { Router } from "express";
import { validateJWT } from "../middlewares/validateJWT.js";
import { check, body } from "express-validator";
import validateFields from "../middlewares/validateFields.js";
import validateRecord from "../helpers/dbValidator.js";

const router = Router();

router.get('/', getUsers);

router.get('/:id', [
    check('id', 'The id param must be an integer').isInt(),
    check('id').custom((v) => validateRecord('users', v)),
    validateFields
], getUser);

router.post('/', [
    check('name', 'The name field is required').trim().notEmpty(),
    check('email', 'The gmail field is required').trim().notEmpty().isEmail(),
    check('password', 'You must provide a password').trim().notEmpty(),
    validateFields
], createUser); //Done

router.patch('/', [
    validateJWT,
    body('name').trim(),
    body('password').trim(),
    body('new_password').trim()
], updateUser); //Done

router.delete('/', [validateJWT], deleteUser); //Done

router.get('/user/team', validateJWT, getUserTeam); //Done

export default router;