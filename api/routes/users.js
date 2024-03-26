import express from "express";
import { deleteUser, getUser, getUsers, updateUser } from "../controllers/user.js";
import { verifyAdmin, verifyToken, verifyUser } from "../utils/verifytoken.js";

const router = express.Router()

// router.get("/checkauthentication",verifyToken,(req,res,next)=>{
//     res.send("You are logged in successfully!")
// })
// router.get("/checkuser/:id",verifyUser,(req,res,next)=>{
//     res.send("Helloe user, You are Logged in and can delete this account");
// });
// router.get("/checkadmin/:id",verifyAdmin,(req,res,next)=>{
//     res.send("Helloe Admin, You are Logged in and can delete any account");
// });
//update
router.put("/id:",verifyUser ,updateUser);

//delete
router.delete("/id:",verifyUser,deleteUser);
 
//get
router.get("/id:",verifyUser,getUser);

//getall
router.get("/",verifyAdmin,getUsers);

export default router;
