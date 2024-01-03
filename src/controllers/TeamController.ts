import { Request, Response } from "express";
import TeamWork from "../models/TeamWork.js";
import { TeamResponse, TeamUsersResponse } from "../@types/TeamInfo.js";
import { UploadedFile } from "express-fileupload";
import fs from 'fs/promises';
import imageKit from "../helpers/imageKit.js";
import { UserResponse } from "../@types/UserInfo.js";

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

    const { name } = req.body;
    const { id: created_by } = <UserResponse>req.user;

    let imageUrl = '';
    let tempFile = '';

    if (req.files) {
        tempFile = (<UploadedFile>req.files.image).tempFilePath;
    }

    if (tempFile) {

        const file = await fs.readFile(tempFile);
        
        const {url, fileId} = await imageKit.upload({
            file,
            fileName: 'team_image'
        });

        imageUrl = `${url}*${fileId}`;
    }

    try {

        const team = await TeamWork.create({
            name,
            created_by: Number(created_by),
            image_url: imageUrl ? imageUrl : undefined
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
    const { id: created_by } = <UserResponse>req.user;
    const { name } = req.body;

    let imageUrl = '';
    let tempFile = '';

    if (req.files) {
        tempFile = (<UploadedFile>req.files.image).tempFilePath;
    }

    try {
        const task = await TeamWork.getOne(Number(id));

        if (task.created_by !== created_by) {
            return res.json({
                ok: false,
                msg: 'You are not authorized to do this action'
            })
        }
    } catch (error) {
        return res.json({
            ok: false,
            msg: 'Something went wrong'
        })
    }

    if (tempFile) {

        const file = await fs.readFile(tempFile);
        
        const {url, fileId} = await imageKit.upload({
            file,
            fileName: 'user_image'
        });

        imageUrl = `${url}*${fileId}`;
    }

    try {

        const team = <TeamResponse>await TeamWork.getOne(Number(id));

        if (team.image_url.split('*').length > 1 && imageUrl) {
            const [, id] = team.image_url.split('*');

            await imageKit.deleteFile(id);
        }

        const updatedTeam = await TeamWork.updateOne(Number(id), {
            name: name ? name : null,
            image_url: imageUrl ? imageUrl : undefined
        });

        res.json({
            ok: true,
            team: updatedTeam
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
    const { id: created_by } = <UserResponse>req.user;

    try {

        const team = await TeamWork.getOne(Number(id));

        if (team.created_by !== created_by) {
            return res.json({
                ok: false,
                msg: 'You are not authorized to do this action'
            })
        }

        const deletedTeam = await TeamWork.deleteOne(Number(id));

        res.json({
            ok: true,
            team: deletedTeam
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
    const { id: created_by } = <UserResponse>req.user;

    try {
        
        const team = await TeamWork.getOne(Number(team_id));

        if (team.created_by !== created_by) {
            return res.json({
                ok: false,
                msg: 'You are not authorized to do this'
            })
        }

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
    const { id: created_by } = <UserResponse>req.user;

    try {
        
        const team = await TeamWork.getOne(Number(teamId));

        if (team.created_by !== created_by) {
            return res.json({
                ok: false,
                msg: 'You are not authorized to do this'
            })
        }

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