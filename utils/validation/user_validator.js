import { check } from "express-validator";
import slugify from "slugify";
import bcryptjs from "bcryptjs";

import { userModel } from "../../model/user_model.js";
import { productModel } from "../../model/product_model.js";
import { validationMiddleWare } from "../../middleware/validation_middleware.js";


export const ceateUserValidation = [
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
    check("role").optional(),
    check("purchases").optional(),
    validationMiddleWare
];

export const updateUserValidation = [
    check("id").isMongoId().withMessage("invalid id format"),
    check("name").optional()
        .notEmpty()
        .withMessage("userName is required")
        .isLength({ min: 3 }).withMessage("to short userName")
        .isLength({ max: 35 }).withMessage("to long userName")
        .custom((val, { req }) => req.body.slug = slugify(val)),
    check("email").optional()
        .isEmail().withMessage("invalid email format"),
    check("role").optional(),
    check("purchases").optional(),
    validationMiddleWare
];

export const getUserValidation = [
    check("id").isMongoId().withMessage("invalid id format"),
    validationMiddleWare
];

export const deleteUserValidation = [
    check("id").isMongoId().withMessage("invalid id format"),
    validationMiddleWare
];

export const changePasswordValidation = [
    check("id").isMongoId().withMessage("invalid id format"),
    check("currentpassword")
        .notEmpty().withMessage("currentpassword is required"),
    check("confirmPassword")
        .notEmpty().withMessage("confirmPassword is required"),
    check("password")
        .isLength({min:6}).withMessage("to short password")
        .notEmpty().withMessage("password is required")
        .custom((val, { req }) => {
            if (val != req.body.confirmPassword) {
                throw new Error("incorrect confirmPassword ")
            }
            return true;
        })
        .custom(async (val, { req }) => {
            const user = await userModel.findById(req.params.id);
            if (!user) {
                throw new Error(`no user in this id : ${req.params.id}`)
            }
            if (!(await bcryptjs.compare(req.body.currentpassword, user.password))) {
                throw new Error(`incorrect current password`);
            }
            return true;
        }),
    validationMiddleWare
];

export const updatePurchasesValidation = [
    check("userId")
        .isMongoId().withMessage("invalid id format"),
    check("productId")
        .isMongoId().withMessage("invalid id format")
        .custom(async val => {
            const product = await productModel.findById(val);
            if (!product) {
                throw new Error(`no product in this Id : ${val}`);
            }
            return true;
        }),
    validationMiddleWare
];