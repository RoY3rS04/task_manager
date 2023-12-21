import { Request, Response } from "express";
import User from "../models/User.js";

const getUsers = async (req: Request, res: Response) => {
    
    try {
        const users = await User.getAll();

        res.json({
            ok: true,
            users
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

const getUser = async (req: Request, res: Response) => {

    const { id } = req.params;

    const userId = Number(id);

    try {
        
        const user = await User.getOne(userId);

        res.json({
            ok: true,
            user
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
    getUsers,
    getUser
}