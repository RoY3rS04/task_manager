import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../models/User';
import { NextFunction, Request, Response } from 'express';

const validateJWT = async (req: Request, res: Response, next: NextFunction) => {

    const token = req.header('x-token');

    if (!token) {
        return res.json({
            ok: false,
            msg: 'No token provided'
        })
    }

    try {

        const result = jwt.verify(token, <string>process.env.JWT_SECRET);

        const { userId } = <JwtPayload>result;

        const user = await User.getOne(userId);

        if (!user) {
            return res.json({
                ok: false,
                msg: 'The user doesn\'t exists'
            });
        }

        if (!user.state) {
            return res.json({
                ok: false,
                msg: 'The user was deleted'
            })
        }

        req.user = user;

        next();
    } catch (error) {
        res.json({
            ok: false,
            msg: 'Invalid Token'
        });
    }

}

export {
    validateJWT
}