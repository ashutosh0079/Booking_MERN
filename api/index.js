import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authroute from "./routes/auth.js"
import hotelroute from "./routes/hotels.js"
import roomroute from "./routes/rooms.js"
import usersroute from"./routes/users.js"
import cookieParser from "cookie-parser";
const app = express();
dotenv.config()

const connect = async()=>{
try{
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to mongoDB");
}catch(error){
    throw error;
}
};

mongoose.connection.on("disconnected",()=>{
    console.log("mongoDB disconnected");
})
mongoose.connection.on("connected",()=>{
    console.log("mongoDB connected");
})

//middlewares
app.use(cookieParser())
app.use(express.json())

app.use("/api/auth",authroute);
app.use("/api/users",usersroute);
app.use("/api/hotels",hotelroute);
app.use("/api/rooms",roomroute);

app.use((err,req,res,next)=>{
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong";
    return res.status(errorStatus).json({
        success:false,
        status:errorStatus,
        message:errorMessage,
        stack:err.stack,
    });
});

app.listen(8800,()=>{
    connect()
    console.log("connected to backend.");
})