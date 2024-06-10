import prisma from "..";
import {hashSync,compareSync} from "bcrypt";
import * as jwt from "jsonwebtoken";
import {NextFunction, Request,Response} from "express";  
import { JWT_SECRET } from "../secret";
import { BadRequestException } from "../exceptions/bad-request";
import { ErrorCodes } from "../exceptions/root";


export const signup=async (req:Request,res:Response,next:NextFunction)=>{
    const {email,name,password}=req.body;
    let user=await prisma.user.findFirst({where:{email}});
    if(user){
        // throw Error("User already exists");
        return next(new BadRequestException("User already exists!!",ErrorCodes.USER_ALREADY_EXISTS));
    }
    user=await prisma.user.create({
        data:{
            name,
            email,
            password:hashSync(password,10)
        }
    })
    res.json({status:200,data:user,msg:"User Created Succesfully"})
}

export const login=async (req:Request,res:Response,next:NextFunction)=>{
    const {email,password}=req.body;
    let user=await prisma.user.findFirst({where:{email}})
    if(!user){
        // throw Error("");
        return next(new BadRequestException("User does not exists",ErrorCodes.USER_NOT_FOUND));
    }
    if(!compareSync(user.password,password)){
        // throw Error("Incorrect Password");
        return next(new BadRequestException("Incorrect Password",ErrorCodes.INCORRECT_PASSWORD));

    }
    const token=jwt.sign({
        userID:user.id
    },JWT_SECRET)
    res.json({status:200,user,token,msg:"User logged in successfully"})
}
// return keyword added by me to avoid user being null