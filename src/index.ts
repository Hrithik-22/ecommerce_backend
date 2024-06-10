import  express,{Express,Request,Response}  from "express";
const app:Express=express();
import { PORT } from "./secret";
import rootRouter from "./routes";
app.get('/',(req:Request,res:Response)=>{
    res.send("Working");
})
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api',rootRouter);
import {  PrismaClient } from "@prisma/client";
import { errorMiddlware } from "./middlewares/errors";
const prisma=new PrismaClient({
    log:["query","error"],
});

export default prisma;
app.use(errorMiddlware);

app.listen(PORT,()=>console.log(`The Port is running on ${PORT}`));
