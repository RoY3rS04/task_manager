import { Router } from "express";
import { createTeam, deleteTeam, getTeam, getTeams, joinUser, removeUser, updateTeam } from "../controllers/TeamController";
import { validateJWT } from "../middlewares/validateJWT";
import { check } from "express-validator";
import validateFields from "../middlewares/validateFields";
import validateRecord from "../helpers/dbValidator";

const router = Router();

router.get('/', getTeams);

router.get('/:id', [
    check('id', 'The id param must be an integer').isInt(),
    check('id').custom((v) => validateRecord('teams', v)),
    validateFields
], getTeam); //Done

router.post('/', [
    validateJWT,
    check('name', 'You must provide a name to create the team').trim().notEmpty(),
    validateFields
], createTeam); //Done

router.patch('/:id', [
    validateJWT,
    check('id', 'The id param must be an integer').isInt(),
    check('id').custom((v) => validateRecord('teams', v)),
    check('name', 'You must provide a name to update the team').trim().notEmpty(),
    validateFields
], updateTeam); //Done

router.delete('/:id', [
    validateJWT,
    check('id', 'The id param must be an integer').isInt(),
    check('id').custom((v) => validateRecord('teams', v)),
    validateFields
], deleteTeam); //Done

router.post('/users', [
    validateJWT,
    check('team_id', 'You must provide an integer for this field').isInt(),
    check('team_id').custom((v) => validateRecord('teams', v)),
    check('user_id', 'You must provide an integer for this field').isInt(),
    check('user_id').custom((v) => validateRecord('users', v)),
    validateFields
], joinUser);

router.delete('/:teamId/users/:userId', [
    validateJWT,
    check('teamId', 'The parameter must be and integer').isInt(),
    check('teamId').custom((v) => validateRecord('teams', v)),
    check('userId', 'The parameter must be and integer'),
    check('userId').custom((v) => validateRecord('users', v)),
    validateFields
], removeUser);

export default router;