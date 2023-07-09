import multer from "multer";
import sharp from "sharp";
import asyncHandler from 'express-async-handler';
import { uid } from "uid";

import { productModel } from "../model/product_model.js";
import { deleteOne, updateOne, getOne, getAll, createOne } from "./refactor_handle.js";
import { Api_Error } from "../utils/api-error.js";


const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb(new Api_Error("Only Images Allowed", 400), false);
    }
};

const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: multerFilter
});

export const uploadProductImage = upload.single("imageCover");

export const imageProcessing = asyncHandler(async (req, res, next) => {
    if (req.file) {
        const fileName = `product-${uid()}-${Date.now()}.jpeg`
        await sharp(req.file.buffer)
            .resize(500, 500)
            .toFormat("jpeg")
            .jpeg({ quality: 90 })
            .toFile(`uploads/product/${fileName}`);
        req.body.imageCover = fileName;
    }
    next();
});

export const craeteProduct = createOne(productModel);

export const getAllProduct =getAll(productModel , "product") ;

export const getSpecificProduct = getOne(productModel);

export const updateProduct = updateOne(productModel)

export const deleteProduct = deleteOne(productModel);