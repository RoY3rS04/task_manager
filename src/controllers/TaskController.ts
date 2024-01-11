import { Request, Response } from "express";
import Task from "../models/Task.js";
import { TaskInfo, TaskResponse, TaskUsersResponse } from "../@types/TaskInfo.js";
import { UserResponse } from "../@types/UserInfo.js";

const getTask = async (req: Request, res: Response) => {

    const { id } = req.params;
    const { with_users } = req.body;

    try {
        
        let task: TaskResponse | TaskUsersResponse[];
        
        if (with_users) {
            task = await Task.getTasksUsers(Number(id));
        } else {
            task = <TaskResponse>await Task.getOne(Number(id));
        }

        res.json({
            ok: true,
            msg: 'Task found successfully',
            task
        })

    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({
                ok: false,
                msg: error.message
            })
        } 

        res.status(500).json({
            ok: false,
            msg: String(error)
        })
    }

}

const getTasks = async (req: Request, res: Response) => {

    const { id } = <UserResponse>req.user;
    const { with_users } = req.headers;

    try {
        
        const tasks = await Task.getAll(id, with_users ? true : false);

        //console.log('controller', tasks);

        res.json({
            ok: true,
            tasks
        })

    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({
                ok: false,
                msg: error.message
            })
        } 

        res.status(500).json({
            ok: false,
            msg: String(error)
        })
    }

}

const createTask = async (req: Request, res: Response) => {

    const { title, description } = req.body;
    const { id: created_by } = <UserResponse>req.user;

    try {
        
        const task = await Task.create({
            title,
            description,
            created_by: Number(created_by)
        })


        res.json({
            ok: true,
            msg: 'Task created successfully',
            task
        })

    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({
                ok: false,
                msg: error.message
            })
        } 

        res.status(500).json({
            ok: false,
            msg: String(error)
        })
    }

}

const updateTask = async (req: Request, res: Response) => {

    const { id } = req.params;
    const { id: created_by } = <UserResponse>req.user;
    const { title, description } = req.body;

    if (!title && !description) {
        return res.status(400).json({
            ok: false,
            msg: 'You must provide info to update the task'
        })
    }

    try {

        const task = <TaskResponse>await Task.getOne(Number(id));

        if (task.created_by !== created_by) {
            return res.status(401).json({
                ok: false,
                msg: 'Just the task creator is able to modify it'
            })
        }
        
        const updatedTask = await Task.updateOne(Number(id), {
            title: title ? title : null,
            description: description ? description : null
        });

        res.json({
            ok: true,
            msg: 'Task modified successfully',
            task: updatedTask
        })

    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({
                ok: false,
                msg: error.message
            })
        } 

        res.status(500).json({
            ok: false,
            msg: String(error)
        })
    }

}

const deleteTask = async (req: Request, res: Response) => {

    const { id } = req.params;
    const { id: created_by } = <UserResponse>req.user;

    try {

        const task = <TaskResponse>await Task.getOne(Number(id));

        if (task.created_by !== created_by) {
            return res.status(401).json({
                ok: false,
                msg: 'Just the task creator is able to delete it'
            })
        }
        
        const deletedTask = await Task.deleteOne(Number(id));

        res.json({
            ok: true,
            msg: 'Task deleted successfully',
            task: deletedTask
        })

    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({
                ok: false,
                msg: error.message
            })
        } 

        res.status(500).json({
            ok: false,
            msg: String(error)
        })
    }

}

const assignUser = async (req: Request, res: Response) => {

    const { task_id, user_id } = req.body;
    const { id: created_by } = <UserResponse>req.user;

    try {

        const task = <TaskResponse>await Task.getOne(Number(task_id));

        if (task.created_by !== created_by) {
            return res.status(401).json({
                ok: false,
                msg: 'Just the task creator is able to assign users to it'
            })
        }
        
        await Task.assignUser(task_id, user_id);

        res.json({
            ok: true,
            msg: 'User assigned to task correctly'
        })

    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({
                ok: false,
                msg: error.message
            })
        } 

        res.status(500).json({
            ok: false,
            msg: String(error)
        })
    }

}

const removeUser = async (req: Request, res: Response) => {

    const { taskId, userId } = req.params;
    const { id: created_by } = <UserResponse>req.user;

    try {

        const task = <TaskResponse>await Task.getOne(Number(taskId));

        if (task.created_by !== created_by) {
            return res.status(401).json({
                ok: false,
                msg: 'Just the task creator is able to remove users from it'
            })
        }
        
        await Task.removeUser(Number(taskId), Number(userId));

        res.json({
            ok: true,
            msg: 'User removed successfully from task'
        })

    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({
                ok: false,
                msg: error
            })
        } 

        res.status(500).json({
            ok: false,
            msg: String(error)
        })
    }

}

const completeTask = async(req:Request, res: Response) => {

    const user = <UserResponse>req.user;
    const { completed } = req.body;

    const { taskId } = req.params;

    try {
        
        const task = await Task.getOne(Number(taskId));

        if (task?.created_by !== user.id) {
            return res.status(401).json({
                ok: false,
                msg: 'You are not authorized to do this action'
            })
        }

        await Task.completeOrNotTask(Number(taskId), completed);

        res.json({
            ok: true,
            msg: 'Task updated correctly'
        })
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                ok: false,
                msg: 'Something went wrong'
            })
        }
    }

}

export {
    getTask,
    getTasks,
    createTask,
    updateTask,
    deleteTask,
    assignUser,
    removeUser,
    completeTask
}