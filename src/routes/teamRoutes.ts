import { Router } from "express";
import { createTeam, deleteTeam, getTeam, getTeams, updateTeam } from "../controllers/TeamController";

const router = Router();

router.get('/', getTeams);
router.get('/:id', getTeam);
router.post('/', createTeam);
router.patch('/:id', updateTeam);
router.delete('/:id', deleteTeam);

export default router;