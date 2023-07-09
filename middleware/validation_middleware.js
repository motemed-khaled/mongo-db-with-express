import { validationResult } from "express-validator";

export const validationMiddleWare = (req , res , next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
    }
    next();
}


