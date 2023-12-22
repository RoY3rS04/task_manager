import { Request, Response } from "express";
import TeamWork from "../models/TeamWork.js";

const getTeam = async (req: Request, res: Response) => {

    const { id } = req.params;

    try {

        const team = await TeamWork.getOne(Number(id));

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

export {
    getTeam,
    getTeams,
    createTeam,
    updateTeam,
    deleteTeam
}