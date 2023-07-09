import dotenv from "dotenv";
import express from "express";
import path from "path";

import { connection } from "./database/config.js";
import { globalError } from "./middleware/error_middleware.js";
//routes
import { router as productRoutes } from "./routes/productRoutes.js";
import { router as userRoutes } from "./routes/userRoutes.js";
import { router as authRoutes } from "./routes/authRoutes.js";

dotenv.config();
const app = express();

// connect to database
connection();

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// serve all file
app.use(express.static(path.join(path.dirname("uploads", "uploads"))));

// mount routes
app.use('/api/v1/product', productRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/auth', authRoutes);


//global error 
app.use(globalError);




const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`app run in port : ${PORT}`);
})




