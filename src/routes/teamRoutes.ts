import { Router } from "express";
import { createTeam, deleteTeam, generateInvitationLink, getTeam, getTeams, joinUser, removeUser, updateTeam } from "../controllers/TeamController";
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

router.post('/:token/users', [
    validateJWT
], joinUser); //Done

router.delete('/:teamId/users/:userId', [
    validateJWT,
    check('teamId', 'The parameter must be and integer').isInt(),
    check('teamId').custom((v) => validateRecord('teams', v)),
    check('userId', 'The parameter must be and integer'),
    check('userId').custom((v) => validateRecord('users', v)),
    validateFields
], removeUser); //Done

router.get('/generate-link/:teamId', [
    validateJWT,
    check('teamId', 'The parameter must be and integer').isInt(),
    check('teamId').custom((v) => validateRecord('teams', v)),
    validateFields
], generateInvitationLink); //Done

export default router;