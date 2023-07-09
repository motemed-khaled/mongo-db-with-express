import asyncHandler from "express-async-handler";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

import { Api_Error } from "../utils/api-error.js";
import { userModel } from "../model/user_model.js";

const generateToken = (pyload) =>
    jwt.sign({ userId: pyload }, process.env.JWT_SECRET_KEY, { expiresIn: "10d" });

export const signUp = asyncHandler(async (req, res) => {
    
    const user = await userModel.create({
        name: req.body.name,
        slug: req.body.slug,
        email: req.body.email,
        password: req.body.password
    })

    const token = generateToken(user._id);

    res.status(201).json({ data: user , token:token });
});

export const login = asyncHandler(async (req, res, next) => {
    const user = await userModel.findOne({ email: req.body.email });

    if (!user || !(await bcryptjs.compare(req.body.password, user.password))) {
        return next(new Api_Error("inavlid creditional", 401));
    }

    const token = generateToken(user._id);

    res.status(200).json({ data: user , token:token});
});

export const auth = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
        return next(new Api_Error("un authenticated please login again", 401));
    }
    //verify token
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.userId = decode.userId;
    next();

});

export const allowedTo = (...roles) => asyncHandler(async (req, res, next) => {

    const user = await userModel.findById(req.userId, { role: 1 });
    if (!roles.includes(user.role)) {
        return next(new Api_Error("you dont allow access this route", 401))
    }
    next();
});