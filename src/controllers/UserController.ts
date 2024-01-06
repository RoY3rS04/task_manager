import { Request, Response } from "express";
import User from "../models/User.js";
import { UserInfo, UserResponse } from "../@types/UserInfo.js";
import { generateJWT } from "../helpers/generateJWT.js";
import sendMail from "../helpers/verifyEmail.js";
import { UploadedFile } from "express-fileupload";
import imageKit from "../helpers/imageKit.js";
import fs from 'fs/promises';

const getUsers = async (req: Request, res: Response) => {
    
    try {
        const users = await User.getAll();

        res.status(200).json({
            ok: true,
            users
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

const getUser = async (req: Request, res: Response) => {

    const { id } = req.params;

    try {
        
        const user = await User.getOne(Number(id));

        if (!user) {
            return res.status(404).json({
                ok: false,
                msg: 'The user is deleted or doesn\'t exists'
            })
        }

        res.status(200).json({
            ok: true,
            user
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

const createUser = async (req: Request, res: Response) => {

    const { name, email, password } = req.body;

    let imageUrl = '';
    let tempFile = '';

    if (req.files) {
        tempFile = (<UploadedFile>req.files.image).tempFilePath;
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
        
        const user = await User.create({
            name, 
            email,
            password,
            image_url: imageUrl ? imageUrl : 'https://ik.imagekit.io/4ztt7kzzm/default_user_image.png?updatedAt=1698091515542'
        });

        const token = generateJWT((<UserResponse>user).id);

        await sendMail({
            name,
            email,
            token
        });

        res.status(200).json({
            ok: true,
            msg: 'An email with further instructions has been sent to your email, please go check it'
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

const updateUser = async (req: Request, res: Response) => {

    const { id } = <UserResponse>req.user;
    const { name, password, new_password } = req.body;

    if (!name && !new_password) {
        return res.status(400).json({
            ok: false,
            msg: 'You must provide info to update your profile'
        })
    }

    if (!await User.verifyPassword(id, password)) {
        return res.status(400).json({
            ok: false,
            msg: 'The password you provided is incorrect'
        })
    }

    let imageUrl = '';
    let tempFile = '';

    if (req.files) {
        tempFile = (<UploadedFile>req.files.image).tempFilePath;
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

        const user = <UserResponse>await User.getOne(id);

        if (user.image_url.split('*').length > 1 && imageUrl) {
            const [, id] = user.image_url.split('*');

            await imageKit.deleteFile(id);
        }

        const updatedUser = await User.updateOne(Number(id), {
            name: name ? name : null,
            password: new_password ? new_password : null,
            image_url: imageUrl ? imageUrl : undefined
        });

        res.status(200).json({
            ok: true,
            user: updatedUser,
            msg: 'User updated correctly'
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

const deleteUser = async (req: Request, res: Response) => {

    const { id } = <UserResponse>req.user;
    const { password } = req.headers;

    if (!await User.verifyPassword(id, <string>password)) {
        return res.status(400).json({
            ok: false,
            msg: 'The password you provided is incorrect'
        })
    }

    try {
        
        const user = await User.deleteOne(id);

        res.status(200).json({
            ok: true,
            msg: 'User deleted correctly',
            user
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

const getUserTeam = async (req: Request, res: Response) => {

    const { id } = <UserResponse>req.user;

    try {
        
        const team = await User.getUserTeam(id);

        res.json({
            ok: true,
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

export {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    getUserTeam
}