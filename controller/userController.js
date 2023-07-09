import { userModel } from "../model/user_model.js";
import asyncHandler from "express-async-handler";
import bcryptjs from "bcryptjs";

import { Api_Error } from "../utils/api-error.js";
import {
    createOne,
    deleteOne,
    getAll,
    getOne,
    updateOne
} from "./refactor_handle.js";

export const craeteUser = createOne(userModel);
export const getAllUser = getAll(userModel, "user");
export const getUser = getOne(userModel);
export const deleteUser = deleteOne(userModel)

export const updatePurchases = asyncHandler(async (req, res, next) => {
    
    const user = await userModel.findById(req.params.userId);
    if (!user) {
        return next(new Api_Error(`no user in this id : ${req.params.userId}`, 404))
    }

    if (user.purchases.includes(req.params.productId)) {
        return next(new Api_Error("You have already purchased this product", 400));
    }
    
    const newUser = await userModel.findByIdAndUpdate(
        req.params.userId,
        { $push: { purchases: req.params.productId } },
        { new: true }
    );

    res.status(200).json({ data1: newUser });
    
});

export const updateUser = asyncHandler(async (req, res, next) => {
    const document = await userModel.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            slug : req.body.slug,
            email: req.body.email,
            role: req.body.role
        },
        { new: true }
    );
    if (!document) {
        return next(new Api_Error(`no user in this id : ${req.params.id}`, 404))
    }
    res.status(200).json({ data: document })
});

export const changePassword = asyncHandler(async (req, res, next) => {
    const document = await userModel.findByIdAndUpdate(
        req.params.id,
        {
            password: await bcryptjs.hash(req.body.password, 12)
        },
        { new: true }
    );
    if (!document) {
        return next(new Api_Error(`no product in this id : ${req.params.id}`, 404))
    }
    res.status(200).json({ data: document });
});