import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "userName required"]
    },
    slug: {
        type: String,
        tolowercase: true
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique:[true , "email address already used"],
        tolowercase: true
    },
    password: {
        type: String,
        required: [true, "password required"]
    },
    role: {
        type: String,
        enum: ["admin", "user", "super"],
        default:"user"
    },
    purchases: {
        type:[String]
    }

}, { timestamps: true });

userSchema.pre("save", async function () {
    this.password = await bcryptjs.hash(this.password, 12);
});

export const userModel = mongoose.model("users", userSchema);