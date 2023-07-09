import { check } from "express-validator";
import slugify from "slugify";

import { validationMiddleWare } from "../../middleware/validation_middleware.js";


export const createProductValidation = [
    check("title")
        .notEmpty().withMessage("product title is required")
        .isLength({ min: 3 }).withMessage("to short product name")
        .isLength({ max: 35 }).withMessage("to long product name")
        .custom((val, { req }) => req.body.slug = slugify(val)),
    check("descreption")
        .notEmpty().withMessage("product descreption is required")
        .isLength({ min: 10 }).withMessage("to short descreption name")
        .isLength({ max: 100 }).withMessage("to long descreption name"),
    check("price")
        .notEmpty().withMessage("product price is required")
        .isNumeric().withMessage("product price must be number"),
    check("priceAfterDiscount").optional()
        .isNumeric().withMessage("product priceAfterDiscount must be number")
        .custom((val, { req }) => {
            if (val > req.body.price) {
                throw new Error("priceAfterDiscount must be less than price")
            }
            return true;
        }),
    check("imageCover")
        .notEmpty().withMessage("product imageCover is required"),
    validationMiddleWare
];

export const updateProductValidation = [
    check("id").isMongoId().withMessage("invalid id format"),
    check("title").optional()
        .notEmpty().withMessage("product title is required")
        .isLength({ min: 3 }).withMessage("to short product name")
        .isLength({ max: 35 }).withMessage("to long product name")
        .custom((val, { req }) => req.body.slug = slugify(val)),
    check("descreption").optional()
        .notEmpty().withMessage("product descreption is required")
        .isLength({ min: 10 }).withMessage("to short descreption name")
        .isLength({ max: 100 }).withMessage("to long descreption name"),
    check("price").optional()
        .notEmpty().withMessage("product price is required")
        .isNumeric().withMessage("product price must be number"),
    check("priceAfterDiscount").optional()
        .isNumeric().withMessage("product priceAfterDiscount must be number")
        .custom((val, { req }) => {
            if (val > req.body.price) {
                throw new Error("priceAfterDiscount must be less than price")
            }
            return true;
        }),
    check("imageCover").optional()
        .notEmpty().withMessage("product imageCover is required"),
    validationMiddleWare
];

export const getSpecificProductValidation = [
    check("id").isMongoId().withMessage("invalid id format"),
    validationMiddleWare
];

export const deleteProductValidation = [
    check("id").isMongoId().withMessage("invalid id format"),
    validationMiddleWare
];