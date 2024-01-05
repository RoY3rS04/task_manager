import { Request, Response } from "express";
import User from "../models/User";
import { generateJWT } from "../helpers/generateJWT";
import jwt, { JwtPayload } from 'jsonwebtoken';

const authenticateUser = async (req: Request, res: Response) => {
    
    const { email, password } = req.body;

    try {

        const user = await User.getOne(email);

        if (!user) {
            return res.status(404).json({
                ok: false,
                msg: 'There\'s no user with those credentials or is unverified'
            })
        }
        
        if (!await User.verifyPassword(user.id, password)) {

            return res.status(400).json({
                ok: false,
                msg: 'The password you provided isn\'t correct'
            })
            
        }

        res.json({
            ok: true,
            token: generateJWT(user.id),
            msg: 'User verified correctly'
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

const verifyAccount = async (req: Request, res: Response) => {

    const { token } = req.params;

    try {
        
        const result = jwt.verify(token, <string>process.env.JWT_SECRET);

        const { userId } = <JwtPayload>result;

        const user = await User.getOne(userId, true);

        if (!user) {
            return res.status(404).json({
                ok: false,
                msg: 'The user does\'nt exists'
            });
        }

        if (user.state) {
            return res.json({
                ok: true,
                msg: 'Your account was already verified'
            })
        }

        await User.setState(userId, true);

        res.json({
            ok: true,
            msg: 'You have verified your account'
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

const getAuthUser = (req: Request, res: Response) => {

    const { user } = req;

    if (!user) {
        return res.status(404).json({
            ok: false,
            msg: 'You must login or register'
        })
    }

    res.json({
        ok: true,
        user,
        msg: 'Verification completed'
    })
}

export {
    authenticateUser,
    verifyAccount,
    getAuthUser
}