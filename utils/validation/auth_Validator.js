import { check } from "express-validator";
import slugify from "slugify";

import { validationMiddleWare } from "../../middleware/validation_middleware.js";

export const signUpValidation = [
    check("name")
        .notEmpty()
        .withMessage("userName is required")
        .isLength({ min: 3 }).withMessage("to short userName")
        .isLength({ max: 40 }).withMessage("to long userName")
        .custom((val, { req }) => req.body.slug = slugify(val)),
    check("email")
        .isEmail().withMessage("invalid email format"),
    check("password")
        .notEmpty().withMessage("password is required")
        .isLength({ min: 6 }).withMessage("to short password")
        .custom((val, { req }) => {
            if (val != req.body.confirmPassword) {
                throw new Error("incorrect confirm password")
            }
            return true;
        }),
    check("confirmPassword").notEmpty().withMessage("confirmPassword is required"),
    validationMiddleWare
];

export const loginValidation = [
    check("email").isEmail().withMessage("invalid email format"),
    validationMiddleWare
];