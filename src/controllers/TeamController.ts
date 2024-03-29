import { Request, Response } from "express";
import TeamWork from "../models/TeamWork.js";
import { TeamResponse, TeamUsersResponse } from "../@types/TeamInfo.js";
import { UploadedFile } from "express-fileupload";
import fs from 'fs/promises';
import imageKit from "../helpers/imageKit.js";
import { UserResponse } from "../@types/UserInfo.js";
import jwt, { JwtPayload } from 'jsonwebtoken';

const getTeam = async (req: Request, res: Response) => {

    const { id } = req.params;
    const { with_users } = req.headers;

    try {

        let team: TeamUsersResponse<number|UserResponse[]>;
        
        if (with_users) {
            team = await TeamWork.getTeamUsers(Number(id), true);
        } else {
            team = await TeamWork.getTeamUsers(Number(id));
        }
 
        res.status(200).json({
            ok: true,
            team
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

const getTeams = async (req: Request, res: Response) => {

    try {

        const teams = await TeamWork.getAll();

        res.status(200).json({
            ok: true,
            teams
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
            image_url: imageUrl ? imageUrl : 'https://ik.imagekit.io/4ztt7kzzm/default_group_image.png?updatedAt=1699391215031'
        })


        res.status(200).json({
            ok: true,
            msg: 'Team created successfully',
            team
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
        const team = await TeamWork.getOne(Number(id));

        if (team.created_by !== created_by) {
            return res.status(401).json({
                ok: false,
                msg: 'You are not authorized to do this action'
            })
        }
    } catch (error) {
        return res.status(500).json({
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

        res.status(200).json({
            ok: true,
            msg: 'Team updated correctly',
            team: updatedTeam
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

const deleteTeam = async (req: Request, res: Response) => {

    const { id } = req.params;
    const { id: created_by } = <UserResponse>req.user;

    try {

        const team = await TeamWork.getOne(Number(id));

        if (team.created_by !== created_by) {
            return res.status(401).json({
                ok: false,
                msg: 'You are not authorized to do this action'
            })
        }

        const deletedTeam = await TeamWork.deleteOne(Number(id));

        res.status(200).json({
            ok: true,
            msg: 'Team deleted correctly',
            team: deletedTeam
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

const joinUser = async (req: Request, res: Response) => {

    const { token } = req.params;
    const { id } = <UserResponse>req.user;

    const { teamId } = <JwtPayload>jwt.verify(token, <string>process.env.JWT_SECRET);

    try {
        await TeamWork.joinUser(teamId, id);

        res.json({
            ok: true,
            msg: 'User joined to team successfully!'
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

    const { teamId, userId } = req.params;
    const { id } = <UserResponse>req.user;

    try {
        
        const team = await TeamWork.getOne(Number(teamId));

        if (team.created_by !== id && Number(userId) !== id) {
            return res.status(401).json({
                ok: false,
                msg: 'You are not authorized to do this'
            })
        }

        await TeamWork.removeUser(Number(teamId), Number(userId));

        res.status(200).json({
            ok: true,
            msg: 'User removed successfully from team'
        })

    } catch (error) {
        console.log(error);
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

const generateInvitationLink = async (req: Request, res: Response) => {
    
    const { teamId } = req.params;
    const { id } = <UserResponse>req.user;

    try {
        const team = await TeamWork.getOne(Number(teamId));

        if (team.created_by !== id) {
            return res.status(401).json({
                ok: false,
                msg: 'You are not authorized to do this action'
            })
        }

        const token = jwt.sign({
            teamId
        }, <string>process.env.JWT_SECRET, {
            expiresIn: '30d'
        })    

        res.json({
            ok: true,
            msg: 'Link generated successfully and copied to clipboard!',
            link: `${process.env.FRONTEND_URL}/teams/${token}`
        })
    } catch (error) {
        res.json({
            ok: false,
            msg: 'Something went wrong'
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
    removeUser,
    generateInvitationLink
}