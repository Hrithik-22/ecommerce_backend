import prisma from "..";
import {hashSync,compareSync} from "bcrypt";
import * as jwt from "jsonwebtoken";
import {Request,Response} from "express";  


export const signup=async (req:Request,res:Response)=>{
    const {email,name,password}=req.body;
    let user=await prisma.user.findFirst({where:{email}});
    if(user){
        throw Error("User already exists");
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

export const login=async (req:Request,res:Response)=>{
    const {email,password}=req.body;
    let user=await prisma.user.findFirst({where:{email}})
    if(!user){
        throw Error("User does not exists");
    }
    if(!compareSync(user.password,password)){
        throw Error("Incorrect Password");
    }
    
}