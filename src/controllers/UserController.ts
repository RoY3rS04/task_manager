import { Request, Response } from "express";
import User from "../models/User.js";
import { UserResponse } from "../@types/UserInfo.js";
import { generateJWT } from "../helpers/generateJWT.js";
import sendMail from "../helpers/verifyEmail.js";
import { UploadedFile } from "express-fileupload";
import imageKit from "../helpers/imageKit.js";
import fs from 'fs/promises';

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
            gmail,
            password,
            image_url: imageUrl ? imageUrl : undefined
        });

        const token = generateJWT((<UserResponse>user).id);

        await sendMail({
            name,
            gmail,
            token
        });

        res.json({
            ok: true,
            msg: 'An email with further instructions has been sent to your email, please go check it'
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

    const { id } = <UserResponse>req.user;
    const { name, password } = req.body;

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
            password: password ? password : null,
            image_url: imageUrl ? imageUrl : undefined
        });

        res.json({
            ok: true,
            user: updatedUser
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