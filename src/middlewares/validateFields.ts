import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

const validateFields = (req: Request, res: Response, next: NextFunction) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            ok: false,
            msg: 'Please provide the data correctly'
        });
    }

    next();
}

export default validateFields;