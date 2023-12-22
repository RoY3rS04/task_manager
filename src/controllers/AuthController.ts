import { Request, Response } from "express";
import User from "../models/User";
import { generateJWT } from "../helpers/generateJWT";

const authenticateUser = async (req: Request, res: Response) => {
    
    const { gmail, password } = req.body;

    try {

        const user = await User.getOne(gmail);

        if (!user) {
            return res.json({
                ok: false,
                msg: 'There\'s no user with those credentials'
            })
        }
        
        if (!await User.verifyPassword(user.id, password)) {

            return res.json({
                ok: false,
                msg: 'The password you provided isn\'t correct'
            })
            
        }

        res.json({
            ok: true,
            token: generateJWT(user.id)
        })

    } catch (error) {
        
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
    authenticateUser
}