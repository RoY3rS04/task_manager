import { Router } from "express";
import { createTeam, deleteTeam, getTeam, getTeams, joinUser, removeUser, updateTeam } from "../controllers/TeamController";

const router = Router();

router.get('/', getTeams);
router.get('/:id', getTeam);
router.post('/', createTeam);
router.patch('/:id', updateTeam);
router.delete('/:id', deleteTeam);
router.post('/users', joinUser);
router.delete('/:teamId/users/:userId', removeUser);

export default router;