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

    try {
        
        const user = await User.getOne(Number(id));

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

const createUser = async (req: Request, res: Response) => {

    const { name, gmail, password } = req.body;

    try {
        
        const user = await User.create({
            name, 
            gmail,
            password
        });

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

const updateUser = async (req: Request, res: Response) => {

    const { id } = req.params;
    const { name, gmail, password } = req.body;

    try {
        
        const user = await User.updateOne(Number(id), {
            name: name ? name : null,
            gmail: gmail ? gmail : null,
            password: password ? password : null
        });

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

const deleteUser = async (req: Request, res: Response) => {
    
    const { id } = req.params;

    try {
        
        const user = await User.deleteOne(Number(id));

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
    getUser,
    createUser,
    updateUser,
    deleteUser
}