import mongoose from "mongoose";

export const connection = () => {
    return mongoose.connect(process.env.DB_URI).then(con => {
        console.log(`connected to database : ${con.connection.host}`);
    }).catch(err => {
        console.log(err)
    })
}