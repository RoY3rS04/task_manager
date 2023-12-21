import { Request, Response } from "express";
import Task from "../models/Task.js";
import { TaskInfo } from "../@types/TaskInfo.js";

const getTask = async (req: Request, res: Response) => {

    const { id } = req.params;

    try {
        
        const task = await Task.getOne(Number(id));

        res.json({
            ok: true,
            task
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

const getTasks = async (req: Request, res: Response) => {

    try {
        
        const tasks = await Task.getAll();

        res.json({
            ok: true,
            tasks
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

const createTask = async (req: Request, res: Response) => {

    const { title, description, created_by } = req.body;

    try {
        
        const task = await Task.create({
            title,
            description,
            created_by: Number(created_by)
        })


        res.json({
            ok: true,
            task
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

const updateTask = async (req: Request, res: Response) => {

    const { id } = req.params;

    const { title, description } = req.body;

    try {
        
        const task = await Task.updateOne(Number(id), {
            title: title ? title : null,
            description: description ? description : null
        });

        res.json({
            ok: true,
            task
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

const deleteTask = async (req: Request, res: Response) => {

    const { id } = req.params;

    try {
        
        const task = await Task.deleteOne(Number(id));

        res.json({
            ok: true,
            task
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
    getTask,
    getTasks,
    createTask,
    updateTask,
    deleteTask
}