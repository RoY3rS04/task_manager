import { Router } from "express";
import { createTeam, deleteTeam, getTeam, getTeams, joinUser, removeUser, updateTeam } from "../controllers/TeamController";
import { validateJWT } from "../middlewares/validateJWT";

const router = Router();

router.get('/', getTeams);
router.get('/:id', getTeam);
router.post('/', [validateJWT], createTeam);
router.patch('/:id', [validateJWT], updateTeam);
router.delete('/:id', [validateJWT], deleteTeam);
router.post('/users', [validateJWT], joinUser);
router.delete('/:teamId/users/:userId',[validateJWT], removeUser);

export default router;