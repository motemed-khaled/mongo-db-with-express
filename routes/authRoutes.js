import express from "express";


import { signUp , login } from "../controller/authController.js";
import { signUpValidation , loginValidation } from "../utils/validation/auth_Validator.js";



export const router = express.Router();

router.post("/signup", signUpValidation, signUp);
router.post("/login", loginValidation, login);
