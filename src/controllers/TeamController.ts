import { Request, Response } from "express";
import TeamWork from "../models/TeamWork.js";
import { TeamResponse, TeamUsersResponse } from "../@types/TeamInfo.js";

const getTeam = async (req: Request, res: Response) => {

    const { id } = req.params;
    const { with_users } = req.body;

    try {

        let team: TeamResponse | TeamUsersResponse;
        
        if (with_users) {
            team = await TeamWork.getTeamUsers(Number(id));
        } else {
            team = await TeamWork.getOne(Number(id));
        }
 
        res.json({
            ok: true,
            team
        })

    } catch (error) {
        if (error instanceof Error) {
            return res.json({
                ok: false,
                msg: error.message
            })
        }

        res.json({
            ok: false,
            msg: String(error)
        })
    }

}

const getTeams = async (req: Request, res: Response) => {

    try {

        const teams = await TeamWork.getAll();

        res.json({
            ok: true,
            teams
        })

    } catch (error) {
        if (error instanceof Error) {
            return res.json({
                ok: false,
                msg: error.message
            })
        }

        res.json({
            ok: false,
            msg: String(error)
        })
    }

}

const createTeam = async (req: Request, res: Response) => {

    const { name, created_by } = req.body;

    try {

        const team = await TeamWork.create({
            name,
            created_by: Number(created_by)
        })


        res.json({
            ok: true,
            team
        })

    } catch (error) {
        if (error instanceof Error) {
            return res.json({
                ok: false,
                msg: error.message
            })
        }

        res.json({
            ok: false,
            msg: String(error)
        })
    }

}

const updateTeam = async (req: Request, res: Response) => {

    const { id } = req.params;

    const { name } = req.body;

    try {

        const team = await TeamWork.updateOne(Number(id), name);

        res.json({
            ok: true,
            team
        })

    } catch (error) {
        if (error instanceof Error) {
            return res.json({
                ok: false,
                msg: error.message
            })
        }

        res.json({
            ok: false,
            msg: String(error)
        })
    }

}

const deleteTeam = async (req: Request, res: Response) => {

    const { id } = req.params;

    try {

        const team = await TeamWork.deleteOne(Number(id));

        res.json({
            ok: true,
            team
        })

    } catch (error) {
        if (error instanceof Error) {
            return res.json({
                ok: false,
                msg: error.message
            })
        }

        res.json({
            ok: false,
            msg: String(error)
        })
    }

}

const joinUser = async (req: Request, res: Response) => {

    const { team_id, user_id } = req.body;

    try {
        
        await TeamWork.joinUser(team_id, user_id);

        res.json({
            ok: true,
            msg: 'User joined to team correctly'
        })

    } catch (error) {
        if (error instanceof Error) {
            return res.json({
                ok: false,
                msg: error.message
            })
        } 

        res.json({
            ok: false,
            msg: String(error)
        })
    }

}

const removeUser = async (req: Request, res: Response) => {

    const { teamId, userId } = req.params;

    try {
        
        await TeamWork.removeUser(Number(teamId), Number(userId));

        res.json({
            ok: true,
            msg: 'User removed successfully from team'
        })

    } catch (error) {
        console.log(error);
        if (error instanceof Error) {
            return res.json({
                ok: false,
                msg: error
            })
        } 

        res.json({
            ok: false,
            msg: String(error)
        })
    }

}

export {
    getTeam,
    getTeams,
    createTeam,
    updateTeam,
    deleteTeam,
    joinUser,
    removeUser
}