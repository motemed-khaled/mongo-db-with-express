import express from "express";

import { auth as protectRoute , allowedTo} from "../controller/authController.js";
import {
    craeteUser,
    deleteUser,
    getAllUser,
    getUser,
    updateUser,
    changePassword,
    updatePurchases
} from "../controller/userController.js";

import {
    ceateUserValidation,
    deleteUserValidation,
    getUserValidation,
    updateUserValidation,
    changePasswordValidation,
    updatePurchasesValidation
} from "../utils/validation/user_validator.js";


export const router = express.Router();
// change user password
router.post("/changepassword/:id", changePasswordValidation, changePassword);

//add product to purchased

router.post("/user/:userId/product/:productId",protectRoute,updatePurchasesValidation, updatePurchases);

router
    .route("/")
    .post(protectRoute, allowedTo("super"), ceateUserValidation, craeteUser)
    .get(protectRoute, allowedTo("super"), getAllUser)

router
    .route("/:id")
    .get(protectRoute, allowedTo("super"),getUserValidation, getUser)
    .put(protectRoute, allowedTo("super"),updateUserValidation,updateUser)
    .delete(protectRoute, allowedTo("super"),deleteUserValidation, deleteUser)