import express from "express";

import { auth as protectRoute , allowedTo} from "../controller/authController.js";
import {
    craeteProduct,
    getAllProduct,
    getSpecificProduct,
    updateProduct,
    deleteProduct,
    imageProcessing,
    uploadProductImage
} from "../controller/productController.js";
import {
    createProductValidation,
    getSpecificProductValidation,
    updateProductValidation,
    deleteProductValidation
} from "../utils/validation/product_validator.js";


export const router = express.Router();

router
    .route("/")
    .post(protectRoute, allowedTo("super" , "admin"),uploadProductImage,imageProcessing,createProductValidation, craeteProduct)
    .get(getAllProduct)

router
    .route("/:id")
    .get(getSpecificProductValidation, getSpecificProduct)
    .put(protectRoute, allowedTo("super" , "admin"),updateProductValidation, updateProduct)
    .delete(protectRoute, allowedTo("super"),deleteProductValidation , deleteProduct)