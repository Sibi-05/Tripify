import jwt from "jsonwebtoken";
import HttpError from "../models/Error.js";

const authMiddleWare = async(req,res,next)=>{

    const Authorization = req.headers.Authorization || req.headers.authorization;
    if(Authorization && Authorization.startsWith("Bearer")){
        const token = Authorization.split(" ")[1]
        jwt.verify(token,process.env.JWT_SECRET,(err,info)=>{
            if(err){
                return next(new HttpError("UnAuthorized. Invalid Token", 403))
            }
            req.user = info;
            next()
        })
    }
    else{
        return next(new HttpError("UnAuthorized. No Token",401))
    }
}

export default authMiddleWare;